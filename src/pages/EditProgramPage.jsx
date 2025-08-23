// src/pages/EditProgramPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function EditProgramPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [tujuanList, setTujuanList] = useState([]);
  const [sasaranList, setSasaranList] = useState([]);

  const [selectedDaerahId, setSelectedDaerahId] = useState('');
  const [selectedTujuanId, setSelectedTujuanId] = useState('');
  const [selectedSasaranId, setSelectedSasaranId] = useState('');
  
  const [deskripsiProgram, setDeskripsiProgram] = useState('');
  const [sumberAnggaran, setSumberAnggaran] = useState('');
  const [anggaran, setAnggaran] = useState({});
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Ambil data yang ada untuk di-edit
  useEffect(() => {
    const fetchData = async () => {
      // Ambil data program, join sampai ke PD untuk mendapatkan semua ID induk
      const { data: programData, error } = await supabase
        .from('renstra_program')
        .select(`
          *, 
          renstra_sasaran (
            id, 
            deskripsi_sasaran, 
            tujuan_id, 
            renstra_tujuan(
              id, 
              deskripsi_tujuan, 
              perangkat_daerah_id
            )
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        alert("Gagal mengambil data program!");
        navigate('/renstra/program');
        return;
      }
      
      // Isi semua state dari data yang diambil
      const pdId = programData.renstra_sasaran.renstra_tujuan.perangkat_daerah_id;
      const tujuanId = programData.renstra_sasaran.tujuan_id;
      
      setSelectedDaerahId(pdId);
      setSelectedTujuanId(tujuanId);
      setSelectedSasaranId(programData.sasaran_id);
      setDeskripsiProgram(programData.deskripsi_program);
      setSumberAnggaran(programData.sumber_anggaran);
      setAnggaran({
          tahun1: programData.anggaran_tahun_1,
          tahun2: programData.anggaran_tahun_2,
          tahun3: programData.anggaran_tahun_3,
          tahun4: programData.anggaran_tahun_4,
          tahun5: programData.anggaran_tahun_5,
          renja: programData.anggaran_renja,
      });
      
      // Ambil semua data untuk dropdown
      const { data: pdData } = await supabase.from('perangkat_daerah').select('*');
      if (pdData) setPerangkatDaerahList(pdData);
      
      const { data: tujuanData } = await supabase.from('renstra_tujuan').select('*').eq('perangkat_daerah_id', pdId);
      if (tujuanData) setTujuanList(tujuanData);
      
      const { data: sasaranData } = await supabase.from('renstra_sasaran').select('*').eq('tujuan_id', tujuanId);
      if (sasaranData) setSasaranList(sasaranData);
      
      setLoading(false);
    };
    fetchData();
  }, [id, navigate]);

  // useEffect tambahan untuk memfilter dropdown (sama seperti form Tambah)
  useEffect(() => {
    if (!selectedDaerahId || loading) return;
    const fetchTujuan = async () => {
      const { data } = await supabase.from('renstra_tujuan').select('*').eq('perangkat_daerah_id', selectedDaerahId);
      setTujuanList(data || []);
      if (!data?.find(t => t.id === selectedTujuanId)) {
        setSelectedTujuanId('');
      }
    };
    fetchTujuan();
  }, [selectedDaerahId, loading]);

  useEffect(() => {
    if (!selectedTujuanId || loading) return;
    const fetchSasaran = async () => {
      const { data } = await supabase.from('renstra_sasaran').select('*').eq('tujuan_id', selectedTujuanId);
      setSasaranList(data || []);
      if (!data?.find(s => s.id === selectedSasaranId)) {
        setSelectedSasaranId('');
      }
    };
    fetchSasaran();
  }, [selectedTujuanId, loading]);
  
  const handleAnggaranChange = (e) => {
    const { name, value } = e.target;
    setAnggaran(prev => ({ ...prev, [name]: value }));
  };
  
  const handleUpdate = async (event) => {
    event.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('renstra_program')
      .update({
        sasaran_id: selectedSasaranId,
        deskripsi_program: deskripsiProgram,
        sumber_anggaran: sumberAnggaran,
        anggaran_tahun_1: anggaran.tahun1,
        anggaran_tahun_2: anggaran.tahun2,
        anggaran_tahun_3: anggaran.tahun3,
        anggaran_tahun_4: anggaran.tahun4,
        anggaran_tahun_5: anggaran.tahun5,
        anggaran_renja: anggaran.renja,
      })
      .eq('id', id);

    if (error) {
      alert('Gagal memperbarui program: ' + error.message);
    } else {
      alert('Data Renstra Program berhasil diperbarui!');
      navigate('/renstra/program');
    }
    setSaving(false);
  };

  if (loading) return <div className="p-6">Memuat data...</div>;

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Form Edit Renstra Program</h1>
      
      <form onSubmit={handleUpdate} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Perangkat Daerah</label>
            <select value={selectedDaerahId} onChange={(e) => setSelectedDaerahId(e.target.value)} required className="mt-1 block w-full border p-2 rounded-md">
              <option value="">Pilih PD</option>
              {perangkatDaerahList.map(pd => <option key={pd.id} value={pd.id}>{pd.nama_daerah}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Renstra Tujuan</label>
            <select value={selectedTujuanId} onChange={(e) => setSelectedTujuanId(e.target.value)} required disabled={!selectedDaerahId} className="mt-1 block w-full border p-2 rounded-md">
              <option value="">Pilih Tujuan</option>
              {tujuanList.map(t => <option key={t.id} value={t.id}>{t.deskripsi_tujuan}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Renstra Sasaran (Induk)</label>
            <select value={selectedSasaranId} onChange={(e) => setSelectedSasaranId(e.target.value)} required disabled={!selectedTujuanId} className="mt-1 block w-full border p-2 rounded-md">
              <option value="">Pilih Sasaran</option>
              {sasaranList.map(s => <option key={s.id} value={s.id}>{s.deskripsi_sasaran}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Program</label>
          <textarea value={deskripsiProgram} onChange={(e) => setDeskripsiProgram(e.target.value)} rows="3" required className="mt-1 block w-full border p-2 rounded-md"></textarea>
        </div>
        
        <div>
            <label className="block text-sm font-medium text-gray-700">Sumber Anggaran</label>
            <input type="text" value={sumberAnggaran || ''} onChange={(e) => setSumberAnggaran(e.target.value)} required className="mt-1 block w-full border p-2 rounded-md"/>
        </div>

        <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Anggaran Program (Rp)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <input type="number" name="tahun1" placeholder="Anggaran 2025" value={anggaran.tahun1 || ''} onChange={handleAnggaranChange} required className="border p-2 rounded-md" />
                <input type="number" name="tahun2" placeholder="Anggaran 2026" value={anggaran.tahun2 || ''} onChange={handleAnggaranChange} required className="border p-2 rounded-md" />
                <input type="number" name="tahun3" placeholder="Anggaran 2027" value={anggaran.tahun3 || ''} onChange={handleAnggaranChange} required className="border p-2 rounded-md" />
                <input type="number" name="tahun4" placeholder="Anggaran 2028" value={anggaran.tahun4 || ''} onChange={handleAnggaranChange} required className="border p-2 rounded-md" />
                <input type="number" name="tahun5" placeholder="Anggaran 2029" value={anggaran.tahun5 || ''} onChange={handleAnggaranChange} required className="border p-2 rounded-md" />
                <input type="number" name="renja" placeholder="Anggaran Renja" value={anggaran.renja || ''} onChange={handleAnggaranChange} required className="border p-2 rounded-md" />
            </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Link to="/renstra/program" className="bg-gray-200 py-2 px-4 rounded">Batal</Link>
          <button type="submit" disabled={saving} className="bg-blue-600 text-white py-2 px-4 rounded disabled:bg-blue-300">
            {saving ? 'Memperbarui...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProgramPage;