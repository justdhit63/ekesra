// src/pages/EditSasaranPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { FaPlus, FaTrash } from 'react-icons/fa';

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

function EditSasaranPage() {
  const { id } = useParams(); // Ambil ID dari URL
  const navigate = useNavigate();

  // State
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [selectedDaerahId, setSelectedDaerahId] = useState('');
  const [deskripsiSasaran, setDeskripsiSasaran] = useState('');
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. Ambil data yang ada untuk di-edit
  useEffect(() => {
    const fetchData = async () => {
      // Ambil data sasaran spesifik beserta indikatornya
      const { data: sasaranData, error } = await supabase
        .from('renstra_sasaran')
        .select(`*, renstra_indikator_sasaran(*)`)
        .eq('id', id)
        .single();

      if (error) {
        alert("Gagal mengambil data sasaran!");
        console.error(error);
        navigate('/renstra/sasaran');
      } else {
        // Isi state form dengan data yang ada
        setSelectedDaerahId(sasaranData.perangkat_daerah_id);
        setDeskripsiSasaran(sasaranData.deskripsi_sasaran);
        // Pastikan selalu ada minimal satu baris indikator
        setIndicators(sasaranData.renstra_indikator_sasaran.length > 0 
          ? sasaranData.renstra_indikator_sasaran 
          : [{ ...initialIndicatorState }]);
      }
      
      // Ambil juga daftar perangkat daerah untuk dropdown
      const { data: pdData } = await supabase.from('perangkat_daerah').select('*');
      if (pdData) setPerangkatDaerahList(pdData);

      setLoading(false);
    };

    fetchData();
  }, [id, navigate]);
  
  // Handler untuk input indikator (sama seperti form tambah)
  const handleIndicatorChange = (index, event) => {
    const values = [...indicators];
    const { name, value, type, checked } = event.target;
    // Hapus properti 'renstra_sasaran' jika ada, karena tidak diperlukan untuk update
    delete values[index].renstra_sasaran;
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
  
  // 2. Handler untuk UPDATE data
  const handleUpdate = async (event) => {
    event.preventDefault();
    setSaving(true);

    // Update data utama di tabel renstra_sasaran
    const { error: sasaranError } = await supabase
      .from('renstra_sasaran')
      .update({
        perangkat_daerah_id: selectedDaerahId,
        deskripsi_sasaran: deskripsiSasaran,
      })
      .eq('id', id);

    if (sasaranError) {
      alert('Gagal memperbarui sasaran: ' + sasaranError.message);
      setSaving(false);
      return;
    }

    // Hapus semua indikator lama yang terkait
    await supabase.from('renstra_indikator_sasaran').delete().eq('sasaran_id', id);
    
    // Siapkan dan insert ulang semua indikator dari form
    const indicatorsToInsert = indicators.map(({ id: indicatorId, ...rest }) => ({
      ...rest,
      sasaran_id: id,
    }));
    
    const { error: indicatorError } = await supabase
      .from('renstra_indikator_sasaran')
      .insert(indicatorsToInsert);

    if (indicatorError) {
      alert('Gagal memperbarui indikator: ' + indicatorError.message);
    } else {
      alert('Data Renstra Sasaran berhasil diperbarui!');
      navigate('/renstra/sasaran');
    }
    setSaving(false);
  };
  
  if (loading) {
    return <div className="p-6">Memuat data untuk diedit...</div>;
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Form Edit Renstra Sasaran</h1>
      
      <form onSubmit={handleUpdate} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div>
            <label className="block text-sm font-medium text-gray-700">Perangkat Daerah</label>
            <select value={selectedDaerahId} onChange={(e) => setSelectedDaerahId(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
              <option value="">Pilih Perangkat Daerah</option>
              {perangkatDaerahList.map(pd => <option key={pd.id} value={pd.id}>{pd.nama_daerah}</option>)}
            </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Sasaran Perangkat Daerah</label>
          <textarea value={deskripsiSasaran} onChange={(e) => setDeskripsiSasaran(e.target.value)} rows="3" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"></textarea>
        </div>

        <div className="space-y-4">
          {indicators.map((indicator, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md border relative">
               <button type="button" onClick={() => handleRemoveIndicator(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                <FaTrash />
              </button>
              {/* Layout Form Indikator */}
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
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300">
            {saving ? 'Menyimpan...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditSasaranPage;