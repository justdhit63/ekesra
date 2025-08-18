// src/pages/EditSubKegiatanPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function EditSubKegiatanPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [kegiatanList, setKegiatanList] = useState([]);
  const [selectedKegiatanId, setSelectedKegiatanId] = useState('');
  const [deskripsiSubKegiatan, setDeskripsiSubKegiatan] = useState('');
  const [sumberAnggaran, setSumberAnggaran] = useState('');
  const [anggaran, setAnggaran] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Ambil data sub kegiatan yang akan diedit
      const { data: subKegiatanData, error } = await supabase
        .from('renstra_sub_kegiatan')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        alert("Gagal mengambil data sub kegiatan!");
        navigate('/renstra/sub-kegiatan');
      } else {
        // Isi state form dengan data yang ada
        setSelectedKegiatanId(subKegiatanData.kegiatan_id);
        setDeskripsiSubKegiatan(subKegiatanData.deskripsi_sub_kegiatan);
        setSumberAnggaran(subKegiatanData.sumber_anggaran);
        setAnggaran({
          tahun1: subKegiatanData.anggaran_tahun_1,
          tahun2: subKegiatanData.anggaran_tahun_2,
          tahun3: subKegiatanData.anggaran_tahun_3,
          tahun4: subKegiatanData.anggaran_tahun_4,
          tahun5: subKegiatanData.anggaran_tahun_5,
          renja: subKegiatanData.anggaran_renja,
        });
      }
      
      const { data: kegiatanDataList } = await supabase.from('renstra_kegiatan').select('*');
      if (kegiatanDataList) setKegiatanList(kegiatanDataList);

      setLoading(false);
    };

    fetchData();
  }, [id, navigate]);

  const handleAnggaranChange = (e) => {
    const { name, value } = e.target;
    setAnggaran(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('renstra_sub_kegiatan')
      .update({
        kegiatan_id: selectedKegiatanId,
        deskripsi_sub_kegiatan: deskripsiSubKegiatan,
        sumber_anggaran: sumberAnggaran,
        anggaran_renja: anggaran.renja,
        anggaran_tahun_1: anggaran.tahun1,
        anggaran_tahun_2: anggaran.tahun2,
        anggaran_tahun_3: anggaran.tahun3,
        anggaran_tahun_4: anggaran.tahun4,
        anggaran_tahun_5: anggaran.tahun5,
      })
      .eq('id', id);

    if (error) {
      alert('Gagal memperbarui Sub Kegiatan: ' + error.message);
    } else {
      alert('Data Sub Kegiatan berhasil diperbarui!');
      navigate('/renstra/sub-kegiatan');
    }
    setSaving(false);
  };

  if (loading) return <div className="p-6">Memuat data...</div>;

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Form Edit Sub Kegiatan</h1>
      
      <form onSubmit={handleUpdate} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div>
            <label className="block text-sm font-medium text-gray-700">Kegiatan</label>
            <select value={selectedKegiatanId} onChange={(e) => setSelectedKegiatanId(e.target.value)} required className="mt-1 block w-full border p-2 rounded-md">
              <option value="">Pilih Kegiatan</option>
              {kegiatanList.map(k => <option key={k.id} value={k.id}>{k.deskripsi_kegiatan}</option>)}
            </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Sub Kegiatan</label>
          <textarea value={deskripsiSubKegiatan} onChange={(e) => setDeskripsiSubKegiatan(e.target.value)} rows="3" required className="mt-1 block w-full border p-2 rounded-md"></textarea>
        </div>
        
        <div>
            <label className="block text-sm font-medium text-gray-700">Sumber Anggaran</label>
            <input type="text" value={sumberAnggaran || ''} onChange={(e) => setSumberAnggaran(e.target.value)} required className="mt-1 block w-full border p-2 rounded-md"/>
        </div>

        <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Anggaran Sub Kegiatan (Rp)</h3>
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
          <Link to="/renstra/sub-kegiatan" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
            Batal
          </Link>
          <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300">
            {saving ? 'Menyimpan...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditSubKegiatanPage;