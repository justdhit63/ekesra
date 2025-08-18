// src/pages/PJProgramPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import IndikatorPJProgramAccordion from '../components/IndikatorPJProgramAccordion';

function PJProgramPage() {
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [selectedDaerahId, setSelectedDaerahId] = useState('');
  const [indicators, setIndicators] = useState([]);
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

  useEffect(() => {
    if (!selectedDaerahId) return;
    const fetchIndicators = async () => {
      setLoading(true);
      // Panggil fungsi PostgreSQL untuk mengambil data secara efisien
      const { data, error } = await supabase.rpc('get_indikator_program_by_pd', {
        pd_id: selectedDaerahId
      });

      if (data) setIndicators(data);
      else {
        setIndicators([]);
        console.error(error);
      }
      setLoading(false);
    };
    fetchIndicators();
  }, [selectedDaerahId]);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Penanggung Jawab Sasaran Program</h1>
      <div className="bg-white p-6 shadow-md rounded-lg">
        <div className="flex justify-between items-center">
          <div className="w-1/3 mb-6">
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
          <h2 className="text-gray-700 font-medium">Data Penanggung Jawab</h2>
        </div>

        {loading ? <p>Loading...</p> : (
          <div className="space-y-4">
            {indicators.map(indicator => (
              <IndikatorPJProgramAccordion key={indicator.id} indicator={indicator} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default PJProgramPage;