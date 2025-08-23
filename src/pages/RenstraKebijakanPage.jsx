// src/pages/RenstraKebijakanPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import StrategiKebijakanAccordion from '../components/StrategiKebijakanAccordion';

function RenstraKebijakanPage() {
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [selectedDaerahId, setSelectedDaerahId] = useState('');
  const [strategiData, setStrategiData] = useState([]);
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

  // <-- DIUBAH: Menggunakan fungsi RPC yang baru -->
  const fetchStrategiDanKebijakan = async () => {
    if (!selectedDaerahId) return;
    setLoading(true);

    const { data, error } = await supabase.rpc('get_kebijakan_by_pd', {
      pd_id: selectedDaerahId
    });

    if (data) {
      setStrategiData(data);
    } else {
      setStrategiData([]);
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStrategiDanKebijakan();
  }, [selectedDaerahId]);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Renstra Kebijakan</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center justify-between">
          <div className="mb-6 w-full md:w-1/2">
            <label className="block text-sm font-medium text-gray-700">Perangkat Daerah</label>
            <select
              value={selectedDaerahId}
              onChange={(e) => setSelectedDaerahId(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            >
              {perangkatDaerahList.map(daerah => (
                <option key={daerah.id} value={daerah.id}>{daerah.nama_daerah}</option>
              ))}
            </select>
          </div>
          <h2 className="text-lg font-medium hidden md:block">Renstra Kebijakan Periode 2025-2029</h2>
        </div>

        {loading ? <p className="text-center">Memuat data...</p> : (
          <div className="space-y-4">
            {strategiData.length > 0 ? (
                strategiData.map(strategi => (
                <StrategiKebijakanAccordion
                    key={strategi.id}
                    strategi={strategi}
                    onDataChange={fetchStrategiDanKebijakan}
                />
                ))
            ) : (
                <p className="text-center text-gray-500">Tidak ada data untuk ditampilkan.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default RenstraKebijakanPage;