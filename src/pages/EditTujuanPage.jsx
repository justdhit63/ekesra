// src/pages/EditTujuanPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { FaPlus, FaTrash } from 'react-icons/fa';

const initialIndicatorState = {
  deskripsi_indikator: '',
  satuan: '',
  kondisi_awal: '',
  target_tahun_1: '',
  target_tahun_2: '',
  target_tahun_3: '',
  target_tahun_4: '',
  target_tahun_5: '',
  kondisi_akhir: '',
};

function EditTujuanPage() {
  const { id } = useParams(); // Ambil ID dari URL
  const navigate = useNavigate();

  // State
  const [sasaranList, setSasaranList] = useState([]);
  const [selectedSasaranId, setSelectedSasaranId] = useState('');
  const [deskripsiTujuan, setDeskripsiTujuan] = useState('');
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. Ambil data yang ada untuk di-edit
  useEffect(() => {
    const fetchData = async () => {
      // Ambil data tujuan spesifik beserta indikatornya
      const { data: tujuanData, error } = await supabase
        .from('renstra_tujuan')
        .select(`*, renstra_indikator(*)`)
        .eq('id', id)
        .single();

      if (error) {
        alert("Gagal mengambil data tujuan!");
        console.error(error);
        navigate('/renstra/tujuan');
      } else {
        // Isi state form dengan data yang ada
        setSelectedSasaranId(tujuanData.sasaran_id);
        setDeskripsiTujuan(tujuanData.deskripsi_tujuan);
        setIndicators(tujuanData.renstra_indikator.length > 0 ? tujuanData.renstra_indikator : [initialIndicatorState]);
      }
      
      // Ambil juga daftar sasaran untuk dropdown
      // (Untuk memungkinkan mengubah sasaran induk dari tujuan ini)
      const { data: sasaranDataList } = await supabase.from('renstra_sasaran').select('*');
      if (sasaranDataList) setSasaranList(sasaranDataList);

      setLoading(false);
    };

    fetchData();
  }, [id, navigate]);
  
  // Handler untuk input indikator (sama seperti form tambah)
  const handleIndicatorChange = (index, event) => {
    const values = [...indicators];
    values[index][event.target.name] = event.target.value;
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

    // Update data utama di tabel renstra_tujuan
    const { error: tujuanError } = await supabase
      .from('renstra_tujuan')
      .update({
        sasaran_id: selectedSasaranId,
        deskripsi_tujuan: deskripsiTujuan,
      })
      .eq('id', id);

    if (tujuanError) {
      alert('Gagal memperbarui tujuan: ' + tujuanError.message);
      setSaving(false);
      return;
    }

    // Hapus semua indikator lama yang terkait
    await supabase.from('renstra_indikator').delete().eq('tujuan_id', id);
    
    // Siapkan dan insert ulang semua indikator dari form
    const indicatorsToInsert = indicators.map(({ id: indicatorId, ...rest }) => ({
      ...rest,
      tujuan_id: id,
    }));
    
    const { error: indicatorError } = await supabase
      .from('renstra_indikator')
      .insert(indicatorsToInsert);

    if (indicatorError) {
      alert('Gagal memperbarui indikator: ' + indicatorError.message);
    } else {
      alert('Data Renstra Tujuan berhasil diperbarui!');
      navigate('/renstra/tujuan');
    }
    setSaving(false);
  };
  
  if (loading) {
    return <div className="p-6">Memuat data untuk diedit...</div>;
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Form Edit Renstra Tujuan</h1>
      
      <form onSubmit={handleUpdate} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div>
            <label className="block text-sm font-medium text-gray-700">Sasaran Kota</label>
            <select value={selectedSasaranId} onChange={(e) => setSelectedSasaranId(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
              <option value="">Pilih Sasaran</option>
              {sasaranList.map(s => <option key={s.id} value={s.id}>{s.deskripsi_sasaran}</option>)}
            </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tujuan</label>
          <textarea value={deskripsiTujuan} onChange={(e) => setDeskripsiTujuan(e.target.value)} rows="3" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"></textarea>
        </div>

        {/* Indikator Dinamis */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">Indikator Tujuan</h3>
          {indicators.map((indicator, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md border relative">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" name="deskripsi_indikator" placeholder="Indikator Tujuan *" value={indicator.deskripsi_indikator} onChange={e => handleIndicatorChange(index, e)} required className="col-span-3 border border-gray-300 bg-white shadow-md rounded-md p-2" />
                <input type="text" name="satuan" placeholder="Satuan *" value={indicator.satuan} onChange={e => handleIndicatorChange(index, e)} required className="border border-gray-300 bg-white shadow-md rounded-md p-2" />
                <input type="text" name="kondisi_awal" placeholder="Kondisi Awal *" value={indicator.kondisi_awal} onChange={e => handleIndicatorChange(index, e)} required className="border border-gray-300 bg-white shadow-md rounded-md p-2" />
                <input type="text" name="target_tahun_1" placeholder="Target 2025 *" value={indicator.target_tahun_1} onChange={e => handleIndicatorChange(index, e)} required className="border border-gray-300 bg-white shadow-md rounded-md p-2" />
                 <input type="text" name="kondisi_akhir" placeholder="Kondisi Akhir *" value={indicator.kondisi_akhir} onChange={e => handleIndicatorChange(index, e)} required className="border border-gray-300 bg-white shadow-md rounded-md p-2" />
              </div>
              <button type="button" onClick={() => handleRemoveIndicator(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                <FaTrash />
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddIndicator} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center">
            <FaPlus className="mr-2" />
            Tambah Indikator
          </button>
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end space-x-4">
          <Link to="/renstra/tujuan" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
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

export default EditTujuanPage;