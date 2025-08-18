// src/pages/SasaranProgramPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
// 1. Impor komponen Accordion yang baru
import SasaranProgramAccordion from '../components/SasaranProgramAccordion';

function SasaranProgramPage() {
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [selectedDaerahId, setSelectedDaerahId] = useState('');
  const [sasaranProgramData, setSasaranProgramData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fungsi fetchData tidak perlu diubah
  const fetchData = async () => {
    if (!selectedDaerahId) return;
    setLoading(true);

    const { data, error } = await supabase.rpc('get_sasaran_program_by_pd', {
      pd_id: selectedDaerahId
    });

    // Supabase RPC bisa mengembalikan null jika tidak ada data, jadi kita beri array kosong
    if (data) setSasaranProgramData(data);
    else {
      setSasaranProgramData([]);
      console.error(error);
    }
    setLoading(false);
  };

  // useEffect untuk fetchPerangkatDaerah tidak perlu diubah
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

  // useEffect untuk fetchData tidak perlu diubah
  useEffect(() => {
    fetchData();
  }, [selectedDaerahId]);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Sasaran Program</h1>
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="mb-4 flex justify-between items-center">
          <select
            value={selectedDaerahId}
            onChange={(e) => setSelectedDaerahId(e.target.value)}
            className="border p-2 rounded-md w-1/3"
          >
            {perangkatDaerahList.map(daerah => (
              <option key={daerah.id} value={daerah.id}>{daerah.nama_daerah}</option>
            ))}
          </select>
          <Link to="/renstra/program/sasaran/tambah" className="bg-green-600 text-white py-2 px-4 rounded inline-flex items-center">
            <FaPlus className="mr-2" />
            Tambah
          </Link>
        </div>

        <h2 className="text-gray-700 pb-5 border-b mb-2 border-gray-600">Sasaran Program & Indikator Program PD</h2>

        {/* 2. Ganti placeholder dengan mapping komponen Accordion */}
        {loading ? (
          <p className="text-center">Loading data...</p>
        ) : (
          <div className="space-y-4">
            {sasaranProgramData && sasaranProgramData.length > 0 ? (
              sasaranProgramData.map(item => (
                <SasaranProgramAccordion
                  key={item.id}
                  sasaranProgram={item}
                  onDataChange={fetchData} // Kirim fungsi refresh
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