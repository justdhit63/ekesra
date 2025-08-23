// src/pages/TambahSasaranPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { FaPlus, FaTrash } from 'react-icons/fa';

// State awal untuk satu baris indikator
const initialIndicatorState = {
  deskripsi_indikator: '',
  pk: false,
  iku: false,
  satuan: '',
  cara_pengukuran: '',
  kondisi_awal: '',
  target_tahun_1: '',
  target_tahun_2: '',
  target_tahun_3: '',
  target_tahun_4: '',
  target_tahun_5: '',
  kondisi_akhir: '',
};

function TambahSasaranPage() {
  // State untuk dropdown
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [tujuanList, setTujuanList] = useState([]);

  // State untuk data yang dipilih
  const [selectedDaerahId, setSelectedDaerahId] = useState('');
  const [selectedTujuanId, setSelectedTujuanId] = useState('');
  
  // State untuk input form
  const [deskripsiSasaran, setDeskripsiSasaran] = useState('');
  const [indicators, setIndicators] = useState([{ ...initialIndicatorState }]);
  
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // Ambil daftar Perangkat Daerah saat komponen dimuat
  useEffect(() => {
    const fetchPerangkatDaerah = async () => {
      const { data } = await supabase.from('perangkat_daerah').select('*');
      if (data) setPerangkatDaerahList(data);
    };
    fetchPerangkatDaerah();
  }, []);

  // Ambil daftar Renstra Tujuan berdasarkan Perangkat Daerah yang dipilih
  useEffect(() => {
    if (!selectedDaerahId) {
      setTujuanList([]);
      setSelectedTujuanId('');
      return;
    }
    const fetchTujuan = async () => {
      const { data } = await supabase.from('renstra_tujuan').select('*').eq('perangkat_daerah_id', selectedDaerahId);
      if (data) setTujuanList(data);
    };
    fetchTujuan();
  }, [selectedDaerahId]);


  // Handler untuk input indikator (termasuk checkbox)
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
  
  // Handler untuk submit form
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    const { data: sasaranData, error: sasaranError } = await supabase
      .from('renstra_sasaran')
      .insert({
        tujuan_id: selectedTujuanId,
        deskripsi_sasaran: deskripsiSasaran,
        periode_awal: 2025, 
        periode_akhir: 2029,
      })
      .select()
      .single();

    if (sasaranError) {
      alert('Gagal menyimpan sasaran: ' + sasaranError.message);
      setSaving(false);
      return;
    }

    const indicatorsToInsert = indicators.map(indicator => ({
      ...indicator,
      sasaran_id: sasaranData.id,
    }));

    const { error: indicatorError } = await supabase
      .from('renstra_indikator_sasaran')
      .insert(indicatorsToInsert);

    if (indicatorError) {
      alert('Gagal menyimpan indikator: ' + indicatorError.message);
    } else {
      alert('Data Renstra Sasaran berhasil disimpan!');
      navigate('/renstra/sasaran');
    }
    setSaving(false);
  };


  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Form Tambah Renstra Sasaran</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Perangkat Daerah</label>
                <select value={selectedDaerahId} onChange={(e) => setSelectedDaerahId(e.target.value)} required className="mt-1 block w-full border p-2 rounded-md">
                <option value="">Pilih Perangkat Daerah</option>
                {perangkatDaerahList.map(pd => <option key={pd.id} value={pd.id}>{pd.nama_daerah}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Renstra Tujuan (Induk)</label>
                <select value={selectedTujuanId} onChange={(e) => setSelectedTujuanId(e.target.value)} required disabled={!selectedDaerahId} className="mt-1 block w-full border p-2 rounded-md">
                <option value="">Pilih Renstra Tujuan</option>
                {tujuanList.map(t => <option key={t.id} value={t.id}>{t.deskripsi_tujuan}</option>)}
                </select>
            </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Sasaran Perangkat Daerah</label>
          <textarea value={deskripsiSasaran} onChange={(e) => setDeskripsiSasaran(e.target.value)} rows="3" required className="mt-1 block w-full border p-2 rounded-md"></textarea>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">Indikator Sasaran</h3>
          {indicators.map((indicator, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md border relative">
               <button type="button" onClick={() => handleRemoveIndicator(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                <FaTrash />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                <input type="text" name="deskripsi_indikator" placeholder="Indikator sasaran *" value={indicator.deskripsi_indikator} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
                <input type="text" name="satuan" placeholder="Satuan *" value={indicator.satuan} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
                <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="pk" checked={indicator.pk} onChange={e => handleIndicatorChange(index, e)} /><span>PK</span></label>
                    <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="iku" checked={indicator.iku} onChange={e => handleIndicatorChange(index, e)} /><span>IKU</span></label>
                </div>
                <input type="text" name="cara_pengukuran" placeholder="Cara Pengukuran *" value={indicator.cara_pengukuran} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
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
          <Link to="/renstra/sasaran" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
            Batal
          </Link>
          <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300">
            {saving ? 'Menyimpan...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TambahSasaranPage;