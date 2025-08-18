// src/pages/TambahSasaranProgramPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { FaPlus, FaTrash } from 'react-icons/fa';

const initialIndicatorState = {
  deskripsi_indikator: '',
  satuan: '',
  pk: false,
  ir: false,
  cara_pengukuran: '',
  kondisi_awal: '',
  target_tahun_1: '',
  target_tahun_2: '',
  target_tahun_3: '',
  target_tahun_4: '',
  target_tahun_5: '',
  kondisi_akhir: '',
};

function TambahSasaranProgramPage() {
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [programList, setProgramList] = useState([]);
  
  const [selectedDaerahId, setSelectedDaerahId] = useState('');
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [deskripsiSasaranProgram, setDeskripsiSasaranProgram] = useState('');
  const [indicators, setIndicators] = useState([{ ...initialIndicatorState }]);
  
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // Ambil daftar Perangkat Daerah
  useEffect(() => {
    const fetchPerangkatDaerah = async () => {
      const { data } = await supabase.from('perangkat_daerah').select('*');
      if (data) setPerangkatDaerahList(data);
    };
    fetchPerangkatDaerah();
  }, []);

  // Ambil daftar Program berdasarkan Perangkat Daerah yang dipilih
  useEffect(() => {
    if (!selectedDaerahId) {
        setProgramList([]);
        setSelectedProgramId('');
        return;
    };
    const fetchPrograms = async () => {
        const { data: sasarans } = await supabase.from('renstra_sasaran').select('id').eq('perangkat_daerah_id', selectedDaerahId);
        if (sasarans && sasarans.length > 0) {
            const sasaranIds = sasarans.map(s => s.id);
            const { data: programs } = await supabase.from('renstra_program').select('*').in('sasaran_id', sasaranIds);
            if(programs) setProgramList(programs);
        } else {
            setProgramList([]);
        }
    };
    fetchPrograms();
  }, [selectedDaerahId]);
  
  // Handler untuk input indikator
  const handleIndicatorChange = (index, event) => {
    const values = [...indicators];
    const { name, value, type, checked } = event.target;
    values[index][name] = type === 'checkbox' ? checked : value;
    setIndicators(values);
  };

  const handleAddIndicator = () => {
    setIndicators([...indicators, { ...initialIndicatorState }]);
  };

  const handleRemoveIndicator = (index) => {
    if (indicators.length > 1) {
      const values = [...indicators];
      values.splice(index, 1);
      setIndicators(values);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // 1. Insert data utama ke renstra_sasaran_program
    const { data: sasaranProgramData, error: sasaranError } = await supabase
        .from('renstra_sasaran_program')
        .insert({ program_id: selectedProgramId, deskripsi_sasaran_program: deskripsiSasaranProgram })
        .select().single();

    if(sasaranError) { 
      alert("Gagal menyimpan Sasaran Program: " + sasaranError.message);
      setSaving(false);
      return;
    }

    // 2. Siapkan dan insert data indikator
    const indicatorsToInsert = indicators.map(ind => ({ ...ind, sasaran_program_id: sasaranProgramData.id }));
    const { error: indicatorError } = await supabase.from('renstra_indikator_sasaran_program').insert(indicatorsToInsert);

    if (indicatorError) {
        alert("Gagal menyimpan Indikator: " + indicatorError.message);
    } else {
        alert('Data Sasaran Program berhasil disimpan!');
        navigate('/renstra/program/sasaran');
    }
    setSaving(false);
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Form Tambah Renstra Sasaran Program</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Perangkat Daerah</label>
                <select value={selectedDaerahId} onChange={e => setSelectedDaerahId(e.target.value)} required className="w-full border p-2 rounded mt-1">
                    <option value="">Pilih PD</option>
                    {perangkatDaerahList.map(pd => <option key={pd.id} value={pd.id}>{pd.nama_daerah}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Program PD</label>
                <select value={selectedProgramId} onChange={e => setSelectedProgramId(e.target.value)} required disabled={!selectedDaerahId} className="w-full border p-2 rounded mt-1">
                    <option value="">Pilih Program</option>
                    {programList.map(prog => <option key={prog.id} value={prog.id}>{prog.deskripsi_program}</option>)}
                </select>
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Sasaran Program</label>
            <textarea value={deskripsiSasaranProgram} onChange={e => setDeskripsiSasaranProgram(e.target.value)} required className="w-full border p-2 rounded mt-1" rows="3"></textarea>
        </div>
        
        {/* Indikator Dinamis */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">Indikator Sasaran Program</h3>
          {indicators.map((indicator, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md border relative">
              <button type="button" onClick={() => handleRemoveIndicator(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                <FaTrash />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <input type="text" name="deskripsi_indikator" placeholder="Indikator sasaran *" value={indicator.deskripsi_indikator} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" name="satuan" placeholder="Satuan *" value={indicator.satuan} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
                  <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="pk" checked={indicator.pk} onChange={e => handleIndicatorChange(index, e)} /><span>PK</span></label>
                      <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="ir" checked={indicator.ir} onChange={e => handleIndicatorChange(index, e)} /><span>IR</span></label>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cara Pengukuran</label>
                <input type="text" name="cara_pengukuran" placeholder="Cara Pengukuran *" value={indicator.cara_pengukuran} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md w-full" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mt-4">
                <input type="text" name="kondisi_awal" placeholder="Kondisi Awal *" value={indicator.kondisi_awal} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
                <input type="text" name="target_tahun_1" placeholder="Target 2025 *" value={indicator.target_tahun_1} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
                <input type="text" name="target_tahun_2" placeholder="Target 2026 *" value={indicator.target_tahun_2} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
                <input type="text" name="target_tahun_3" placeholder="Target 2027 *" value={indicator.target_tahun_3} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
                <input type="text" name="target_tahun_4" placeholder="Target 2028 *" value={indicator.target_tahun_4} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
                <input type="text" name="target_tahun_5" placeholder="Target 2029 *" value={indicator.target_tahun_5} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
                <input type="text" name="kondisi_akhir" placeholder="Kondisi Akhir *" value={indicator.kondisi_akhir} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
              </div>
            </div>
          ))}
          <button type="button" onClick={handleAddIndicator} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center">
            <FaPlus className="mr-2" />
            Tambah Indikator
          </button>
        </div>

        <div className="flex justify-end space-x-4">
            <Link to="/renstra/program/sasaran" className="bg-gray-200 py-2 px-4 rounded">Cancel</Link>
            <button type="submit" disabled={saving} className="bg-blue-600 text-white py-2 px-4 rounded">{saving ? 'Menyimpan...' : 'Submit'}</button>
        </div>
      </form>
    </div>
  );
}

export default TambahSasaranProgramPage;