// src/pages/TujuanRpdPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import TujuanRpdAccordion from '../components/TujuanRpdAccordion'; // Komponen baru

function TujuanRpdPage() {
  const [tujuanList, setTujuanList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    // Query untuk mengambil Tujuan RPD beserta indikator dan penanggung jawabnya
    const { data, error } = await supabase
      .from('tujuan_rpd')
      .select(`
        *,
        indikator_tujuan_rpd (
          *,
          pj_indikator_tujuan_rpd (
            penanggung_jawab ( nama )
          )
        )
      `)
      .order('created_at');
    
    if (data) setTujuanList(data);
    else console.error(error);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tujuan RPJMB</h1>
        <Link to="/rpd/tujuan/tambah" className="bg-green-600 text-white py-2 px-4 rounded inline-flex items-center">
          <FaPlus className="mr-2" /> Tambah Tujuan
        </Link>
      </div>
      
      {/* Ganti tabel dengan mapping komponen Accordion */}
      <div className="space-y-4">
        {loading ? <p>Memuat...</p> : tujuanList.map((tujuan) => (
          <TujuanRpdAccordion 
            key={tujuan.id} 
            tujuan={tujuan}
            onDataChange={fetchData} // Untuk refresh setelah ada perubahan
          />
        ))}
      </div>
    </div>
  );
}

export default TujuanRpdPage;