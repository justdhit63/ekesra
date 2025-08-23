// src/pages/PenanggungJawabPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import IndikatorPJAccordion from '../components/IndikatorPJAccordion';

function PenanggungJawabPage() {
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [selectedDaerahId, setSelectedDaerahId] = useState('');
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mengambil daftar Perangkat Daerah
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

  // Mengambil indikator berdasarkan Perangkat Daerah yang dipilih
  useEffect(() => {
    if (!selectedDaerahId) return;

    const fetchIndicators = async () => {
      setLoading(true);
      
      // Gunakan RPC Function untuk mengambil data secara efisien
      const { data, error } = await supabase.rpc('get_indikator_sasaran_by_pd', {
        pd_id: selectedDaerahId
      });

      if (data) {
        setIndicators(data);
      } else {
        setIndicators([]);
        console.error("Gagal mengambil indikator:", error);
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
          <div className="w-full md:w-1/3">
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
          <h1 className='text-lg font-medium hidden md:block'>Data Penanggung Jawab</h1>
        </div>
        
        {loading ? <p className="text-center p-4">Memuat...</p> : (
          <div className="space-y-4">
            {indicators.length > 0 ? (
              indicators.map(indicator => (
                <IndikatorPJAccordion key={indicator.id} indicator={indicator} />
              ))
            ) : (
              <p className="text-center text-gray-500 p-4">Tidak ada indikator untuk perangkat daerah ini.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PenanggungJawabPage;