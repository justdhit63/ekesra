// src/pages/PKTahunanProgramPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import ProgramPKAccordion from '../components/ProgramPKAccordion';
import { FaChevronDown } from 'react-icons/fa'; // Import ikon yang hilang

function PKTahunanProgramPage() {
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [selectedDaerahId, setSelectedDaerahId] = useState('');
  const [programData, setProgramData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPerangkatDaerah = async () => {
      // Mengubah 'nama_pd' menjadi 'nama_daerah' agar konsisten dengan referensi
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
    const { data, error } = await supabase.rpc('get_pk_program_tahunan_by_pd', { pd_id: selectedDaerahId });

    if (data) {
      setProgramData(data);
    } else {
      setProgramData([]);
      console.error('Error fetching program data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [selectedDaerahId]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Target PK Indikator Program Tahunan</h1>
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <label className="block text-sm font-medium text-gray-700">Perangkat Daerah</label>
        <select 
          value={selectedDaerahId}
          onChange={(e) => setSelectedDaerahId(e.target.value)}
          className="mt-1 block w-full md:w-1/3 border p-2 rounded-md"
        >
          {perangkatDaerahList.map(daerah => (
            // Mengubah 'nama_pd' menjadi 'nama_daerah' agar konsisten dengan referensi
            <option key={daerah.id} value={daerah.id}>{daerah.nama_daerah}</option>
          ))}
        </select>
      </div>

      {loading ? <p className="text-center">Memuat...</p> : (
        <div className="space-y-4">
            {programData && programData.length > 0 ? (
                programData.map(program => (
                    <ProgramPKAccordion key={program.id} program={program} onDataChange={fetchData} />
                ))
            ) : (
                <p className="text-center text-gray-500">Tidak ada data untuk ditampilkan.</p>
            )}
        </div>
      )}
    </div>
  );
}
export default PKTahunanProgramPage;