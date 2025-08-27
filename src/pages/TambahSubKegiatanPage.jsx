// src/pages/TambahSubKegiatanPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function TambahSubKegiatanPage() {
  // State untuk dropdown
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [kegiatanList, setKegiatanList] = useState([]);
  
  // State untuk input form
  const [selectedDaerahId, setSelectedDaerahId] = useState('');
  const [selectedKegiatanId, setSelectedKegiatanId] = useState('');
  const [deskripsiSubKegiatan, setDeskripsiSubKegiatan] = useState('');
  const [sumberAnggaran, setSumberAnggaran] = useState('');
  const [anggaran, setAnggaran] = useState({
    tahun1: 0, tahun2: 0, tahun3: 0, tahun4: 0, tahun5: 0,
  });

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

  // Ambil daftar Kegiatan berdasarkan Perangkat Daerah
  useEffect(() => {
    if (!selectedDaerahId) {
      setKegiatanList([]);
      setSelectedKegiatanId('');
      return;
    }
    const fetchKegiatan = async () => {
      const { data } = await supabase.rpc('get_kegiatan_by_pd', { pd_id: selectedDaerahId });
      if (data) setKegiatanList(data);
      else setKegiatanList([]);
    };
    fetchKegiatan();
  }, [selectedDaerahId]);

  const handleAnggaranChange = (e) => {
    const { name, value } = e.target;
    setAnggaran(prev => ({ ...prev, [name]: value }));
  };

  // Handler untuk submit form
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('renstra_sub_kegiatan')
      .insert({
        kegiatan_id: selectedKegiatanId,
        deskripsi_sub_kegiatan: deskripsiSubKegiatan,
        sumber_anggaran: sumberAnggaran,
        anggaran_tahun_1: anggaran.tahun1,
        anggaran_tahun_2: anggaran.tahun2,
        anggaran_tahun_3: anggaran.tahun3,
        anggaran_tahun_4: anggaran.tahun4,
        anggaran_tahun_5: anggaran.tahun5,
      });

    if (error) {
      alert('Gagal menyimpan Sub Kegiatan: ' + error.message);
    } else {
      alert('Data Sub Kegiatan Renstra berhasil disimpan!');
      navigate('/renstra/sub-kegiatan');
    }
    setSaving(false);
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Form Tambah Sub Kegiatan</h1>
      
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
            <label className="block text-sm font-medium text-gray-700">Kegiatan</label>
            <select value={selectedKegiatanId} onChange={(e) => setSelectedKegiatanId(e.target.value)} required disabled={!selectedDaerahId} className="mt-1 block w-full border p-2 rounded-md">
              <option value="">Pilih Kegiatan</option>
              {kegiatanList.map(k => <option key={k.id} value={k.id}>{k.deskripsi_kegiatan}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Sub Kegiatan</label>
          <textarea value={deskripsiSubKegiatan} onChange={(e) => setDeskripsiSubKegiatan(e.target.value)} rows="3" required className="mt-1 block w-full border p-2 rounded-md"></textarea>
        </div>
        
        <div>
            <label className="block text-sm font-medium text-gray-700">Sumber Anggaran</label>
            <input type="text" value={sumberAnggaran} onChange={(e) => setSumberAnggaran(e.target.value)} placeholder="Contoh: APBD" required className="mt-1 block w-full border p-2 rounded-md"/>
        </div>

        <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Anggaran Sub Kegiatan (Rp)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <input type="number" name="tahun1" placeholder="Anggaran 2025" value={anggaran.tahun1} onChange={handleAnggaranChange} required className="border p-2 rounded-md" />
                <input type="number" name="tahun2" placeholder="Anggaran 2026" value={anggaran.tahun2} onChange={handleAnggaranChange} required className="border p-2 rounded-md" />
                <input type="number" name="tahun3" placeholder="Anggaran 2027" value={anggaran.tahun3} onChange={handleAnggaranChange} required className="border p-2 rounded-md" />
                <input type="number" name="tahun4" placeholder="Anggaran 2028" value={anggaran.tahun4} onChange={handleAnggaranChange} required className="border p-2 rounded-md" />
                <input type="number" name="tahun5" placeholder="Anggaran 2029" value={anggaran.tahun5} onChange={handleAnggaranChange} required className="border p-2 rounded-md" />
                {/* <input type="number" name="renja" placeholder="Anggaran Renja" value={anggaran.renja} onChange={handleAnggaranChange} required className="border p-2 rounded-md" /> */}
            </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Link to="/renstra/sub-kegiatan" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
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

export default TambahSubKegiatanPage;