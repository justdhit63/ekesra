// src/pages/RenstraTujuanPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FaPlus } from 'react-icons/fa';
import SasaranCard from '../components/SasaranCard';
import { Link } from 'react-router-dom';

function RenstraTujuanPage() {
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [selectedDaerahId, setSelectedDaerahId] = useState('');
  const [renstraData, setRenstraData] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // <-- DIUBAH: Logika fetch data dijadikan fungsi terpisah
  const fetchRenstraData = async () => {
    if (!selectedDaerahId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('renstra_sasaran')
      .select(`
        id, deskripsi_sasaran, periode_awal, periode_akhir,
        renstra_tujuan (id, deskripsi_tujuan, renstra_indikator (*))
      `)
      .eq('perangkat_daerah_id', selectedDaerahId);

    if (data) {
      setRenstraData(data);
    } else {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRenstraData(); // <-- DIUBAH: Memanggil fungsi fetch
  }, [selectedDaerahId]);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Renstra Tujuan</h1>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6 ">
        <div className="flex justify-between items-center">
          <div>
            <label htmlFor="perangkat-daerah" className="block text-sm font-medium text-gray-700 mb-1">Perangkat Daerah</label>
            <select
              id="perangkat-daerah"
              value={selectedDaerahId}
              onChange={(e) => setSelectedDaerahId(e.target.value)}
              className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {perangkatDaerahList.map(daerah => (
                <option key={daerah.id} value={daerah.id}>{daerah.nama_daerah}</option>
              ))}
            </select>
          </div>
          <Link to='/renstra/tujuan/tambah' className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center">
            <FaPlus className="mr-2" />
            Tambah Tujuan
          </Link>
        </div>

        <h1 className='text-gray-600 p-6 border-b border-gray-400 mb-4'>Renstra Tujuan Periode Tahun 2025- 2029</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-6">
            {renstraData.map(sasaran => (
              // <-- DIUBAH: Mengirim fungsi fetchRenstraData sebagai prop
              <SasaranCard
                key={sasaran.id}
                sasaran={sasaran}
                onDataChange={fetchRenstraData}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RenstraTujuanPage;