// src/pages/EditSasaranProgramPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
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

function EditSasaranProgramPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [programList, setProgramList] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [deskripsiSasaranProgram, setDeskripsiSasaranProgram] = useState('');
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Ambil data spesifik yang akan diedit
      const { data: sasaranProgramData, error } = await supabase
        .from('renstra_sasaran_program')
        .select(`*, renstra_indikator_sasaran_program(*)`)
        .eq('id', id)
        .single();

      if (error) {
        alert("Gagal mengambil data!");
        navigate('/renstra/program/sasaran');
        return;
      }

      // 2. Isi state form dengan data yang ada
      setSelectedProgramId(sasaranProgramData.program_id);
      setDeskripsiSasaranProgram(sasaranProgramData.deskripsi_sasaran_program);
      setIndicators(sasaranProgramData.renstra_indikator_sasaran_program.length > 0 
        ? sasaranProgramData.renstra_indikator_sasaran_program 
        : [{ ...initialIndicatorState }]);

      // 3. Ambil daftar program untuk dropdown
      const { data: programs } = await supabase.from('renstra_program').select('*');
      if(programs) setProgramList(programs);

      setLoading(false);
    };

    fetchData();
  }, [id, navigate]);

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Update data induk
    const { error: sasaranError } = await supabase
        .from('renstra_sasaran_program')
        .update({ program_id: selectedProgramId, deskripsi_sasaran_program: deskripsiSasaranProgram })
        .eq('id', id);
    
    if (sasaranError) {
        alert("Gagal memperbarui data: " + sasaranError.message);
        setSaving(false);
        return;
    }

    // Hapus indikator lama dan masukkan ulang yang baru
    await supabase.from('renstra_indikator_sasaran_program').delete().eq('sasaran_program_id', id);

    const indicatorsToInsert = indicators.map(({ id: indicatorId, ...rest }) => ({ ...rest, sasaran_program_id: id }));
    const { error: indicatorError } = await supabase.from('renstra_indikator_sasaran_program').insert(indicatorsToInsert);

    if (indicatorError) {
        alert("Gagal memperbarui indikator: " + indicatorError.message);
    } else {
        alert('Data berhasil diperbarui!');
        navigate('/renstra/program/sasaran');
    }
    setSaving(false);
  };

  if (loading) return <div className="p-6">Memuat data...</div>;

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Form Edit Renstra Sasaran Program</h1>
      <form onSubmit={handleUpdate} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div>
            <label className="block text-sm font-medium text-gray-700">Program PD</label>
            <select value={selectedProgramId} onChange={e => setSelectedProgramId(e.target.value)} required className="w-full border p-2 rounded mt-1">
                <option value="">Pilih Program</option>
                {programList.map(prog => <option key={prog.id} value={prog.id}>{prog.deskripsi_program}</option>)}
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Sasaran Program</label>
            <textarea value={deskripsiSasaranProgram} onChange={e => setDeskripsiSasaranProgram(e.target.value)} required className="w-full border p-2 rounded mt-1" rows="3"></textarea>
        </div>
        
        {/* Form untuk Indikator Dinamis */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">Indikator Sasaran Program</h3>
          {indicators.map((indicator, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md border relative">
              <button type="button" onClick={() => handleRemoveIndicator(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                <FaTrash />
              </button>
              {/* Salin JSX untuk input indikator dari TambahSasaranProgramPage.jsx ke sini */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <input type="text" name="deskripsi_indikator" placeholder="Indikator sasaran *" value={indicator.deskripsi_indikator || ''} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" name="satuan" placeholder="Satuan *" value={indicator.satuan || ''} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
                  <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="pk" checked={indicator.pk} onChange={e => handleIndicatorChange(index, e)} /><span>PK</span></label>
                      <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="ir" checked={indicator.ir} onChange={e => handleIndicatorChange(index, e)} /><span>IR</span></label>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cara Pengukuran</label>
                <input type="text" name="cara_pengukuran" placeholder="Cara Pengukuran *" value={indicator.cara_pengukuran || ''} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md w-full" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mt-4">
                <input type="text" name="kondisi_awal" placeholder="Kondisi Awal *" value={indicator.kondisi_awal || ''} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
                <input type="text" name="target_tahun_1" placeholder="Target 2025 *" value={indicator.target_tahun_1 || ''} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
                <input type="text" name="target_tahun_2" placeholder="Target 2026 *" value={indicator.target_tahun_2 || ''} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
                <input type="text" name="target_tahun_3" placeholder="Target 2027 *" value={indicator.target_tahun_3 || ''} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
                <input type="text" name="target_tahun_4" placeholder="Target 2028 *" value={indicator.target_tahun_4 || ''} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
                <input type="text" name="target_tahun_5" placeholder="Target 2029 *" value={indicator.target_tahun_5 || ''} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
                <input type="text" name="kondisi_akhir" placeholder="Kondisi Akhir *" value={indicator.kondisi_akhir || ''} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
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
            <button type="submit" disabled={saving} className="bg-blue-600 text-white py-2 px-4 rounded">{saving ? 'Memperbarui...' : 'Update'}</button>
        </div>
      </form>
    </div>
  );
}

export default EditSasaranProgramPage;