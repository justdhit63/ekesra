// src/pages/RenstraTujuanPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import TujuanCard from '../components/TujuanCard'; // Ganti nama komponen

function RenstraTujuanPage() {
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [selectedDaerahId, setSelectedDaerahId] = useState('');
  const [data, setData] = useState([]); // Ganti nama state
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPerangkatDaerah = async () => {
      const { data: pdData } = await supabase.from('perangkat_daerah').select('id, nama_daerah');
      if (pdData) {
        setPerangkatDaerahList(pdData);
        if (pdData.length > 0) {
          setSelectedDaerahId(pdData[0].id);
        }
      }
    };
    fetchPerangkatDaerah();
  }, []);

  const fetchData = async () => {
    if (!selectedDaerahId) return;
    setLoading(true);
    // Query baru untuk mengambil data sesuai hierarki
    const { data: rpdData, error } = await supabase
      .from('sasaran_rpd')
      .select(`
        deskripsi,
        renstra_tujuan (
          *,
          renstra_sasaran (
            *,
            renstra_indikator_sasaran(*)
          )
        )
      `)
      .eq('renstra_tujuan.perangkat_daerah_id', selectedDaerahId);

    if (rpdData) {
      setData(rpdData);
    } else {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [selectedDaerahId]);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Renstra Tujuan</h1>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Perangkat Daerah</label>
            <select
              value={selectedDaerahId}
              onChange={(e) => setSelectedDaerahId(e.target.value)}
              className="border p-2 rounded-md"
            >
              {perangkatDaerahList.map(daerah => (
                <option key={daerah.id} value={daerah.id}>{daerah.nama_daerah}</option>
              ))}
            </select>
          </div>
          <Link to='/renstra/tujuan/tambah' className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center">
            <FaPlus className="mr-2" />
            Tambah Tujuan
          </Link>
        </div>
      </div>
      
      {loading ? <p className="text-center">Memuat data...</p> : (
        <div className="space-y-6">
          {data.map((sasaranRpd, index) => (
            <div key={index}>
              <h2 className="text-lg font-semibold mb-2">Acuan Sasaran RPD: <span className="font-normal">{sasaranRpd.deskripsi}</span></h2>
              {sasaranRpd.renstra_tujuan.map(tujuan => (
                <TujuanCard 
                  key={tujuan.id}
                  tujuan={tujuan}
                  onDataChange={fetchData}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RenstraTujuanPage;