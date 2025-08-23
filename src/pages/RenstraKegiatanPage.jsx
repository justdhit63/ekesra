// src/pages/RenstraKegiatanPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import ProgramKegiatanAccordion from '../components/ProgramKegiatanAccordion';

function RenstraKegiatanPage() {
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [selectedDaerahId, setSelectedDaerahId] = useState('');
  const [kegiatanData, setKegiatanData] = useState([]); // Diubah untuk menampung program
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

  // DIUBAH: Menggunakan fungsi RPC yang baru dan benar
  const fetchProgramDanKegiatan = async () => {
    if (!selectedDaerahId) return;
    setLoading(true);

    // Panggil fungsi PostgreSQL yang mengambil program beserta kegiatannya
    const { data, error } = await supabase.rpc('get_program_by_pd_with_kegiatan', {
        pd_id: selectedDaerahId
    });

    if (data) {
      setKegiatanData(data);
    } else {
      setKegiatanData([]);
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProgramDanKegiatan();
  }, [selectedDaerahId]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Renstra Kegiatan</h1>
      
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex justify-between items-center">
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

      {loading ? <p className="text-center">Memuat...</p> : (
        <div className="space-y-4">
          {kegiatanData.map(program => (
            // Menggunakan kembali komponen accordion dari halaman Program
            <ProgramKegiatanAccordion 
              key={program.id} 
              program={program}
              onDataChange={fetchProgramDanKegiatan}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default RenstraKegiatanPage;