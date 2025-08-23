// src/pages/TambahIndikatorTujuanRpdPage.jsx
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, useParams, Link } from 'react-router-dom';

function TambahIndikatorTujuanRpdPage() {
  const { tujuanId } = useParams();
  const [deskripsi, setDeskripsi] = useState('');
  const [satuan, setSatuan] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await supabase.from('indikator_tujuan_rpd').insert({
      deskripsi, satuan, tujuan_rpd_id: tujuanId
    });
    navigate('/rpd/tujuan');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Form Tambah Indikator Tujuan RPD</h1>
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
          <Link to="/rpd/tujuan" className="bg-gray-200 py-2 px-4 rounded">Batal</Link>
          <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded">Simpan</button>
        </div>
      </form>
    </div>
  );
}
export default TambahIndikatorTujuanRpdPage;