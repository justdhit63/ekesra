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
                </div>
            </main>
        </div>
    );
}

export default Dashboard;