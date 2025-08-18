// src/pages/SasaranSubKegiatanPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import SasaranSubKegiatanAccordion from '../components/SasaranSubKegiatanAccordion';

function SasaranSubKegiatanPage() {
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [selectedDaerahId, setSelectedDaerahId] = useState('');
  const [sasaranSubKegiatanData, setSasaranSubKegiatanData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!selectedDaerahId) return;
    setLoading(true);
    const { data, error } = await supabase.rpc('get_sasaran_sub_kegiatan_by_pd', {
      pd_id: selectedDaerahId
    });

    if (data) setSasaranSubKegiatanData(data);
    else {
      setSasaranSubKegiatanData([]);
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
      <h1 className="text-xl font-bold text-gray-800 mb-4">Sasaran Sub Kegiatan</h1>
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="mb-4 flex justify-between items-center">
          <select
            value={selectedDaerahId}
            onChange={(e) => setSelectedDaerahId(e.target.value)}
            className="border p-2 rounded-md"
          >
            {perangkatDaerahList.map(daerah => (
              <option key={daerah.id} value={daerah.id}>{daerah.nama_daerah}</option>
            ))}
          </select>
          <Link to="/renstra/sub-kegiatan/sasaran/tambah" className="bg-green-600 text-white py-2 px-4 rounded inline-flex items-center">
            <FaPlus className="mr-2" />
            Tambah
          </Link>
        </div>

        <h2 className="py-4 mb-2 border-b border-gray-500 text-gray-700">Sasaran Sub Kegiatan dan Indikator Sub Kegiatan</h2>

        {loading ? <p className="text-center">Loading...</p> : (
          <div className="space-y-4">
            {sasaranSubKegiatanData && sasaranSubKegiatanData.length > 0 ? (
              sasaranSubKegiatanData.map(item => (
                <SasaranSubKegiatanAccordion
                  key={item.id}
                  sasaranSubKegiatan={item}
                  onDataChange={fetchData}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">Belum ada data sasaran sub kegiatan.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default SasaranSubKegiatanPage;