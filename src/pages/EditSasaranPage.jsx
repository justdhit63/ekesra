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
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [tujuanList, setTujuanList] = useState([]);
  
  const [selectedDaerahId, setSelectedDaerahId] = useState('');
  const [selectedTujuanId, setSelectedTujuanId] = useState('');
  const [deskripsiSasaran, setDeskripsiSasaran] = useState('');
  const [indicators, setIndicators] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Ambil data yang ada untuk di-edit
  useEffect(() => {
    const fetchData = async () => {
      const { data: pdData } = await supabase.from('perangkat_daerah').select('*');
      if (pdData) setPerangkatDaerahList(pdData);

      const { data: sasaranData, error } = await supabase
        .from('renstra_sasaran')
        .select(`
          *, 
          renstra_tujuan ( perangkat_daerah_id ),
          renstra_indikator_sasaran(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        alert("Gagal mengambil data sasaran!");
        navigate('/renstra/sasaran');
        return;
      }
        
      const pdId = sasaranData.renstra_tujuan.perangkat_daerah_id;
      setDeskripsiSasaran(sasaranData.deskripsi_sasaran);
      setSelectedTujuanId(sasaranData.tujuan_id);
      setSelectedDaerahId(pdId);
      
      const { data: tujuanData } = await supabase.from('renstra_tujuan').select('*').eq('perangkat_daerah_id', pdId);
      if(tujuanData) setTujuanList(tujuanData);
      
      setIndicators(sasaranData.renstra_indikator_sasaran.length > 0 
        ? sasaranData.renstra_indikator_sasaran 
        : [{ ...initialIndicatorState }]);
      
      setLoading(false);
    };

    fetchData();
  }, [id, navigate]);

  // Ambil daftar Renstra Tujuan setiap kali Perangkat Daerah berubah
  useEffect(() => {
    if (!selectedDaerahId || loading) return;
    const fetchTujuan = async () => {
      const { data } = await supabase.from('renstra_tujuan').select('*').eq('perangkat_daerah_id', selectedDaerahId);
      if (data) {
        setTujuanList(data);
        if (!data.find(t => t.id === selectedTujuanId)) {
            setSelectedTujuanId('');
        }
      }
    };
    fetchTujuan();
  }, [selectedDaerahId, loading, selectedTujuanId]);
  
  
  // <-- BAGIAN YANG DILENGKAPI: Handler untuk indikator dinamis -->
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
  
  // Handler untuk UPDATE data
  const handleUpdate = async (event) => {
    event.preventDefault();
    setSaving(true);

    await supabase
      .from('renstra_sasaran')
      .update({
        tujuan_id: selectedTujuanId,
        deskripsi_sasaran: deskripsiSasaran,
        periode_awal: 2025,
        periode_akhir: 2029,
      })
      .eq('id', id);

    await supabase.from('renstra_indikator_sasaran').delete().eq('sasaran_id', id);
    
    const indicatorsToInsert = indicators.map(({ id: indicatorId, sasaran_id, ...rest }) => ({
      ...rest,
      sasaran_id: id,
    }));
    
    const { error } = await supabase.from('renstra_indikator_sasaran').insert(indicatorsToInsert);

    if (error) {
        alert('Gagal memperbarui indikator: ' + error.message);
    } else {
        alert('Data Renstra Sasaran berhasil diperbarui!');
        navigate('/renstra/sasaran');
    }
    setSaving(false);
  };
  
  if (loading) return <div className="p-6">Memuat data...</div>;

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Form Edit Renstra Sasaran</h1>
      
      <form onSubmit={handleUpdate} className="bg-white p-6 rounded-lg shadow-md space-y-6">
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

        {/* <-- BAGIAN YANG DILENGKAPI: Form Indikator Dinamis --> */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">Indikator Sasaran</h3>
          {indicators.map((indicator, index) => (
            <div key={indicator.id || index} className="bg-gray-50 p-4 rounded-md border relative">
               <button type="button" onClick={() => handleRemoveIndicator(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                <FaTrash />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                <input type="text" name="deskripsi_indikator" placeholder="Indikator sasaran *" value={indicator.deskripsi_indikator || ''} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
                <input type="text" name="satuan" placeholder="Satuan *" value={indicator.satuan || ''} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
                <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="pk" checked={indicator.pk || false} onChange={e => handleIndicatorChange(index, e)} /><span>PK</span></label>
                    <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="iku" checked={indicator.iku || false} onChange={e => handleIndicatorChange(index, e)} /><span>IKU</span></label>
                </div>
                <input type="text" name="cara_pengukuran" placeholder="Cara Pengukuran *" value={indicator.cara_pengukuran || ''} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
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
          <Link to="/renstra/sasaran" className="bg-gray-200 py-2 px-4 rounded">Batal</Link>
          <button type="submit" disabled={saving} className="bg-blue-600 text-white py-2 px-4 rounded">
            {saving ? 'Memperbarui...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditSasaranPage;