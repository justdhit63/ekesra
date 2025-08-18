// src/pages/SasaranKegiatanPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import SasaranKegiatanAccordion from '../components/SasaranKegiatanAccordion';

function SasaranKegiatanPage() {
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [selectedDaerahId, setSelectedDaerahId] = useState('');
  const [sasaranKegiatanData, setSasaranKegiatanData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!selectedDaerahId) return;
    setLoading(true);
    const { data, error } = await supabase.rpc('get_sasaran_kegiatan_by_pd', {
      pd_id: selectedDaerahId
    });

    if (data) setSasaranKegiatanData(data);
    else {
      setSasaranKegiatanData([]);
      console.error(error);
    }
    setLoading(false);
  };

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

  useEffect(() => {
    fetchData();
  }, [selectedDaerahId]);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Sasaran Kegiatan</h1>
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 ">
        <div className="mb-4 flex justify-between items-center">
          <select
            value={selectedDaerahId}
            onChange={(e) => setSelectedDaerahId(e.target.value)}
            className="border p-2 rounded-md w-1/3"
          >
            {perangkatDaerahList.map(daerah => (
              <option key={daerah.id} value={daerah.id}>{daerah.nama_daerah}</option>
            ))}
          </select>
          <Link to="/renstra/kegiatan/sasaran/tambah" className="bg-green-600 text-white py-2 px-4 rounded inline-flex items-center">
            <FaPlus className="mr-2" />
            Tambah
          </Link>
        </div>

        <h2 className="py-4 text-gray-700 mb-2 border-b border-gray-500">Sasaran Kegiatan & Indikator Kegiatan PD</h2>

        {loading ? <p className="text-center">Loading...</p> : (
          <div className="space-y-4">
            {sasaranKegiatanData && sasaranKegiatanData.length > 0 ? (
              sasaranKegiatanData.map(item => (
                <SasaranKegiatanAccordion
                  key={item.id}
                  sasaranKegiatan={item}
                  onDataChange={fetchData}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">Belum ada data sasaran kegiatan.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default SasaranKegiatanPage;