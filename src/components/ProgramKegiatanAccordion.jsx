// src/components/ProgramKegiatanAccordion.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaEdit, FaTrash } from 'react-icons/fa';
import { supabase } from '../lib/supabaseClient';

// Fungsi bantuan untuk format mata uang Rupiah
const formatRupiah = (number) => {
  const num = parseFloat(number);
  if (isNaN(num)) return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(0);
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
};

function ProgramKegiatanAccordion({ program, onDataChange }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleDelete = async (kegiatanId, kegiatanDeskripsi) => {
    if (window.confirm(`Yakin ingin menghapus kegiatan: "${kegiatanDeskripsi}"?`)) {
      const { error } = await supabase.from('renstra_kegiatan').delete().eq('id', kegiatanId);
      if (error) {
        alert("Gagal menghapus: " + error.message);
      } else {
        alert("Kegiatan berhasil dihapus.");
        onDataChange(); // Panggil refresh dari komponen induk
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-lg"
      >
        <span className="font-semibold text-left">» Program PD: {program.deskripsi_program}</span>
        <FaChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="p-4 border-l border-r border-b rounded-b-lg border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 border text-left font-semibold text-gray-700">Kegiatan</th>
                  <th className="py-2 px-4 border text-left font-semibold text-gray-700">Anggaran 2025</th>
                  <th className="py-2 px-4 border text-left font-semibold text-gray-700">Anggaran 2026</th>
                  <th className="py-2 px-4 border text-left font-semibold text-gray-700">Anggaran 2027</th>
                  <th className="py-2 px-4 border text-left font-semibold text-gray-700">Anggaran 2028</th>
                  <th className="py-2 px-4 border text-left font-semibold text-gray-700">Anggaran 2029</th>
                  <th className="py-2 px-4 border text-center font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* --- PERBAIKAN DI SINI --- */}
                {/* Tambahkan pengecekan apakah program.renstra_kegiatan ada dan tidak kosong */}
                {program.renstra_kegiatan && program.renstra_kegiatan.length > 0 ? (
                  program.renstra_kegiatan.map(kegiatan => (
                    <tr key={kegiatan.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border font-medium">{kegiatan.deskripsi_kegiatan}</td>
                      <td className="py-2 px-4 border">{formatRupiah(kegiatan.anggaran_tahun_1)}</td>
                      <td className="py-2 px-4 border">{formatRupiah(kegiatan.anggaran_tahun_2)}</td>
                      <td className="py-2 px-4 border">{formatRupiah(kegiatan.anggaran_tahun_3)}</td>
                      <td className="py-2 px-4 border">{formatRupiah(kegiatan.anggaran_tahun_4)}</td>
                      <td className="py-2 px-4 border">{formatRupiah(kegiatan.anggaran_tahun_5)}</td>
                      <td className="py-2 px-4 border text-center">
                        <div className="flex justify-center space-x-2">
                          <Link to={`/renstra/kegiatan/edit/${kegiatan.id}`} className="text-yellow-500 hover:text-yellow-700"><FaEdit /></Link>
                          <button onClick={() => handleDelete(kegiatan.id, kegiatan.deskripsi_kegiatan)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-4 px-4 text-center text-gray-500">Belum ada kegiatan untuk program ini.</td>
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

export default ProgramKegiatanAccordion;