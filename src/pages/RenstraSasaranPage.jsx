// src/pages/RenstraSasaranPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import SasaranAccordion from '../components/SasaranAccordion';

function RenstraSasaranPage() {
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [selectedDaerahId, setSelectedDaerahId] = useState('');
  const [sasaranData, setSasaranData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Ambil daftar Perangkat Daerah untuk dropdown
  useEffect(() => {
    const fetchPerangkatDaerah = async () => {
      const { data } = await supabase.from('perangkat_daerah').select('id, nama_daerah');
      if (data) {
        setPerangkatDaerahList(data);
        if (data.length > 0) {
          setSelectedDaerahId(data[0].id);
        }
      }
    };
    fetchPerangkatDaerah();
  }, []);

  // <-- PERUBAHAN 1: Logika fetch diubah menjadi fungsi mandiri
  // Fungsi ini bisa dipanggil kapan saja untuk memuat ulang data sasaran
  const fetchSasaranData = async () => {
    if (!selectedDaerahId) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('renstra_sasaran')
      .select(`
        id,
        deskripsi_sasaran,
        renstra_indikator_sasaran (*)
      `)
      .eq('perangkat_daerah_id', selectedDaerahId);

    if (data) {
      setSasaranData(data);
    } else {
      console.error(error);
    }
    setLoading(false);
  };

  // Ambil data Sasaran saat dropdown berubah
  useEffect(() => {
    fetchSasaranData(); // <-- PERUBAHAN 2: Panggil fungsi fetch
  }, [selectedDaerahId]);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Renstra Sasaran</h1>

      {/* Header dengan Dropdown dan Tombol Tambah */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <select
            value={selectedDaerahId}
            onChange={(e) => setSelectedDaerahId(e.target.value)}
            className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none"
          >
            {perangkatDaerahList.map(daerah => (
              <option key={daerah.id} value={daerah.id}>{daerah.nama_daerah}</option>
            ))}
          </select>
          <Link
            to="/renstra/sasaran/tambah"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
          >
            <FaPlus className="mr-2" />
            Tambah
          </Link>
        </div>

        <h1 className='text-gray-600 p-6 border-b border-gray-400 mb-4'>Renstra Sasaran Periode Tahun 2025- 2029</h1>

        {/* Konten Utama: Daftar Sasaran */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {sasaranData.map(sasaran => (
              <SasaranAccordion
                key={sasaran.id}
                sasaran={sasaran}
                onDataChange={fetchSasaranData} // <-- PERUBAHAN 3: Kirim fungsi sebagai prop
              />
            ))}
          </div>
        )}
      </div>


    </div>
  );
}

export default RenstraSasaranPage;