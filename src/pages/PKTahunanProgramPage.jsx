// src/pages/PKTahunanProgramPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import ProgramPKAccordion from '../components/ProgramPKAccordion';

function PKTahunanProgramPage() {
    const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
    const [selectedDaerahId, setSelectedDaerahId] = useState('');
    const [programData, setProgramData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Mengambil daftar Perangkat Daerah untuk dropdown
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

    // Fungsi untuk mengambil data utama
    const fetchData = async () => {
        if (!selectedDaerahId) return;
        setLoading(true);
        const { data, error } = await supabase.rpc('get_pk_program_tahunan_by_pd', {
            pd_id: selectedDaerahId
        });

        if (data) {
            setProgramData(data);
        } else {
            setProgramData([]);
            console.error("Gagal mengambil data PK Program:", error);
        }
        setLoading(false);
    };

    // Jalankan fetchData setiap kali dropdown berubah
    useEffect(() => {
        fetchData();
    }, [selectedDaerahId]);

    return (
        <div>
            <h1 className="text-xl font-bold text-gray-800 mb-4">Target PK Indikator Program Tahunan</h1>

            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="flex items-center justify-between mb-2 py-4 border-b border-gray-500">
                    <div className="w-1/3">
                        <label htmlFor="perangkat-daerah" className="block text-sm font-medium text-gray-700">Perangkat Daerah</label>
                        <select
                            id="perangkat-daerah"
                            value={selectedDaerahId}
                            onChange={(e) => setSelectedDaerahId(e.target.value)}
                            className="mt-1 block w-full border p-2 rounded-md"
                        >
                            <option value="">Pilih Perangkat Daerah</option>
                            {perangkatDaerahList.map(daerah => (
                                <option key={daerah.id} value={daerah.id}>{daerah.nama_daerah}</option>
                            ))}
                        </select>
                    </div>
                    <h2 className="text-gray-700">Target PK Indikator Program Tahunan 2025-2029</h2>

                </div>

                {loading ? <p className="text-center">Memuat data...</p> : (
                    <div className="space-y-4">
                        {programData && programData.length > 0 ? (
                            programData.map(program => (
                                <ProgramPKAccordion
                                    key={program.id}
                                    program={program}
                                    onDataChange={fetchData}
                                />
                            ))
                        ) : (
                            <p className="text-center text-gray-500">Belum ada data program untuk perangkat daerah ini.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PKTahunanProgramPage;