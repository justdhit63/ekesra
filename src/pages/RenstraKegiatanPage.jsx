// src/pages/RenstraKegiatanPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import ProgramKegiatanAccordion from '../components/ProgramKegiatanAccordion';

function RenstraKegiatanPage() {
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [selectedDaerahId, setSelectedDaerahId] = useState('');
  const [programData, setProgramData] = useState([]);
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

  const fetchProgramDanKegiatan = async () => {
    if (!selectedDaerahId) return;
    setLoading(true);

    const { data: sasarans } = await supabase.from('renstra_sasaran').select('id').eq('perangkat_daerah_id', selectedDaerahId);

    if (sasarans && sasarans.length > 0) {
      const sasaranIds = sasarans.map(s => s.id);
      const { data, error } = await supabase
        .from('renstra_program')
        .select(`*, renstra_kegiatan(*)`)
        .in('sasaran_id', sasaranIds);

      if (data) setProgramData(data);
      else console.error(error);
    } else {
      setProgramData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProgramDanKegiatan();
  }, [selectedDaerahId]);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Renstra Kegiatan</h1>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-2">
          <select
            value={selectedDaerahId}
            onChange={(e) => setSelectedDaerahId(e.target.value)}
            className="mt-1 block w-full md:w-1/3 border p-2 rounded-md"
          >
            {perangkatDaerahList.map(daerah => (
              <option key={daerah.id} value={daerah.id}>{daerah.nama_daerah}</option>
            ))}
          </select>
          <Link to="/renstra/kegiatan/tambah" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center">
            <FaPlus className="mr-2" />
            Tambah
          </Link>
        </div>
        <h2 className="py-4 text-gray-700 mb-2 border-b border-gray-500">Renstra Kegiatan Periode 2025-2029</h2>
        {loading ? <p>Loading...</p> : (
          <div className="space-y-4">
            {programData.map(program => (
              <ProgramKegiatanAccordion
                key={program.id}
                program={program}
                onDataChange={fetchProgramDanKegiatan}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default RenstraKegiatanPage;