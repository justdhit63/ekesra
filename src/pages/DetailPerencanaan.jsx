// src/pages/DetailPerencanaan.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function DetailPerencanaan() {
  const { id } = useParams(); // Mengambil ID dari URL
  const [perencanaan, setPerencanaan] = useState(null);
  const [pengukuran, setPengukuran] = useState([]);
  const [realisasi, setRealisasi] = useState('');
  const [periode, setPeriode] = useState('Triwulan 1');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Ambil data perencanaan
      const { data: dataPerencanaan, error: errorPerencanaan } = await supabase
        .from('perencanaan_kinerja')
        .select('*')
        .eq('id', id)
        .single(); // .single() untuk mengambil satu baris data

      // Ambil data pengukuran yang terkait
      const { data: dataPengukuran, error: errorPengukuran } = await supabase
        .from('pengukuran_kinerja')
        .select('*')
        .eq('perencanaan_id', id)
        .order('created_at', { ascending: false });

      if (errorPerencanaan) console.error('Error fetching perencanaan:', errorPerencanaan);
      else setPerencanaan(dataPerencanaan);

      if (errorPengukuran) console.error('Error fetching pengukuran:', errorPengukuran);
      else setPengukuran(dataPengukuran);

      setLoading(false);
    };

    fetchData();
  }, [id]);

  const handleSubmitPengukuran = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('pengukuran_kinerja')
      .insert({
        perencanaan_id: id,
        realisasi: realisasi,
        periode_lapor: periode,
      });

    if (error) {
      alert(error.message);
    } else {
      // Refresh data pengukuran
      const { data: newData, error: newError } = await supabase
        .from('pengukuran_kinerja')
        .select('*')
        .eq('perencanaan_id', id)
        .order('created_at', { ascending: false });

      if(newData) setPengukuran(newData);
      setRealisasi('');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!perencanaan) return <div className="p-8">Data tidak ditemukan.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link to="/" className="text-indigo-600 hover:underline mb-6 block">&larr; Kembali ke Dashboard</Link>

      {/* Detail Perencanaan */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">{perencanaan.sasaran_kegiatan}</h1>
        <p className="text-gray-600 mt-2"><strong>Target:</strong> {perencanaan.target}</p>
        <p className="text-gray-500 text-sm"><strong>Tahun:</strong> {perencanaan.tahun}</p>
      </div>

      {/* Form Tambah Pengukuran */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Tambah Data Pengukuran Kinerja</h2>
        <form onSubmit={handleSubmitPengukuran} className="space-y-4">
          <div>
            <label htmlFor="periode" className="block text-sm font-medium text-gray-700">Periode Lapor</label>
            <select id="periode" value={periode} onChange={e => setPeriode(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
              <option>Triwulan 1</option>
              <option>Triwulan 2</option>
              <option>Triwulan 3</option>
              <option>Triwulan 4</option>
            </select>
          </div>
          <div>
            <label htmlFor="realisasi" className="block text-sm font-medium text-gray-700">Realisasi</label>
            <textarea id="realisasi" value={realisasi} onChange={e => setRealisasi(e.target.value)} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" placeholder="Jelaskan realisasi yang tercapai..."></textarea>
          </div>
          <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">Simpan</button>
        </form>
      </div>

      {/* Daftar Pengukuran */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Riwayat Pengukuran</h2>
        <ul className="space-y-4">
          {pengukuran.length > 0 ? pengukuran.map(item => (
            <li key={item.id} className="border-b pb-4">
              <p className="font-bold">{item.periode_lapor}</p>
              <p className="text-gray-700">{item.realisasi}</p>
              <p className="text-xs text-gray-500 mt-1">Dilaporkan pada: {new Date(item.created_at).toLocaleDateString('id-ID')}</p>
            </li>
          )) : (
            <p className="text-gray-500">Belum ada data pengukuran.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default DetailPerencanaan;