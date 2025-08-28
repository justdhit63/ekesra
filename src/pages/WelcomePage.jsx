import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LaporanRenstraPage from './LaporanRenstraPage'
import { FaBook, FaChevronDown, FaLandmark, FaTree } from 'react-icons/fa'
import PohonKinerjaPage from './PohonKinerjaPage'

const WelcomePage = () => {
    const navigate = useNavigate()
    const [isLaporan, setIsLaporan] = useState(false);
    const [isPohon, setIsPohon] = useState(false);

    const handleLoginClick = () => {
        navigate('/login')
    }

    const handleLaporanClick = () => {
        setIsLaporan(!isLaporan);
        setIsPohon(false);
    }

    const handlePohonClick = () => {
        setIsPohon(!isPohon);
        setIsLaporan(false);
    }

    return (
        <main className="min-h-screen mx-auto p-20 bg-gray-100">
            <div className="bg-white min-h-screen p-10 rounded-xl shadow-lg text-center w-full">
                <header className="w-full flex justify-between items-center">
                    <h1 className="text-green-600 text-4xl font-bold">e-Kesra</h1>
                    <button
                        onClick={handleLoginClick}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    >
                        Masuk ke Aplikasi
                    </button>
                </header>

                <div className="border my-6 border-gray-300 w-5/6 mx-auto"></div>

                <section className="flex flex-col items-center justify-center min-h-full mb-8">
                    <p className="text-gray-600 my-10 text-lg leading-relaxed">
                        Selamat datang di aplikasi E-Kesra.
                    </p>
                    <div className="flex items-center justify-center gap-8 w-1/2">
                        <button onClick={handleLaporanClick} className="w-full flex justify-between text-white items-center p-3 my-1 rounded-md bg-green-600 hover:bg-green-700">
                            <div className="flex items-center"><FaBook className="mr-3" />Laporan Renstra</div>
                            <FaChevronDown className={`transition-transform duration-200 ${isLaporan ? 'rotate-180' : ''}`} />
                        </button>

                        <button onClick={handlePohonClick} className="w-full flex justify-between items-center text-white p-3 my-1 rounded-md bg-green-600 hover:bg-green-700">
                            <div className="flex items-center"><FaTree className="mr-3" />Pohon Kinerja</div>
                            <FaChevronDown className={`transition-transform duration-200 ${isPohon ? 'rotate-180' : ''}`} />
                        </button>


                    </div>
                </section>

                {isLaporan && (
                    <LaporanRenstraPage />
                )}

                {isPohon && (
                    <PohonKinerjaPage />
                )}




            </div>
        </main>
    )
}

export default WelcomePage