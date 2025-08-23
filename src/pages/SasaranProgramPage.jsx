// src/pages/SasaranProgramPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import SasaranProgramAccordion from '../components/SasaranProgramAccordion';

function SasaranProgramPage() {
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [selectedDaerahId, setSelectedDaerahId] = useState('');
  const [sasaranProgramData, setSasaranProgramData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!selectedDaerahId) return;
    setLoading(true);

    const { data, error } = await supabase.rpc('get_sasaran_program_by_pd', {
      pd_id: selectedDaerahId
    });

    if (data) {
        setSasaranProgramData(data);
    } else {
      setSasaranProgramData([]);
      console.error(error);
    }
    setLoading(false);
  };

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
    fetchData();
  }, [selectedDaerahId]);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Sasaran Program</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
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
          <Link to="/renstra/program/sasaran/tambah" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center">
            <FaPlus className="mr-2" />
            Tambah
          </Link>
        </div>

        <h2 className="text-gray-700 text-lg font-medium pb-2 border-b border-gray-300 mb-4">
          Sasaran Program & Indikator Program PD
        </h2>

        {loading ? (
          <p className="text-center">Memuat data...</p>
        ) : (
          <div className="space-y-4">
            {sasaranProgramData && sasaranProgramData.length > 0 ? (
              sasaranProgramData.map(item => (
                <SasaranProgramAccordion
                  key={item.id}
                  sasaran={item} // Prop yang diharapkan oleh komponen anak adalah 'sasaran'
                  onDataChange={fetchData}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">Belum ada data sasaran program untuk perangkat daerah ini.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SasaranProgramPage;