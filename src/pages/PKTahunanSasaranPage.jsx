// src/pages/PKTahunanSasaranPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import SasaranPKAccordion from '../components/SasaranPKAccordion';

function PKTahunanSasaranPage() {
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

  const fetchData = async () => {
    if (!selectedDaerahId) return;
    setLoading(true);
    // Panggilan ke fungsi yang benar
    const { data, error } = await supabase.rpc('get_pk_sasaran_tahunan_by_pd', {
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
    fetchData();
  }, [selectedDaerahId]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Target PK Indikator Sasaran Tahunan</h1>
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
            {sasaranData && sasaranData.length > 0 ? (
                sasaranData.map(sasaran => (
                    <SasaranPKAccordion key={sasaran.id} sasaran={sasaran} onDataChange={fetchData} />
                ))
            ) : (
                <p className="text-center text-gray-500">Tidak ada data untuk ditampilkan.</p>
            )}
        </div>
      )}
    </div>
  );
}
export default PKTahunanSasaranPage;