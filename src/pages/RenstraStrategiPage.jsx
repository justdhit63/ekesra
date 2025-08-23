// src/pages/RenstraStrategiPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import SasaranStrategiAccordion from '../components/SasaranStrategiAccordion';

function RenstraStrategiPage() {
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [selectedDaerahId, setSelectedDaerahId] = useState('');
  const [sasaranData, setSasaranData] = useState([]);
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

  // <-- DIUBAH: Menggunakan fungsi RPC yang baru dan benar -->
  const fetchSasaranDanStrategi = async () => {
    if (!selectedDaerahId) return;
    setLoading(true);
    
    // Panggil fungsi PostgreSQL yang sudah kita buat
    const { data, error } = await supabase.rpc('get_strategi_by_pd', {
      pd_id: selectedDaerahId
    });

    if (data) {
      setSasaranData(data);
    } else {
      setSasaranData([]);
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSasaranDanStrategi();
  }, [selectedDaerahId]);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Renstra Strategi</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center justify-between">
          <div className="w-full md:w-1/2 mb-6">
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
          <h1 className='text-lg font-medium hidden md:block'>Renstra Strategi Periode 2025-2029</h1>
        </div>

        {loading ? <p className="text-center">Memuat data...</p> : (
          <div className="space-y-4">
            {sasaranData.length > 0 ? (
                sasaranData.map(sasaran => (
                <SasaranStrategiAccordion
                    key={sasaran.id}
                    sasaran={sasaran}
                    onDataChange={fetchSasaranDanStrategi}
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

export default RenstraStrategiPage;