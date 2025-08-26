import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

function PKTriwulanKegiatanModal({ kegiatan, initialTahun = '2025', onClose, onSave }) {
    const [tahun, setTahun] = useState(initialTahun || '2025');
    const [indikatorData, setIndikatorData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const tahunOptions = ['2025', '2026', '2027', '2028', '2029'];

    useEffect(() => {
        fetchIndikatorData();
    }, [tahun]);

    const fetchIndikatorData = async () => {
        setLoading(true);
        try {
            // Fetch existing indicators for this kegiatan and tahun
            const { data: existingData, error } = await supabase
                .from('pk_indikator_kegiatan_triwulan')
                .select('*')
                .eq('kegiatan_id', kegiatan.id)
                .eq('tahun', parseInt(tahun));

            if (error) throw error;

            // If no data exists, create template data
            if (!existingData || existingData.length === 0) {
                const templateData = [
                    {
                        id: null,
                        kegiatan_id: kegiatan.id,
                        nama_indikator: '',
                        satuan: '',
                        tahun: parseInt(tahun),
                        target_tw1: '',
                        target_tw2: '',
                        target_tw3: '',
                        target_tw4: ''
                    }
                ];
                setIndikatorData(templateData);
            } else {
                setIndikatorData(existingData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // Create template data on error
            setIndikatorData([{
                id: null,
                kegiatan_id: kegiatan.id,
                nama_indikator: '',
                satuan: '',
                tahun: parseInt(tahun),
                target_tw1: '',
                target_tw2: '',
                target_tw3: '',
                target_tw4: ''
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (index, field, value) => {
        setIndikatorData(prev => prev.map((item, i) => 
            i === index ? { ...item, [field]: value } : item
        ));
    };

    const addNewIndikator = () => {
        const newIndikator = {
            id: null,
            kegiatan_id: kegiatan.id,
            nama_indikator: '',
            satuan: '',
            tahun: parseInt(tahun),
            target_tw1: '',
            target_tw2: '',
            target_tw3: '',
            target_tw4: ''
        };
        setIndikatorData(prev => [...prev, newIndikator]);
    };

    const removeIndikator = (index) => {
        setIndikatorData(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const validData = indikatorData.filter(item => item.nama_indikator.trim() !== '');
            
            for (const item of validData) {
                const dataToSave = {
                    kegiatan_id: item.kegiatan_id,
                    nama_indikator: item.nama_indikator,
                    satuan: item.satuan || null,
                    tahun: item.tahun,
                    target_tw1: parseFloat(item.target_tw1) || null,
                    target_tw2: parseFloat(item.target_tw2) || null,
                    target_tw3: parseFloat(item.target_tw3) || null,
                    target_tw4: parseFloat(item.target_tw4) || null
                };

                if (item.id) {
                    // Update existing
                    const { error } = await supabase
                        .from('pk_indikator_kegiatan_triwulan')
                        .update(dataToSave)
                        .eq('id', item.id);
                    if (error) throw error;
                } else {
                    // Insert new
                    const { error } = await supabase
                        .from('pk_indikator_kegiatan_triwulan')
                        .insert(dataToSave);
                    if (error) throw error;
                }
            }

            alert('Data berhasil disimpan!');
            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Error menyimpan data: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Kelola Target PK Triwulan Kegiatan</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Kegiatan: {kegiatan.nama_kegiatan}</p>
                    <div className="flex items-center space-x-4">
                        <label className="block text-sm font-medium text-gray-700">Tahun:</label>
                        <select
                            value={tahun}
                            onChange={(e) => setTahun(e.target.value)}
                            className="border border-gray-300 rounded-md p-2"
                        >
                            {tahunOptions.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-4">Loading...</div>
                ) : (
                    <div className="space-y-4">
                        {indikatorData.map((indikator, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nama Indikator
                                        </label>
                                        <input
                                            type="text"
                                            value={indikator.nama_indikator}
                                            onChange={(e) => handleInputChange(index, 'nama_indikator', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md p-2"
                                            placeholder="Masukkan nama indikator"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Satuan
                                        </label>
                                        <input
                                            type="text"
                                            value={indikator.satuan}
                                            onChange={(e) => handleInputChange(index, 'satuan', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md p-2"
                                            placeholder="Contoh: Orang, Unit, Persen"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Target TW 1
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={indikator.target_tw1}
                                            onChange={(e) => handleInputChange(index, 'target_tw1', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Target TW 2
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={indikator.target_tw2}
                                            onChange={(e) => handleInputChange(index, 'target_tw2', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Target TW 3
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={indikator.target_tw3}
                                            onChange={(e) => handleInputChange(index, 'target_tw3', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Target TW 4
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={indikator.target_tw4}
                                            onChange={(e) => handleInputChange(index, 'target_tw4', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                </div>

                                {indikatorData.length > 1 && (
                                    <button
                                        onClick={() => removeIndikator(index)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                                    >
                                        Hapus Indikator
                                    </button>
                                )}
                            </div>
                        ))}

                        <button
                            onClick={addNewIndikator}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Tambah Indikator
                        </button>
                    </div>
                )}

                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
                    >
                        {saving ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PKTriwulanKegiatanModal;