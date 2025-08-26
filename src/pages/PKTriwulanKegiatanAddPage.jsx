import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function PKTriwulanKegiatanAddPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const kegiatanId = searchParams.get('kegiatan_id');
    
    const [formData, setFormData] = useState({
        kegiatan_id: kegiatanId || '',
        nama_indikator: '',
        satuan: '',
        target_tw1: '',
        target_tw2: '',
        target_tw3: '',
        target_tw4: ''
    });
    const [kegiatanList, setKegiatanList] = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchKegiatan = async () => {
            const { data } = await supabase
                .from('kegiatan')
                .select('id, nama_kegiatan, program_id, program(nama_program)')
                .order('nama_kegiatan');
            if (data) setKegiatanList(data);
        };
        fetchKegiatan();
    }, []);

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
            .insert({
                kegiatan_id: parseInt(formData.kegiatan_id),
                nama_indikator: formData.nama_indikator,
                satuan: formData.satuan,
                target_tw1: parseFloat(formData.target_tw1) || null,
                target_tw2: parseFloat(formData.target_tw2) || null,
                target_tw3: parseFloat(formData.target_tw3) || null,
                target_tw4: parseFloat(formData.target_tw4) || null
            });

        if (error) {
            alert('Error saving data: ' + error.message);
        } else {
            alert('Data berhasil disimpan!');
            navigate('/pk-triwulan/kegiatan');
        }
        setSaving(false);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Tambah Indikator PK Kegiatan Triwulan</h1>
                    <button
                        onClick={() => navigate('/pk-triwulan/kegiatan')}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Kembali
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Kegiatan <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="kegiatan_id"
                            value={formData.kegiatan_id}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">Pilih Kegiatan</option>
                            {kegiatanList.map(kegiatan => (
                                <option key={kegiatan.id} value={kegiatan.id}>
                                    {kegiatan.program?.nama_program} - {kegiatan.nama_kegiatan}
                                </option>
                            ))}
                        </select>
                    </div>

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
                            onClick={() => navigate('/pk-triwulan/kegiatan')}
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

export default PKTriwulanKegiatanAddPage;