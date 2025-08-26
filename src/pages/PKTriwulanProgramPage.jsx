import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import ProgramPKTriwulanAccordion from '../components/ProgramPKTriwulanAccordion';

function PKTriwulanProgramPage() {
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [selectedDaerahId, setSelectedDaerahId] = useState('');
  const [programData, setProgramData] = useState([]);
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
    
    try {
      // Langsung gunakan fallback karena struktur data kompleks
      console.log('Using tahunan function as primary method...');
      await fetchDataFallback();
    } catch (err) {
      console.error('Error fetching data:', err);
      setProgramData([]);
    }
    setLoading(false);
  };
  
  const fetchDataFallback = async () => {
    try {
      console.log('Fetching program data with tahunan function...');
      
      // Gunakan function program tahunan yang sudah berfungsi
      const { data, error } = await supabase.rpc('get_pk_program_tahunan_by_pd', { 
        pd_id: selectedDaerahId 
      });
  
      if (data && !error) {
        // Transform data untuk menambahkan struktur indikator yang konsisten
        const transformedData = data.map(program => {
          // Ambil indikator dari sasaran_program jika ada
          let indikatorList = [];
          
          if (program.sasaran_program && Array.isArray(program.sasaran_program)) {
            program.sasaran_program.forEach(sp => {
              if (sp.indikator && Array.isArray(sp.indikator)) {
                indikatorList = [...indikatorList, ...sp.indikator.map(ind => ({
                  ...ind,
                  pk_triwulan: [] // akan diisi dari query terpisah jika diperlukan
                }))];
              }
            });
          }
  
          // Jika tidak ada indikator dari sasaran_program, gunakan indikator langsung
          if (indikatorList.length === 0 && program.indikator) {
            indikatorList = program.indikator.map(ind => ({
              ...ind,
              pk_triwulan: []
            }));
          }
  
          return {
            ...program,
            indikator: indikatorList
          };
        });
        
        setProgramData(transformedData);
        console.log('Program data loaded:', transformedData.length, 'programs');
        console.log('Sample transformed structure:', transformedData[0]);
        
        // Debug: tampilkan indikator yang ditemukan
        transformedData.forEach((program, index) => {
          console.log(`Program ${index + 1}: ${program.deskripsi_program} - ${program.indikator.length} indikator`);
        });
        
      } else {
        console.error('RPC Error:', error);
        setProgramData([]);
      }
    } catch (fallbackErr) {
      console.error('Fallback error:', fallbackErr);
      setProgramData([]);
    }
  };
  
  // Tambahkan function untuk fetch data triwulan secara terpisah jika diperlukan
  const fetchTriwulanDataForIndicator = async (indicatorId, year) => {
    try {
      const { data, error } = await supabase
        .from('pk_indikator_program_triwulan')
        .select(`
          *,s
          profiles(id, full_name)
        `)
        .eq('indikator_program_id', indicatorId)
        .eq('tahun', year);
  
      return data || [];
    } catch (err) {
      console.error('Error fetching triwulan data:', err);
      return [];
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
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Target PK Indikator Program Triwulan</h1>
      
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

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <p className="mt-2 text-gray-600">Memuat data program...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {programData && programData.length > 0 ? (
            <>
              <div className="text-sm text-gray-600 mb-4">
                Menampilkan {programData.length} program untuk tahun {selectedYear}
              </div>
              {programData.map(program => (
                <ProgramPKTriwulanAccordion 
                  key={program.id} 
                  program={program} 
                  onDataChange={fetchData}
                  tahun={selectedYear}
                />
              ))}
            </>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm">
              <div className="text-gray-400 mb-2">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg font-medium">Tidak ada data program</p>
              <p className="text-gray-400 text-sm mt-1">
                Belum ada program yang terdaftar untuk perangkat daerah ini pada tahun {selectedYear}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PKTriwulanProgramPage;