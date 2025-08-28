// src/pages/LaporanIndividuPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

function LaporanIndividuPage() {
  const [penanggungJawabList, setPenanggungJawabList] = useState([]);
  const [selectedPjId, setSelectedPjId] = useState('');
  const [laporanData, setLaporanData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ambil daftar semua penanggung jawab untuk dropdown
  useEffect(() => {
    const fetchPJ = async () => {
      const { data } = await supabase.from('penanggung_jawab').select('id, nama, jabatan');
      if (data) {
        setPenanggungJawabList(data);
        if (data.length > 0) {
          setSelectedPjId(data[0].id);
        }
      }
    };
    fetchPJ();
  }, []);

  // Ambil data laporan setiap kali pilihan dropdown berubah
  useEffect(() => {
    if (!selectedPjId) return;

    const fetchLaporan = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_tanggung_jawab_by_pj', {
        pj_id: selectedPjId
      });
      if (data) {
        // Gabungkan semua hasil menjadi satu array agar mudah ditampilkan
        const allResponsibilities = [
          ...(data.indikator_sasaran || []),
          ...(data.indikator_program || []),
          ...(data.indikator_kegiatan || []),
          ...(data.indikator_sub_kegiatan || []),
        ];
        setLaporanData(allResponsibilities);
      } else {
        console.error(error);
        setLaporanData([]);
      }
      setLoading(false);
    };

    fetchLaporan();
  }, [selectedPjId]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-900 mb-4">Laporan Kinerja Individu</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-800">
        <div className="w-full md:w-1/3 mb-6">
          <label className="block text-sm font-medium text-green-800">Pilih Penanggung Jawab</label>
          <select 
            value={selectedPjId}
            onChange={(e) => setSelectedPjId(e.target.value)}
            className="mt-1 block w-full border border-green-600 p-2 rounded-md focus:border-green-800 focus:ring-green-800"
          >
            {penanggungJawabList.map(pj => (
              <option key={pj.id} value={pj.id}>{pj.nama} - ({pj.jabatan})</option>
            ))}
          </select>
        </div>

        {loading ? <p className="text-green-700">Memuat laporan...</p> : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-sm border border-green-600">
              <thead className="bg-green-800">
                <tr>
                  <th className="py-2 px-4 border border-green-600 text-left font-semibold text-white">No.</th>
                  <th className="py-2 px-4 border border-green-600 text-left font-semibold text-white">Tanggung Jawab (Indikator)</th>
                  <th className="py-2 px-4 border border-green-600 text-left font-semibold text-white">Level Perencanaan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-600">
                {laporanData && laporanData.length > 0 ? (
                  laporanData.map((item, index) => (
                    <tr key={index} className="hover:bg-green-100">
                      <td className="py-2 px-4 border border-green-600">{index + 1}</td>
                      <td className="py-2 px-4 border border-green-600">{item.deskripsi_indikator}</td>
                      <td className="py-2 px-4 border border-green-600">{item.level}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-4 text-center text-green-700 border border-green-600">
                      Tidak ditemukan tanggung jawab untuk penanggung jawab ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default LaporanIndividuPage;