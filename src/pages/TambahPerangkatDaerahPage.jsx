import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

function TambahPerangkatDaerahPage() {
  const [namaDaerah, setNamaDaerah] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Memasukkan data baru ke tabel 'perangkat_daerah'
    const { data, error } = await supabase
      .from('perangkat_daerah')
      .insert({ nama_daerah: namaDaerah });

    if (error) {
      alert("Gagal menyimpan data: " + error.message);
      console.error(error);
    } else {
      alert("Perangkat Daerah berhasil ditambahkan!");
      navigate('/tambah-perangkat-daerah'); // Kembali ke halaman daftar
    }

    setSaving(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Tambah Perangkat Daerah</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-lg mx-auto">
        <div>
          <label htmlFor="nama-daerah" className="block text-sm font-medium text-gray-700">Nama Perangkat Daerah</label>
          <input
            id="nama-daerah"
            type="text"
            value={namaDaerah}
            onChange={(e) => setNamaDaerah(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <Link to="/admin/perangkat-daerah" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition-colors">
            Batal
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
          >
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TambahPerangkatDaerahPage;