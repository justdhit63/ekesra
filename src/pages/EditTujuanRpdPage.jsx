// src/pages/EditTujuanRpdPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, useParams, Link } from 'react-router-dom';

function EditTujuanRpdPage() {
    const { id } = useParams();
    const [deskripsi, setDeskripsi] = useState('');
    const [periodeAwal, setPeriodeAwal] = useState('');
    const [periodeAkhir, setPeriodeAkhir] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTujuan = async () => {
            const { data } = await supabase.from('tujuan_rpd').select('*').eq('id', id).single();
            if (data) {
                setDeskripsi(data.deskripsi);
                setPeriodeAwal(data.periode_awal);
                setPeriodeAkhir(data.periode_akhir);
            }
        };
        fetchTujuan();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        await supabase.from('tujuan_rpd').update({
            deskripsi, periode_awal: periodeAwal, periode_akhir: periodeAkhir
        }).eq('id', id);
        navigate('/rpd/tujuan');
    };

    return (
        <div className="mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Form Edit Tujuan RPJMB</h1>
            <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                    <textarea
                        value={deskripsi}
                        onChange={e => setDeskripsi(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Periode Awal</label>
                    <input
                        type="number"
                        value={periodeAwal}
                        onChange={e => setPeriodeAwal(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Periode Akhir</label>
                    <input
                        type="number"
                        value={periodeAkhir}
                        onChange={e => setPeriodeAkhir(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex justify-between items-center">
                    <Link
                        to="/rpd/tujuan"
                        className="text-blue-500 hover:underline"
                    >
                        Batal
                    </Link>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Simpan
                    </button>
                </div>
            </form>
        </div>
    );
}
export default EditTujuanRpdPage;