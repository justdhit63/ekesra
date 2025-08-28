import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

function Dashboard({ session }) {
    const [perencanaan, setPerencanaan] = useState([]);
    const [sasaran, setSasaran] = useState('');
    const [target, setTarget] = useState('');
    const [loadingPerencanaan, setLoadingPerencanaan] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // Fungsi untuk mengambil data perencanaan
        const getPerencanaan = async () => {
            setLoadingPerencanaan(true);
            const { user } = session;
            const { data, error } = await supabase
                .from('perencanaan_kinerja')
                .select(`*`)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false }); // Urutkan dari yang terbaru

            if (error) {
                console.warn(error);
            } else if (data) {
                setPerencanaan(data);
            }
            setLoadingPerencanaan(false);
        };

        getPerencanaan();
    }, [session]);

    async function getPerencanaan() {
        setLoadingPerencanaan(true);
        const { user } = session;
        const { data, error } = await supabase
            .from('perencanaan_kinerja')
            .select(`*`)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }); // Urutkan dari yang terbaru

        if (error) {
            console.warn(error);
        } else if (data) {
            setPerencanaan(data);
        }
        setLoadingPerencanaan(false);
    }

    async function addPerencanaan(e) {
        e.preventDefault();
        setSaving(true);
        const { user } = session;
        const { error } = await supabase
            .from('perencanaan_kinerja')
            .insert({
                sasaran_kegiatan: sasaran,
                target: target,
                tahun: new Date().getFullYear(),
                user_id: user.id
            })
            .select(); // Tambahkan .select() untuk memuat ulang data

        if (error) {
            alert(error.message);
        } else {
            setSasaran('');
            setTarget('');
            getPerencanaan(); // Panggil lagi untuk refresh list
        }
        setSaving(false);
    }

    const handleLogout = () => {
        supabase.auth.signOut();
    }

    return (
        <div className="min-h-screen">
            {/* Konten Utama */}
            <h1 className="text-xl font-bold text-gray-900 mb-4">Dashboard</h1>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div>
                    {/* Kartu Informasi Pengguna */}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Informasi Pengguna</h2>
                        <div className="space-y-2 text-gray-700">
                            <p><strong>Email:</strong> {session.user.email}</p>
                            <p><strong>Nama:</strong> {session.user.user_metadata?.full_name || 'Tidak tersedia'}</p>
                        </div>
                    </div>

                    {/* Form Tambah Perencanaan */}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tambah Perencanaan Kinerja Baru</h3>
                        <form onSubmit={addPerencanaan} className="space-y-4">
                            <div>
                                <label htmlFor="sasaran" className="block text-sm font-medium text-gray-700">Sasaran Kegiatan</label>
                                <input
                                    id="sasaran"
                                    type="text"
                                    placeholder="Contoh: Menurunkan angka stunting"
                                    value={sasaran}
                                    onChange={(e) => setSasaran(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="target" className="block text-sm font-medium text-gray-700">Target</label>
                                <input
                                    id="target"
                                    type="text"
                                    placeholder="Contoh: Sebesar 5% pada tahun 2025"
                                    value={target}
                                    onChange={(e) => setTarget(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div className="text-right">
                                <button type="submit" disabled={saving} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300">
                                    {saving ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Tabel Daftar Perencanaan */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <h3 className="text-lg font-semibold text-gray-800 p-6">Daftar Perencanaan Kinerja Anda</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sasaran Kegiatan</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loadingPerencanaan ? (
                                        <tr><td colSpan="3" className="text-center py-4">Memuat data...</td></tr>
                                    ) : perencanaan.length > 0 ? (
                                        perencanaan.map(item => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                                    <Link to={`/perencanaan/${item.id}`} className="text-indigo-600 hover:text-indigo-900">
                                                        {item.sasaran_kegiatan}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.target}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.tahun}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="3" className="text-center py-4 text-gray-500">Belum ada data perencanaan.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;