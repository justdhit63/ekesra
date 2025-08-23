// src/pages/RenstraSasaranPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import SasaranAccordion from '../components/SasaranAccordion';

function RenstraSasaranPage() {
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [selectedDaerahId, setSelectedDaerahId] = useState('');
  const [dataTujuan, setDataTujuan] = useState([]); // State untuk menampung data tujuan
  const [loading, setLoading] = useState(false);

  // Mengambil daftar Perangkat Daerah
  useEffect(() => {
    const fetchPerangkatDaerah = async () => {
      const { data } = await supabase.from('perangkat_daerah').select('id, nama_daerah');
      if (data) {
        setPerangkatDaerahList(data);
        if (data.length > 0) {
          setSelectedDaerahId(data[0].id);
        }
      }
    };
    fetchPerangkatDaerah();
  }, []);

  // DIUBAH: Mengambil data mulai dari Renstra Tujuan
  const fetchData = async () => {
    if (!selectedDaerahId) return;
    setLoading(true);
    
    // Query baru: Ambil semua 'tujuan' dari PD yang dipilih,
    // lalu sertakan semua 'sasaran' di bawah setiap tujuan tersebut.
    const { data, error } = await supabase
      .from('renstra_tujuan')
      .select(`
        id,
        deskripsi_tujuan,
        renstra_sasaran (
          *,
          renstra_indikator_sasaran (*)
        )
      `)
      .eq('perangkat_daerah_id', selectedDaerahId);
      
    if (data) {
      setDataTujuan(data);
    } else {
      setDataTujuan([]);
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [selectedDaerahId]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Renstra Sasaran</h1>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex justify-between items-center">
        <select 
          value={selectedDaerahId}
          onChange={(e) => setSelectedDaerahId(e.target.value)}
          className="border p-2 rounded-md"
        >
          {perangkatDaerahList.map(daerah => (
            <option key={daerah.id} value={daerah.id}>{daerah.nama_daerah}</option>
          ))}
        </select>
        <Link 
          to="/renstra/sasaran/tambah"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
        >
          <FaPlus className="mr-2" />
          Tambah
        </Link>
      </div>

      {/* DIUBAH: Tampilan data disesuaikan dengan hierarki baru */}
      {loading ? (
        <p className="text-center">Memuat data...</p>
      ) : (
        <div className="space-y-6">
          {dataTujuan.map(tujuan => (
            <div key={tujuan.id}>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Tujuan: <span className="font-normal">{tujuan.deskripsi_tujuan}</span>
              </h2>
              {tujuan.renstra_sasaran.length > 0 ? (
                tujuan.renstra_sasaran.map(sasaran => (
                  <SasaranAccordion 
                    key={sasaran.id} 
                    sasaran={sasaran}
                    onDataChange={fetchData}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500 ml-4">- Belum ada sasaran untuk tujuan ini.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RenstraSasaranPage;