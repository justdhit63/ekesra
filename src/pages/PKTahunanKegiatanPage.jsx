// src/pages/PKTahunanKegiatanPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import KegiatanPKAccordion from '../components/KegiatanPKAccordion';

function PKTahunanKegiatanPage() {
    const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
    const [selectedDaerahId, setSelectedDaerahId] = useState('');
    const [kegiatanData, setKegiatanData] = useState([]);
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

    const fetchData = async () => {
        if (!selectedDaerahId) return;
        setLoading(true);
        const { data, error } = await supabase.rpc('get_pk_kegiatan_tahunan_by_pd', { pd_id: selectedDaerahId });
        if (data) setKegiatanData(data);
        else setKegiatanData([]);
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, [selectedDaerahId]);

    return (
        <div>
            <h1 className="text-xl font-bold text-gray-800 mb-4">Target PK Indikator Kegiatan Tahunan</h1>
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="flex items-center justify-between border-b py-4 mb-2 border-gray-500">

                    <div className="w-1/3">
                        <select value={selectedDaerahId} onChange={(e) => setSelectedDaerahId(e.target.value)} className="mt-1 block w-full border p-2 rounded-md">
                            {perangkatDaerahList.map(daerah => (
                                <option key={daerah.id} value={daerah.id}>{daerah.nama_daerah}</option>
                            ))}
                        </select>
                    </div>
                    <h2 className="text-gray-700">Target PK Indikator Program Tahunan 2025-2029</h2>

                </div>
                {loading ? <p>Loading...</p> : (
                    <div className="space-y-4">
                        {kegiatanData.map(kegiatan => (
                            <KegiatanPKAccordion key={kegiatan.id} kegiatan={kegiatan} onDataChange={fetchData} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
export default PKTahunanKegiatanPage;