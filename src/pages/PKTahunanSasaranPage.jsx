// src/pages/PKTahunanSasaranPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import SasaranPKAccordion from '../components/SasaranPKAccordion';

function PKTahunanSasaranPage() {
    const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
    const [selectedDaerahId, setSelectedDaerahId] = useState('');
    const [sasaranData, setSasaranData] = useState([]);
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

    // Fungsi untuk mengambil data utama (sasaran, indikator, dan target PK)
    const fetchData = async () => {
        if (!selectedDaerahId) return;
        setLoading(true);
        const { data, error } = await supabase.rpc('get_pk_sasaran_tahunan_by_pd', {
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

    // Jalankan fetchData setiap kali dropdown berubah
    useEffect(() => {
        fetchData();
    }, [selectedDaerahId]);

    return (
        <div>
            <h1 className="text-xl font-bold text-gray-800 mb-4">Target PK Indikator Sasaran Tahunan</h1>

            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="flex items-center justify-between border-b border-b-gray-500 py-4 mb-2">
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
                    <h2 className="text-gray-700">Target PK Indikator Sasaran Tahunan 2025-2029</h2>
                </div>
                {loading ? <p className="text-center">Memuat data...</p> : (
                    <div className="space-y-4">
                        {sasaranData && sasaranData.length > 0 ? (
                            sasaranData.map(sasaran => (
                                <SasaranPKAccordion
                                    key={sasaran.id}
                                    sasaran={sasaran}
                                    onDataChange={fetchData}
                                />
                            ))
                        ) : (
                            <p className="text-center text-gray-500">Belum ada data sasaran untuk perangkat daerah ini.</p>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
}

export default PKTahunanSasaranPage;