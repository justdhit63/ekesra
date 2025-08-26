import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function PKTriwulanKegiatanEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nama_indikator: '',
        satuan: '',
        target_tw1: '',
        target_tw2: '',
        target_tw3: '',
        target_tw4: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchIndikator = async () => {
            const { data, error } = await supabase
                .from('pk_indikator_kegiatan_triwulan')
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) {
                alert('Error fetching data: ' + error.message);
                navigate(-1);
            } else {
                setFormData({
                    nama_indikator: data.nama_indikator || '',
                    satuan: data.satuan || '',
                    target_tw1: data.target_tw1 || '',
                    target_tw2: data.target_tw2 || '',
                    target_tw3: data.target_tw3 || '',
                    target_tw4: data.target_tw4 || ''
                });
            }
            setLoading(false);
        };
        
        if (id) fetchIndikator();
    }, [id, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const { error } = await supabase
            .from('pk_indikator_kegiatan_triwulan')
            .update({
                nama_indikator: formData.nama_indikator,
                satuan: formData.satuan,
                target_tw1: parseFloat(formData.target_tw1) || null,
                target_tw2: parseFloat(formData.target_tw2) || null,
                target_tw3: parseFloat(formData.target_tw3) || null,
                target_tw4: parseFloat(formData.target_tw4) || null
            })
            .eq('id', id);

        if (error) {
            alert('Error saving data: ' + error.message);
        } else {
            alert('Data berhasil disimpan!');
            navigate(-1);
        }
        setSaving(false);
    };

    if (loading) {
        return <div className="text-center py-8">Memuat data...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Edit Indikator PK Kegiatan Triwulan</h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Kembali
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nama Indikator <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="nama_indikator"
                            value={formData.nama_indikator}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Satuan
                        </label>
                        <input
                            type="text"
                            name="satuan"
                            value={formData.satuan}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Contoh: Orang, Unit, Persen, dll"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Target Triwulan 1
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="target_tw1"
                                value={formData.target_tw1}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Target Triwulan 2
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="target_tw2"
                                value={formData.target_tw2}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Target Triwulan 3
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="target_tw3"
                                value={formData.target_tw3}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Target Triwulan 4
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="target_tw4"
                                value={formData.target_tw4}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
                        >
                            {saving ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PKTriwulanKegiatanEditPage;