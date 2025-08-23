// src/pages/PJSubKegiatanPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import IndikatorPJSubKegiatanAccordion from '../components/IndikatorPJSubKegiatanAccordion';

function PJSubKegiatanPage() {
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
      // Panggilan ke fungsi yang benar
      const { data, error } = await supabase.rpc('get_indikator_sub_kegiatan_by_pd', {
        pd_id: selectedDaerahId
      });

      if (data) {
        setIndicators(data);
      } else {
        setIndicators([]);
        console.error(error);
      }
      setLoading(false);
    };
    fetchIndicators();
  }, [selectedDaerahId]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Penanggung Jawab Sub Kegiatan</h1>
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <label className="block text-sm font-medium text-gray-700">Perangkat Daerah</label>
        <select 
          value={selectedDaerahId}
          onChange={(e) => setSelectedDaerahId(e.target.value)}
          className="mt-1 block w-full md:w-1/3 border p-2 rounded-md"
        >
          {perangkatDaerahList.map(daerah => (
            <option key={daerah.id} value={daerah.id}>{daerah.nama_daerah}</option>
          ))}
        </select>
      </div>

      {loading ? <p className="text-center">Memuat...</p> : (
        <div className="space-y-4">
            {indicators && indicators.length > 0 ? (
                indicators.map(indicator => (
                    <IndikatorPJSubKegiatanAccordion key={indicator.id} indicator={indicator} />
                ))
            ) : (
                <p className="text-center text-gray-500">Tidak ada indikator untuk ditampilkan.</p>
            )}
        </div>
      )}
    </div>
  );
}
export default PJSubKegiatanPage;