// src/components/SasaranProgramAccordion.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom'; // 1. Impor Link
import { FaChevronDown, FaEdit, FaTrash } from 'react-icons/fa'; // 2. Impor Ikon
import { supabase } from '../lib/supabaseClient';

// Fungsi bantuan untuk format mata uang Rupiah
const formatRupiah = (number) => {
    // Pastikan input adalah angka, jika tidak kembalikan format default
    const num = parseFloat(number);
    if (isNaN(num)) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(0);
    }
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(num);
};

function RenstraSasaranProgramAccordion({ sasaran, onDataChange }) {
    const [isOpen, setIsOpen] = useState(true);

    const handleDelete = async (programId, programDeskripsi) => {
        if (window.confirm(`Yakin ingin menghapus program: "${programDeskripsi}"?`)) {
            const { error } = await supabase.from('renstra_program').delete().eq('id', programId);
            if (error) {
                alert("Gagal menghapus: " + error.message);
            } else {
                alert("Program berhasil dihapus.");
                onDataChange(); // Panggil refresh dari komponen induk
            }
        }
    };

    return (
        <div className="bg-white rounded-sm shadow-md">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-green-600 text-white p-3 flex justify-between items-center rounded-t-sm"
            >
                <span className="font-semibold text-left">» Sasaran Perangkat Daerah: {sasaran.deskripsi_sasaran}</span>
                <FaChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="p-4 border-l border-r border-b rounded-b-sm border-gray-200">
                    <div className="overflow-x-auto rounded-md shadow-md">
                        <table className="min-w-full bg-white text-sm">
                            <thead className="">
                                <tr>
                                    <th className="py-2 px-4 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-700">Program</th>
                                    <th className="py-2 px-4 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-700">Anggaran 2025</th>
                                    <th className="py-2 px-4 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-700">Anggaran 2026</th>
                                    <th className="py-2 px-4 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-700">Anggaran 2027</th>
                                    <th className="py-2 px-4 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-700">Anggaran 2028</th>
                                    <th className="py-2 px-4 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-700">Anggaran 2029</th>
                                    <th className="py-2 px-4 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-700">Anggaran Renja</th>
                                    <th className="py-2 px-4 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-700">Sumber Anggaran</th>
                                    <th className="py-2 px-4 border border-gray-300 border-b border-b-black text-center font-semibold text-gray-700">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {sasaran.renstra_program && sasaran.renstra_program.length > 0 ? (
                                    sasaran.renstra_program.map(program => (
                                        <tr key={program.id} className="hover:bg-gray-50">
                                            <td className="py-2 px-4 border border-gray-300 font-medium">{program.deskripsi_program}</td>
                                            <td className="py-2 px-4 border border-gray-300">{formatRupiah(program.anggaran_tahun_1)}</td>
                                            <td className="py-2 px-4 border border-gray-300">{formatRupiah(program.anggaran_tahun_2)}</td>
                                            <td className="py-2 px-4 border border-gray-300">{formatRupiah(program.anggaran_tahun_3)}</td>
                                            <td className="py-2 px-4 border border-gray-300">{formatRupiah(program.anggaran_tahun_4)}</td>
                                            <td className="py-2 px-4 border border-gray-300">{formatRupiah(program.anggaran_tahun_5)}</td>
                                            <td className="py-2 px-4 border border-gray-300">{formatRupiah(program.anggaran_renja)}</td>
                                            <td className="py-2 px-4 border border-gray-300">{program.sumber_anggaran || '-'}</td>
                                            <td className="py-2 px-4 border border-gray-300 text-center">
                                                <div className="flex justify-center space-x-2">
                                                    <Link to={`/renstra/program/edit/${program.id}`} className="text-yellow-500 hover:text-yellow-700"><FaEdit /></Link>
                                                    <button onClick={() => handleDelete(program.id, program.deskripsi_program)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="py-4 px-4 text-center text-gray-500">Belum ada program untuk sasaran ini.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RenstraSasaranProgramAccordion;