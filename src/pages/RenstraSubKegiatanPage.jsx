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

    if (data) {
      setKegiatanData(data);
    } else {
      setKegiatanData([]); // Pastikan state direset jika ada error
      console.error("Gagal mengambil data Sub Kegiatan:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchKegiatanDanSub();
  }, [selectedDaerahId]);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Sub Kegiatan Renstra</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700">Perangkat Daerah</label>
            <select
              value={selectedDaerahId}
              onChange={(e) => setSelectedDaerahId(e.target.value)}
              className="mt-1 block w-full border p-2 rounded-md"
            >
              {perangkatDaerahList.map(daerah => (
                <option key={daerah.id} value={daerah.id}>{daerah.nama_daerah}</option>
              ))}
            </select>
          </div>
          <Link to="/renstra/sub-kegiatan/tambah" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center">
            <FaPlus className="mr-2" />
            Tambah
          </Link>
        </div>

        <h2 className="text-gray-700 text-lg font-medium pb-2 border-b border-gray-300 mb-4">Renstra Sub Kegiatan Periode 2025-2029</h2>

        {loading ? <p className="text-center py-4">Memuat data...</p> : (
          <div className="space-y-4">
            {kegiatanData && kegiatanData.length > 0 ? (
              kegiatanData.map(kegiatan => (
                <KegiatanSubKegiatanAccordion
                  key={kegiatan.id}
                  kegiatan={kegiatan}
                  onDataChange={fetchKegiatanDanSub}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">Belum ada data kegiatan untuk ditampilkan.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default RenstraSubKegiatanPage;