// src/pages/RenstraSubKegiatanPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import KegiatanSubKegiatanAccordion from '../components/KegiatanSubKegiatanAccordion';

function RenstraSubKegiatanPage() {
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [selectedDaerahId, setSelectedDaerahId] = useState('');
  const [kegiatanData, setKegiatanData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPerangkatDaerah = async () => {
      const { data } = await supabase.from('perangkat_daerah').select('id, nama_daerah');
      if (data) {
        setPerangkatDaerahList(data);
        if (data.length > 0) setSelectedDaerahId(data[0].id);
      }
    };
    fetchPerangkatDaerah();
  }, []);

  const fetchKegiatanDanSub = async () => {
    if (!selectedDaerahId) return;
    setLoading(true);
    const { data, error } = await supabase.rpc('get_kegiatan_by_pd_with_sub', {
      pd_id: selectedDaerahId
    });

    if (data) setKegiatanData(data);
    else {
      setKegiatanData([]);
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchKegiatanDanSub();
  }, [selectedDaerahId]);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Sub Kegiatan Renstra</h1>
      <div className="bg-white p-4 rounded-lg shadow-md  mb-4">

        <div className="mb-4 flex justify-between items-center">
          <select
            value={selectedDaerahId}
            onChange={(e) => setSelectedDaerahId(e.target.value)}
            className="mt-1 block w-full md:w-1/3 border p-2 rounded-md"
          >
            {perangkatDaerahList.map(daerah => (
              <option key={daerah.id} value={daerah.id}>{daerah.nama_daerah}</option>
            ))}
          </select>
          <Link to="/renstra/sub-kegiatan/tambah" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center">
            <FaPlus className="mr-2" />
            Tambah
          </Link>
        </div>

        <h2 className="py-4 mb-2 border-b border-gray-500 text-gray-700">Renstra Sub Kegiatan Periode 2025-2029</h2>

        {loading ? <p>Loading...</p> : (
          <div className="space-y-4">
            {kegiatanData.map(kegiatan => (
              <KegiatanSubKegiatanAccordion
                key={kegiatan.id}
                kegiatan={kegiatan}
                onDataChange={fetchKegiatanDanSub}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default RenstraSubKegiatanPage;