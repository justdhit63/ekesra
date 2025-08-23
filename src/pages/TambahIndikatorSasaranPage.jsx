// src/pages/TambahIndikatorSasaranRpdPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, useParams, Link } from 'react-router-dom';

function TambahIndikatorSasaranRpdPage() {
  const { sasaranId } = useParams();
  const [deskripsi, setDeskripsi] = useState('');
  const [satuan, setSatuan] = useState('');
  const [sasaran, setSasaran] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSasaran = async () => {
      const { data } = await supabase.from('sasaran_rpd').select('deskripsi').eq('id', sasaranId).single();
      if (data) setSasaran(data);
    };
    fetchSasaran();
  }, [sasaranId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await supabase.from('indikator_sasaran_rpd').insert({
      deskripsi, satuan, sasaran_rpd_id: sasaranId
    });
    navigate('/rpd/sasaran');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Form Tambah Indikator</h1>
      {sasaran && <p className="text-md text-gray-600 mb-4">Untuk Sasaran: <strong>{sasaran.deskripsi}</strong></p>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label className="block text-sm font-medium">Deskripsi Indikator</label>
          <textarea value={deskripsi} onChange={e => setDeskripsi(e.target.value)} required className="mt-1 w-full border p-2 rounded-md" rows="3"></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium">Satuan</label>
          <input type="text" value={satuan} onChange={e => setSatuan(e.target.value)} required className="mt-1 w-full border p-2 rounded-md" />
        </div>
        <div className="flex justify-end space-x-4">
          <Link to="/rpd/sasaran" className="bg-gray-200 py-2 px-4 rounded">Batal</Link>
          <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded">Simpan</button>
        </div>
      </form>
    </div>
  );
}
export default TambahIndikatorSasaranRpdPage;