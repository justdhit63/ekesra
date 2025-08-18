// src/pages/PenanggungJawabPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import IndikatorPJAccordion from '../components/IndikatorPJAccordion'; // Komponen baru

function PenanggungJawabPage() {
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [selectedDaerahId, setSelectedDaerahId] = useState('');
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Ambil daftar Perangkat Daerah
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

    // Ambil semua indikator yang terkait dengan Perangkat Daerah yang dipilih
    const fetchIndicators = async () => {
      setLoading(true);

      // Pertama, dapatkan semua sasaran_id dari perangkat daerah yang dipilih
      const { data: sasaran, error: sasaranError } = await supabase
        .from('renstra_sasaran')
        .select('id')
        .eq('perangkat_daerah_id', selectedDaerahId);

      if (sasaranError) {
        console.error(sasaranError);
        setLoading(false);
        return;
      }

      const sasaranIds = sasaran.map(s => s.id);

      // Kedua, dapatkan semua indikator berdasarkan sasaran_id
      const { data: indicatorData, error: indicatorError } = await supabase
        .from('renstra_indikator_sasaran')
        .select('*')
        .in('sasaran_id', sasaranIds);

      if (indicatorData) {
        setIndicators(indicatorData);
      } else {
        console.error(indicatorError);
      }
      setLoading(false);
    };

    fetchIndicators();
  }, [selectedDaerahId]);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Penanggung Jawab Sasaran</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="rounded-lg shadow-md mb-6 w-1/2">
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
          <h1 className='text-lg font-medium'>Data Penanggung Jawab</h1>
        </div>
        {loading ? <p>Loading...</p> : (
          <div className="space-y-4">
            {indicators.map(indicator => (
              <IndikatorPJAccordion key={indicator.id} indicator={indicator} />
            ))}
          </div>
        )}
      </div>




    </div>
  );
}

export default PenanggungJawabPage;