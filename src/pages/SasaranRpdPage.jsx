// src/pages/SasaranRpdPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import SasaranRpdAccordion from '../components/SasaranRpdAccordion'; // Komponen baru

function SasaranRpdPage() {
  const [sasaranList, setSasaranList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    // Query untuk mengambil Sasaran RPD beserta indikator dan penanggung jawabnya
    const { data, error } = await supabase
      .from('sasaran_rpd')
      .select(`
        *,
        tujuan_rpd ( deskripsi ),
        indikator_sasaran_rpd (
          *,
          pj_indikator_sasaran_rpd (
            profiles ( full_name )
          )
        )
      `)
      .order('created_at');
    
    if (data) setSasaranList(data);
    else console.error(error);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sasaran RPD</h1>
        <Link to="/rpd/sasaran/tambah" className="bg-green-600 text-white py-2 px-4 rounded inline-flex items-center">
          <FaPlus className="mr-2" /> Tambah Sasaran
        </Link>
      </div>
      
      {/* Ganti tabel dengan mapping komponen Accordion */}
      <div className="space-y-4">
        {loading ? <p>Memuat...</p> : sasaranList.map((sasaran) => (
          <SasaranRpdAccordion 
            key={sasaran.id} 
            sasaran={sasaran}
            onDataChange={fetchData} // Untuk refresh setelah ada perubahan
          />
        ))}
      </div>
    </div>
  );
}

export default SasaranRpdPage;