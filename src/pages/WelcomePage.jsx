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
    }

    const handlePohonClick = () => {
        setIsPohon(!isPohon);
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-10 rounded-xl shadow-lg text-center w-full">
                <h1 className="text-4xl font-bold text-gray-800 mb-6">
                    Selamat Datang
                </h1>

                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                    Selamat datang di aplikasi E-Kesra. Silakan login untuk melanjutkan.
                </p>

                <button onClick={handleLaporanClick} className="w-full flex justify-between items-center p-3 my-1 rounded-md hover:bg-green-800">
                    <div className="flex items-center"><FaBook className="mr-3" />Muncullah Kau Laporan!!!</div>
                    <FaChevronDown className={`transition-transform duration-200 ${isLaporan ? 'rotate-180' : ''}`} />
                </button>

                {isLaporan && (
                    <LaporanRenstraPage />
                )}

                <button onClick={handlePohonClick} className="w-full flex justify-between items-center p-3 my-1 rounded-md hover:bg-green-800">
                    <div className="flex items-center"><FaTree className="mr-3" />Muncullah Kau Pohon!!!</div>
                    <FaChevronDown className={`transition-transform duration-200 ${isPohon ? 'rotate-180' : ''}`} />
                </button>

                {isPohon && (
                    <PohonKinerjaPage />
                )}

                <button
                    onClick={handleLoginClick}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                    Masuk ke Aplikasi
                </button>
            </div>
        </div>
    )
}

export default WelcomePage