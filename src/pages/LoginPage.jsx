import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link, useNavigate  } from 'react-router-dom';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();


    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        console.log("Login attempt response:", { data, error });

        if (error) {
            setMessage(error.error_description || error.message);
        } else if (data.user) {
            console.log("Login successful, user:", data.user); // <-- LOG INI
            navigate('/');
          } else {
            setMessage("Terjadi kesalahan yang tidak diketahui saat login.");
          }
        // Jika berhasil, onAuthStateChange di App.jsx akan menangani navigasi
        setLoading(false);
    };


    return (
        // Latar belakang utama dan layout flex untuk menengahkan konten
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            {/* Container form */}
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <Link to={`/welcome`} className="text-2xl font-bold text-center text-gray-800 mx-auto w-full mb-6 inline-flex items-center justify-center">
                    Login e-Kesra
                </Link>

                {/* Tampilkan pesan error jika ada */}
                {message && <p className="text-center text-red-500 bg-red-100 p-3 rounded-md mb-4">{message}</p>}

                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="nama@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 disabled:bg-blue-300"
                        >
                            {loading ? 'Memproses...' : 'Login'}
                        </button>
                    </div>
                </form>
                <p className="text-center text-gray-600 text-sm mt-6">
                    Belum punya akun?{' '}
                    <Link to="/signup" className="font-bold text-blue-600 hover:underline">
                        Daftar di sini
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;