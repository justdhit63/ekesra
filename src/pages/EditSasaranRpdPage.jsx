// src/pages/EditSasaranRpdPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, useParams, Link } from 'react-router-dom';

function EditSasaranRpdPage() {
  const { id } = useParams();
  const [deskripsi, setDeskripsi] = useState('');
  const [selectedTujuanId, setSelectedTujuanId] = useState('');
  const [tujuanList, setTujuanList] = useState([]);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Ambil data sasaran yang akan diedit
    const fetchSasaran = async () => {
      const { data } = await supabase.from('sasaran_rpd').select('*').eq('id', id).single();
      if (data) {
        setDeskripsi(data.deskripsi);
        setSelectedTujuanId(data.tujuan_rpd_id);
      }
    };

    // Ambil daftar Tujuan RPD untuk dropdown
    const fetchTujuanRpd = async () => {
      const { data } = await supabase.from('tujuan_rpd').select('*');
      if (data) setTujuanList(data);
    };

    fetchSasaran();
    fetchTujuanRpd();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('sasaran_rpd').update({
      deskripsi: deskripsi, 
      tujuan_rpd_id: selectedTujuanId
    }).eq('id', id);
    navigate('/rpd/sasaran');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Form Edit Sasaran RPD</h1>
      <form onSubmit={handleUpdate} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tujuan RPD (Induk)</label>
          <select value={selectedTujuanId} onChange={e => setSelectedTujuanId(e.target.value)} required className="mt-1 block w-full border p-2 rounded-md">
            <option value="">Pilih Tujuan RPD</option>
            {tujuanList.map(tujuan => (
              <option key={tujuan.id} value={tujuan.id}>{tujuan.deskripsi}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Deskripsi Sasaran RPD</label>
          <textarea value={deskripsi} onChange={e => setDeskripsi(e.target.value)} required className="mt-1 block w-full border p-2 rounded-md" rows="4"></textarea>
        </div>
        <div className="flex justify-end space-x-4">
          <Link to="/rpd/sasaran" className="bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded">Batal</Link>
          <button type="submit" disabled={saving} className="bg-indigo-600 text-white py-2 px-4 rounded">{saving ? 'Memperbarui...' : 'Update'}</button>
        </div>
      </form>
    </div>
  );
}
export default EditSasaranRpdPage;