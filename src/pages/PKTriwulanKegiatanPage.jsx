import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import KegiatanPKTriwulanAccordion from '../components/KegiatanPKTriwulanAccordion';

function PKTriwulanKegiatanPage() {
    const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
    const [selectedDaerahId, setSelectedDaerahId] = useState('');
    const [selectedTahun, setSelectedTahun] = useState('2025');
    const [kegiatanList, setKegiatanList] = useState([]);
    const [loading, setLoading] = useState(false);

    const tahunOptions = ['2025', '2026', '2027', '2028', '2029'];

    useEffect(() => {
        const fetchPerangkatDaerah = async () => {
            const { data, error } = await supabase
                .from('perangkat_daerah')
                .select('id, nama_daerah')
                .order('nama_daerah');
            if (error) {
                console.error('Error fetching perangkat daerah:', error);
            } else {
                setPerangkatDaerahList(data || []);
                if (data && data.length > 0) {
                    setSelectedDaerahId(data[0].id);
                }
            }
        };
        fetchPerangkatDaerah();
    }, []);

    useEffect(() => {
        if (selectedDaerahId) {
            fetchKegiatanData();
        }
    }, [selectedDaerahId, selectedTahun]);

    const fetchKegiatanData = async () => {
        if (!selectedDaerahId) return;
        
        setLoading(true);
        try {
            const { data, error } = await supabase
                .rpc('get_pk_kegiatan_triwulan_by_pd', { 
                    pd_id: selectedDaerahId,
                    target_tahun: parseInt(selectedTahun)
                });

            if (error) throw error;
            setKegiatanList(data || []);
        } catch (error) {
            console.error('Error fetching kegiatan data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDataChange = () => {
        fetchKegiatanData();
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Target PK Indikator Kegiatan Triwulan</h1>
            
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Perangkat Daerah</label>
                        <select 
                            value={selectedDaerahId}
                            onChange={(e) => setSelectedDaerahId(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2"
                        >
                            {perangkatDaerahList.map(daerah => (
                                <option key={daerah.id} value={daerah.id}>{daerah.nama_daerah}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
                        <select 
                            value={selectedTahun}
                            onChange={(e) => setSelectedTahun(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2"
                        >
                            {tahunOptions.map(tahun => (
                                <option key={tahun} value={tahun}>{tahun}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <p className="text-sm text-gray-600 mt-2">
                    Menampilkan {kegiatanList.length} kegiatan untuk tahun {selectedTahun}
                </p>
            </div>

            {loading ? (
                <div className="text-center py-8">Loading...</div>
            ) : (
                <div className="space-y-4">
                    {kegiatanList.length > 0 ? (
                        kegiatanList.map(kegiatan => (
                            <KegiatanPKTriwulanAccordion 
                                key={kegiatan.id} 
                                kegiatan={kegiatan}
                                tahun={selectedTahun}
                                onDataChange={handleDataChange}
                            />
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            Belum ada data kegiatan untuk perangkat daerah dan tahun yang dipilih.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default PKTriwulanKegiatanPage;