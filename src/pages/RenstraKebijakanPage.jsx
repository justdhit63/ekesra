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

  const fetchStrategiDanKebijakan = async () => {
    if (!selectedDaerahId) return;
    setLoading(true);

    // Langkah 1: Dapatkan semua sasaran_id dari perangkat daerah yang dipilih
    const { data: sasarans } = await supabase
      .from('renstra_sasaran')
      .select('id')
      .eq('perangkat_daerah_id', selectedDaerahId);

    if (!sasarans || sasarans.length === 0) {
      setStrategiData([]);
      setLoading(false);
      return;
    }
    const sasaranIds = sasarans.map(s => s.id);

    // Langkah 2: Ambil semua strategi (dan kebijakan di dalamnya) berdasarkan sasaran_id
    const { data, error } = await supabase
      .from('renstra_strategi')
      .select(`
        id,
        deskripsi_strategi,
        renstra_kebijakan ( id, deskripsi_kebijakan )
      `)
      .in('sasaran_id', sasaranIds);

    if (data) setStrategiData(data);
    else console.error(error);
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
          <div className="mb-6 w-1/2">
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
          <h2 className="text-lg font-medium">Renstra Kebijakan Periode 2025-2029</h2>
        </div>

        {loading ? <p>Loading...</p> : (
          <div className="space-y-4">
            {strategiData.map(strategi => (
              <StrategiKebijakanAccordion
                key={strategi.id}
                strategi={strategi}
                onDataChange={fetchStrategiDanKebijakan}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RenstraKebijakanPage;