// src/components/KegiatanSubKegiatanAccordion.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaEdit, FaTrash } from 'react-icons/fa';
import { supabase } from '../lib/supabaseClient';

const formatRupiah = (number) => {
  const num = parseFloat(number);
  if (isNaN(num)) return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(0);
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
};

function KegiatanSubKegiatanAccordion({ kegiatan, onDataChange }) {
  const [isOpen, setIsOpen] = useState(true);

  // Fungsi untuk menghapus SUB kegiatan (anak)
  const handleDeleteSubKegiatan = async (subKegiatanId, subKegiatanDeskripsi) => {
    if (window.confirm(`Yakin ingin menghapus sub kegiatan: "${subKegiatanDeskripsi}"?`)) {
      const { error } = await supabase.from('renstra_sub_kegiatan').delete().eq('id', subKegiatanId);
      if (error) {
        alert("Gagal menghapus: " + error.message);
      } else {
        alert("Sub Kegiatan berhasil dihapus.");
        onDataChange();
      }
    }
  };

  // Fungsi untuk menghapus KEGIATAN (induk)
  const handleKegiatanDelete = async () => {
    if (window.confirm(`Yakin ingin menghapus kegiatan: "${kegiatan.deskripsi_kegiatan}"? Ini akan menghapus semua sub kegiatan di dalamnya.`)) {
      const { error } = await supabase.from('renstra_kegiatan').delete().eq('id', kegiatan.id);
      if (error) {
        alert("Gagal menghapus: " + error.message);
      } else {
        alert("Kegiatan berhasil dihapus.");
        onDataChange();
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="w-full bg-green-800 text-white p-3 flex justify-between items-center rounded-t-lg">
        <span className="font-semibold text-left">» Kegiatan: {kegiatan.deskripsi_kegiatan}</span>
        {/* -- TOMBOL AKSI UNTUK KEGIATAN -- */}
        <div className="flex items-center space-x-2">
            <Link to={`/renstra/kegiatan/edit/${kegiatan.id}`} className="p-1 hover:bg-green-700 rounded"><FaEdit /></Link>
            <button onClick={handleKegiatanDelete} className="p-1 hover:bg-green-700 rounded"><FaTrash /></button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-1">
                <FaChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 border-l border-r border-b rounded-b-lg border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 border text-left font-semibold text-gray-700">Sub Kegiatan</th>
                  {/* -- MENAMPILKAN SEMUA TAHUN ANGGARAN -- */}
                  <th className="py-2 px-4 border text-left font-semibold text-gray-700">Anggaran 2025</th>
                  <th className="py-2 px-4 border text-left font-semibold text-gray-700">Anggaran 2026</th>
                  <th className="py-2 px-4 border text-left font-semibold text-gray-700">Anggaran 2027</th>
                  <th className="py-2 px-4 border text-left font-semibold text-gray-700">Anggaran 2028</th>
                  <th className="py-2 px-4 border text-left font-semibold text-gray-700">Anggaran 2029</th>
                  <th className="py-2 px-4 border text-left font-semibold text-gray-700">Sumber Anggaran</th>
                  <th className="py-2 px-4 border text-center font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {kegiatan.sub_kegiatan && kegiatan.sub_kegiatan.length > 0 ? (
                  kegiatan.sub_kegiatan.map(sub => (
                    <tr key={sub.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border font-medium">{sub.deskripsi_sub_kegiatan}</td>
                      <td className="py-2 px-4 border">{formatRupiah(sub.anggaran_tahun_1)}</td>
                      <td className="py-2 px-4 border">{formatRupiah(sub.anggaran_tahun_2)}</td>
                      <td className="py-2 px-4 border">{formatRupiah(sub.anggaran_tahun_3)}</td>
                      <td className="py-2 px-4 border">{formatRupiah(sub.anggaran_tahun_4)}</td>
                      <td className="py-2 px-4 border">{formatRupiah(sub.anggaran_tahun_5)}</td>
                      <td className="py-2 px-4 border">{sub.sumber_anggaran}</td>
                      <td className="py-2 px-4 border text-center">
                        <div className="flex justify-center space-x-2">
                          <Link to={`/renstra/sub-kegiatan/edit/${sub.id}`} className="text-yellow-500 hover:text-yellow-700"><FaEdit /></Link>
                          <button onClick={() => handleDeleteSubKegiatan(sub.id, sub.deskripsi_sub_kegiatan)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-4 px-4 text-center text-gray-500">Belum ada sub kegiatan untuk kegiatan ini.</td>
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

export default KegiatanSubKegiatanAccordion;