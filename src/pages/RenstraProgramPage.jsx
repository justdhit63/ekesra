// src/pages/RenstraProgramPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import RenstraSasaranProgramAccordion from '../components/RenstraSasaranProgramAccordion';

function RenstraProgramPage() {
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

  const fetchSasaranDanProgram = async () => {
    if (!selectedDaerahId) return;
    setLoading(true);
    // Memanggil fungsi database yang benar
    const { data, error } = await supabase.rpc('get_program_by_pd', {
      pd_id: selectedDaerahId
    });

    if (data) {
      setSasaranData(data);
    } else {
      setSasaranData([]);
      console.error("Gagal mengambil data Renstra Program:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSasaranDanProgram();
  }, [selectedDaerahId]);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Renstra Program</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-6">
          {/* Dropdown Perangkat Daerah */}
          <select
            value={selectedDaerahId}
            onChange={(e) => setSelectedDaerahId(e.target.value)}
            className="mt-1 block w-full md:w-1/3 border border-gray-300 rounded-md shadow-sm py-2 px-3"
          >
            {perangkatDaerahList.map(daerah => (
              <option key={daerah.id} value={daerah.id}>{daerah.nama_daerah}</option>
            ))}
          </select>
          <Link to="/renstra/program/tambah" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center">
            <FaPlus className="mr-2" />
            Tambah
          </Link>
        </div>
        <h2 className="text-gray-700 pb-5 border-b mb-4 border-gray-600">Renstra Program Periode 2025-2029</h2>
        {loading ? <p className="text-center">Memuat...</p> : (
          <div className="space-y-4">
            {sasaranData && sasaranData.length > 0 ? (
                sasaranData.map(sasaran => (
                <RenstraSasaranProgramAccordion
                    key={sasaran.id}
                    sasaran={sasaran} // Nama prop yang benar adalah 'sasaran'
                    onDataChange={fetchSasaranDanProgram}
                />
                ))
            ) : (
                <p className="text-center text-gray-500">Tidak ada data untuk ditampilkan.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default RenstraProgramPage;