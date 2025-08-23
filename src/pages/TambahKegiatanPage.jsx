// src/pages/TambahKegiatanPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function TambahKegiatanPage() {
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [programList, setProgramList] = useState([]);

  const [selectedDaerahId, setSelectedDaerahId] = useState('');
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [deskripsiKegiatan, setDeskripsiKegiatan] = useState('');
  const [sumberAnggaran, setSumberAnggaran] = useState('');
  const [anggaran, setAnggaran] = useState({
    tahun1: '', tahun2: '', tahun3: '', tahun4: '', tahun5: ''
  });

  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerangkatDaerah = async () => {
      const { data } = await supabase.from('perangkat_daerah').select('*');
      if (data) setPerangkatDaerahList(data);
    };
    fetchPerangkatDaerah();
  }, []);

  useEffect(() => {
    if (!selectedDaerahId) {
      setProgramList([]);
      setSelectedProgramId('');
      return;
    }
    const fetchPrograms = async () => {
      const { data } = await supabase.rpc('get_program_by_pd_simple', { pd_id: selectedDaerahId });
      if (data) setProgramList(data);
      else setProgramList([]);
    };
    fetchPrograms();
  }, [selectedDaerahId]);

  const handleAnggaranChange = (e) => {
    const { name, value } = e.target;
    setAnggaran(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('renstra_kegiatan')
      .insert({
        program_id: selectedProgramId,
        deskripsi_kegiatan: deskripsiKegiatan,
        sumber_anggaran: sumberAnggaran,
        anggaran_tahun_1: anggaran.tahun1,
        anggaran_tahun_2: anggaran.tahun2,
        anggaran_tahun_3: anggaran.tahun3,
        anggaran_tahun_4: anggaran.tahun4,
        anggaran_tahun_5: anggaran.tahun5,
      });

    if (error) {
      alert('Gagal menyimpan kegiatan: ' + error.message);
    } else {
      alert('Data Renstra Kegiatan berhasil disimpan!');
      navigate('/renstra/kegiatan');
    }
    setSaving(false);
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Form Tambah Renstra Kegiatan</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
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
            <input type="text" value={sumberAnggaran} onChange={(e) => setSumberAnggaran(e.target.value)} placeholder="Contoh: APBD" required className="mt-1 block w-full border p-2 rounded-md"/>
        </div>

        <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Anggaran Kegiatan (Rp)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <input type="number" name="tahun1" placeholder="Anggaran 2025" value={anggaran.tahun1} onChange={handleAnggaranChange} required className="border p-2 rounded-md" />
                <input type="number" name="tahun2" placeholder="Anggaran 2026" value={anggaran.tahun2} onChange={handleAnggaranChange} required className="border p-2 rounded-md" />
                <input type="number" name="tahun3" placeholder="Anggaran 2027" value={anggaran.tahun3} onChange={handleAnggaranChange} required className="border p-2 rounded-md" />
                <input type="number" name="tahun4" placeholder="Anggaran 2028" value={anggaran.tahun4} onChange={handleAnggaranChange} required className="border p-2 rounded-md" />
                <input type="number" name="tahun5" placeholder="Anggaran 2029" value={anggaran.tahun5} onChange={handleAnggaranChange} required className="border p-2 rounded-md" />
            </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Link to="/renstra/kegiatan" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
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

export default TambahKegiatanPage;