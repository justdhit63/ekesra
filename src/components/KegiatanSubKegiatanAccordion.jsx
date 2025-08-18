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

  const handleDelete = async (subKegiatanId, subKegiatanDeskripsi) => {
    if (window.confirm(`Yakin ingin menghapus: "${subKegiatanDeskripsi}"?`)) {
      const { error } = await supabase.from('renstra_sub_kegiatan').delete().eq('id', subKegiatanId);
      if (error) alert(error.message);
      else {
        alert("Sub Kegiatan berhasil dihapus.");
        onDataChange();
      }
    }
  };

  return (
    <div className="bg-white rounded-sm shadow-md">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full bg-green-600 text-white p-3 flex justify-between items-center rounded-t-sm">
        <span className="font-semibold text-left">» Kegiatan: {kegiatan.deskripsi_kegiatan}</span>
        <FaChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="p-4 border-l border-r border-b rounded-b-sm border-gray-300">
          <div className="overflow-x-auto shadow-md rounded-md">
            <table className="min-w-full bg-white text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-700">Sub Kegiatan</th>
                  <th className="py-2 px-4 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-700">Anggaran 2025</th>
                  <th className="py-2 px-4 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-700">Anggaran 2029</th>
                  <th className="py-2 px-4 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-700">Sumber Anggaran</th>
                  <th className="py-2 px-4 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-700">Anggaran Renja</th>
                  <th className="py-2 px-4 border border-gray-300 border-b border-b-black text-center font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {kegiatan.sub_kegiatan && kegiatan.sub_kegiatan.length > 0 ? (
                  kegiatan.sub_kegiatan.map(sub => (
                    <tr key={sub.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border border-gray-300 font-medium">{sub.deskripsi_sub_kegiatan}</td>
                      <td className="py-2 px-4 border border-gray-300">{formatRupiah(sub.anggaran_tahun_1)}</td>
                      <td className="py-2 px-4 border border-gray-300">{formatRupiah(sub.anggaran_tahun_5)}</td>
                      <td className="py-2 px-4 border border-gray-300">{sub.sumber_anggaran}</td>
                      <td className="py-2 px-4 border border-gray-300">{formatRupiah(sub.anggaran_renja)}</td>
                      <td className="py-2 px-4 border border-gray-300 text-center">
                        <div className="flex justify-center space-x-2">
                          <Link to={`/renstra/sub-kegiatan/edit/${sub.id}`} className="text-yellow-500 hover:text-yellow-700"><FaEdit /></Link>
                          <button onClick={() => handleDelete(sub.id, sub.deskripsi_sub_kegiatan)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-4 px-4 text-center text-gray-500">Belum ada sub kegiatan.</td>
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