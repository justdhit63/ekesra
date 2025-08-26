import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import SasaranPKTriwulanAccordion from '../components/SasaranPKTriwulanAccordion';

function PKTriwulanSasaranPage() {
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [selectedDaerahId, setSelectedDaerahId] = useState('');
  const [sasaranData, setSasaranData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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

  const fetchData = async () => {
    if (!selectedDaerahId) return;
    setLoading(true);
    
    // Gunakan RPC function yang baru untuk triwulan
    const { data, error } = await supabase.rpc('get_pk_sasaran_triwulan_by_pd', {
      pd_id: selectedDaerahId
    });
  
    if (data) {
      setSasaranData(data);
    } else {
      setSasaranData([]);
      console.error(error);
    }
    setLoading(false);
  };

  const fetchDataFallback = async () => {
    try {
      // Coba beberapa kemungkinan nama kolom
      let query = supabase.from('pk_sasaran').select('*');
      
      // Test query untuk mengetahui struktur tabel
      const { data: testData, error: testError } = await query.limit(1);
      
      if (testError) {
        console.error('Test query error:', testError);
        setSasaranData([]);
        return;
      }

      if (testData && testData.length > 0) {
        console.log('Struktur tabel pk_sasaran:', Object.keys(testData[0]));
        
        // Berdasarkan struktur, coba query yang sesuai
        // Kemungkinan nama kolom: pd_id, perangkat_daerah_id, atau join dengan tabel lain
        
        // Opsi 1: Jika ada kolom pd_id
        const { data: option1, error: error1 } = await supabase
          .from('pk_sasaran')
          .select('*')
          .eq('pd_id', selectedDaerahId);

        if (!error1 && option1) {
          setSasaranData(option1);
          return;
        }

        // Opsi 2: Ambil semua data jika tidak ada filter yang tepat
        const { data: allData, error: allError } = await supabase
          .from('pk_sasaran')
          .select('*');

        if (!allError && allData) {
          setSasaranData(allData);
          return;
        }

        setSasaranData([]);
      }
    } catch (fallbackErr) {
      console.error('Fallback error:', fallbackErr);
      setSasaranData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDaerahId, selectedYear]);

  // Generate tahun options (5 tahun ke belakang dan 5 tahun ke depan)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Target PK Indikator Sasaran Triwulan</h1>
      
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Perangkat Daerah</label>
            <select 
              value={selectedDaerahId}
              onChange={(e) => setSelectedDaerahId(e.target.value)}
              className="mt-1 block w-full border p-2 rounded-md"
            >
              {perangkatDaerahList.map(daerah => (
                <option key={daerah.id} value={daerah.id}>{daerah.nama_daerah}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Tahun</label>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="mt-1 block w-full border p-2 rounded-md"
            >
              {generateYearOptions().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? <p className="text-center">Memuat...</p> : (
        <div className="space-y-4">
          {sasaranData && sasaranData.length > 0 ? (
            sasaranData.map(sasaran => (
              <SasaranPKTriwulanAccordion 
                key={sasaran.id} 
                sasaran={sasaran} 
                onDataChange={fetchData}
                tahun={selectedYear}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">Tidak ada data untuk ditampilkan.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default PKTriwulanSasaranPage;