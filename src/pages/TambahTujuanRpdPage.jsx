// src/pages/TambahTujuanRpdPage.jsx
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

function TambahTujuanRpdPage() {
  const [deskripsi, setDeskripsi] = useState('');
  const [periodeAwal, setPeriodeAwal] = useState('');
  const [periodeAkhir, setPeriodeAkhir] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await supabase.from('tujuan_rpd').insert({
      deskripsi, periode_awal: periodeAwal, periode_akhir: periodeAkhir
    });
    navigate('/rpd/tujuan');
  };

return (
    <div className="mx-auto p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Form Tambah Tujuan RPD</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={deskripsi}
                    onChange={e => setDeskripsi(e.target.value)}
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Periode Awal</label>
                <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={periodeAwal}
                    onChange={e => setPeriodeAwal(e.target.value)}
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Periode Akhir</label>
                <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={periodeAkhir}
                    onChange={e => setPeriodeAkhir(e.target.value)}
                    required
                />
            </div>
            <div className="flex justify-between items-center">
                <Link
                    to="/rpd/tujuan"
                    className="text-blue-500 hover:underline"
                >
                    Batal
                </Link>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Simpan
                </button>
            </div>
        </form>
    </div>
);
}
export default TambahTujuanRpdPage;