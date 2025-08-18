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

  const fetchSasaranDanStrategi = async () => {
    if (!selectedDaerahId) return;
    setLoading(true);
    // Query bersarang untuk mengambil sasaran dan strateginya
    const { data, error } = await supabase
      .from('renstra_sasaran')
      .select(`
        id,
        deskripsi_sasaran,
        renstra_strategi ( id, deskripsi_strategi )
      `)
      .eq('perangkat_daerah_id', selectedDaerahId);

    if (data) setSasaranData(data);
    else console.error(error);
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
          <div className="w-1/2 mb-6">
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
          <h1 className='text-lg font-medium'>Renstra Strategi Periode 2025-2029</h1>
        </div>

        {loading ? <p>Loading...</p> : (
          <div className="space-y-4">
            {sasaranData.map(sasaran => (
              <SasaranStrategiAccordion
                key={sasaran.id}
                sasaran={sasaran}
                onDataChange={fetchSasaranDanStrategi} // Kirim fungsi refresh
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RenstraStrategiPage;