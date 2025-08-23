// src/pages/EditKegiatanPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function EditKegiatanPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [programList, setProgramList] = useState([]);
  const [selectedDaerahId, setSelectedDaerahId] = useState('');
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [deskripsiKegiatan, setDeskripsiKegiatan] = useState('');
  const [sumberAnggaran, setSumberAnggaran] = useState('');
  const [anggaran, setAnggaran] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: kegiatanData, error } = await supabase
        .from('renstra_kegiatan')
        .select(`*, renstra_program(*, renstra_sasaran(*, renstra_tujuan(*)))`)
        .eq('id', id)
        .single();
      
      if (error) {
        alert("Gagal mengambil data kegiatan!");
        navigate('/renstra/kegiatan');
        return;
      }
      
      const pdId = kegiatanData.renstra_program.renstra_sasaran.renstra_tujuan.perangkat_daerah_id;

      // Isi state form
      setDeskripsiKegiatan(kegiatanData.deskripsi_kegiatan);
      setSumberAnggaran(kegiatanData.sumber_anggaran);
      setAnggaran({
          tahun1: kegiatanData.anggaran_tahun_1,
          tahun2: kegiatanData.anggaran_tahun_2,
          tahun3: kegiatanData.anggaran_tahun_3,
          tahun4: kegiatanData.anggaran_tahun_4,
          tahun5: kegiatanData.anggaran_tahun_5,
      });
      setSelectedProgramId(kegiatanData.program_id);
      
      // Ambil daftar PD dan Program untuk dropdown
      const { data: pdData } = await supabase.from('perangkat_daerah').select('*');
      if (pdData) setPerangkatDaerahList(pdData);
      
      const { data: programDataList } = await supabase.rpc('get_program_by_pd_simple', { pd_id: pdId });
      if (programDataList) setProgramList(programDataList);

      // Set state dropdown setelah semua list diambil
      setSelectedDaerahId(pdId);
      
      setLoading(false);
    };
    fetchData();
  }, [id, navigate]);

  // useEffect untuk filter dropdown Program saat PD berubah
  useEffect(() => {
    if (!selectedDaerahId || loading) return;
    const fetchPrograms = async () => {
      const { data } = await supabase.rpc('get_program_by_pd_simple', { pd_id: selectedDaerahId });
      setProgramList(data || []);
      if (!data?.find(p => p.id === selectedProgramId)) {
        setSelectedProgramId('');
      }
    };
    fetchPrograms();
  }, [selectedDaerahId, loading]);

  const handleAnggaranChange = (e) => {
    const { name, value } = e.target;
    setAnggaran(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setSaving(true);
    const { error } = await supabase
      .from('renstra_kegiatan')
      .update({
        program_id: selectedProgramId,
        deskripsi_kegiatan: deskripsiKegiatan,
        sumber_anggaran: sumberAnggaran,
        anggaran_tahun_1: anggaran.tahun1,
        anggaran_tahun_2: anggaran.tahun2,
        anggaran_tahun_3: anggaran.tahun3,
        anggaran_tahun_4: anggaran.tahun4,
        anggaran_tahun_5: anggaran.tahun5,
      })
      .eq('id', id);
    if (error) {
      alert('Gagal memperbarui kegiatan: ' + error.message);
    } else {
      alert('Data Renstra Kegiatan berhasil diperbarui!');
      navigate('/renstra/kegiatan');
    }
    setSaving(false);
  };

  if (loading) return <div className="p-6">Memuat data...</div>;

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Form Edit Renstra Kegiatan</h1>
      
      <form onSubmit={handleUpdate} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Perangkat Daerah</label>
            <select value={selectedDaerahId} onChange={(e) => setSelectedDaerahId(e.target.value)} required className="mt-1 block w-full border p-2 rounded-md">
              <option value="">Pilih PD</option>
              {perangkatDaerahList.map(pd => <option key={pd.id} value={pd.id}>{pd.nama_daerah}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Program</label>
            <select value={selectedProgramId} onChange={(e) => setSelectedProgramId(e.target.value)} required disabled={!selectedDaerahId} className="mt-1 block w-full border p-2 rounded-md">
              <option value="">Pilih Program</option>
              {programList.map(p => <option key={p.id} value={p.id}>{p.deskripsi_program}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Kegiatan</label>
          <textarea value={deskripsiKegiatan} onChange={(e) => setDeskripsiKegiatan(e.target.value)} rows="3" required className="mt-1 block w-full border p-2 rounded-md"></textarea>
        </div>
        
        <div>
            <label className="block text-sm font-medium text-gray-700">Sumber Anggaran</label>
            <input type="text" value={sumberAnggaran || ''} onChange={(e) => setSumberAnggaran(e.target.value)} required className="mt-1 block w-full border p-2 rounded-md"/>
        </div>

        <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Anggaran Kegiatan (Rp)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <input type="number" name="tahun1" placeholder="Anggaran 2025" value={anggaran.tahun1 || ''} onChange={handleAnggaranChange} required className="border p-2 rounded-md" />
                <input type="number" name="tahun2" placeholder="Anggaran 2026" value={anggaran.tahun2 || ''} onChange={handleAnggaranChange} required className="border p-2 rounded-md" />
                <input type="number" name="tahun3" placeholder="Anggaran 2027" value={anggaran.tahun3 || ''} onChange={handleAnggaranChange} required className="border p-2 rounded-md" />
                <input type="number" name="tahun4" placeholder="Anggaran 2028" value={anggaran.tahun4 || ''} onChange={handleAnggaranChange} required className="border p-2 rounded-md" />
                <input type="number" name="tahun5" placeholder="Anggaran 2029" value={anggaran.tahun5 || ''} onChange={handleAnggaranChange} required className="border p-2 rounded-md" />
            </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Link to="/renstra/kegiatan" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
            Batal
          </Link>
          <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300">
            {saving ? 'Memperbarui...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditKegiatanPage;