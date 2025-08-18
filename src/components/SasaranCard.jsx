// src/components/SasaranCard.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaEdit, FaTrash } from 'react-icons/fa';
import { supabase } from '../lib/supabaseClient';

// <-- BAGIAN YANG DILENGKAPI -->
const IndikatorTable = ({ indikatorList, periodeAwal }) => {
  // Membuat header tahun secara dinamis berdasarkan periode
  const tahun_target = Array.from({ length: 5 }, (_, i) => periodeAwal + i);

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full bg-white text-sm">
        <thead className="">
          <tr>
            <th className="py-2 px-3 border-b-2 border-b-gray-950 border border-gray-200 text-left font-semibold text-gray-600">Indikator Tujuan</th>
            <th className="py-2 px-3 border-b-2 border-b-gray-950 border border-gray-200 text-left font-semibold text-gray-600">Satuan</th>
            <th className="py-2 px-3 border-b-2 border-b-gray-950 border border-gray-200 text-left font-semibold text-gray-600">Kondisi Awal</th>
            {tahun_target.map((tahun, index) => (
              <th key={index} className="py-2 px-3 border-b-2 border-b-gray-950 border border-gray-200 text-left font-semibold text-gray-600">Target {tahun}</th>
            ))}
            <th className="py-2 px-3 border-b-2 border-b-gray-950 border border-gray-200 text-left font-semibold text-gray-600">Kondisi Akhir</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {indikatorList && indikatorList.length > 0 ? (
            indikatorList.map(indikator => (
              <tr key={indikator.id} className="hover:bg-gray-50">
                <td className="py-2 px-3 border border-gray-300">{indikator.deskripsi_indikator}</td>
                <td className="py-2 px-3 border border-gray-300">{indikator.satuan}</td>
                <td className="py-2 px-3 border border-gray-300">{indikator.kondisi_awal}</td>
                <td className="py-2 px-3 border border-gray-300">{indikator.target_tahun_1}</td>
                <td className="py-2 px-3 border border-gray-300">{indikator.target_tahun_2}</td>
                <td className="py-2 px-3 border border-gray-300">{indikator.target_tahun_3}</td>
                <td className="py-2 px-3 border border-gray-300">{indikator.target_tahun_4}</td>
                <td className="py-2 px-3 border border-gray-300">{indikator.target_tahun_5}</td>
                <td className="py-2 px-3 border border-gray-300">{indikator.kondisi_akhir}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="py-3 px-3 text-center text-gray-500">
                Belum ada indikator untuk tujuan ini.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Bagian ini sudah benar dari kode yang Anda berikan
function SasaranCard({ sasaran, onDataChange }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleTujuanDelete = async (tujuanId, tujuanDeskripsi) => {
    if (window.confirm(`Yakin ingin menghapus tujuan: "${tujuanDeskripsi}"? Ini akan menghapus semua indikator di dalamnya.`)) {
        const { error } = await supabase
          .from('renstra_tujuan')
          .delete()
          .eq('id', tujuanId);

        if (error) {
            alert("Gagal menghapus: " + error.message);
        } else {
            alert("Tujuan berhasil dihapus.");
            onDataChange(); // Panggil fungsi refresh dari komponen induk
        }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-green-600 text-white p-3 flex justify-between items-center rounded-t-sm"
      >
        <span className="font-semibold text-left">
          Sasaran: {sasaran.deskripsi_sasaran}
        </span>
        <FaChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="p-4 border-l border-r border-b border-gray-200 rounded-b-sm">
          {sasaran.renstra_tujuan.map(tujuan => (
            <div key={tujuan.id} className="mb-4 border rounded-md border-gray-300 shadow-md">
              <div className="flex justify-between items-center border border-gray-200 bg-gray-50 p-3 rounded-t">
                <p className='font-medium'>
                  <span>Tujuan Strategis:</span> {tujuan.deskripsi_tujuan}
                </p>
                <div className="flex space-x-2">
                  <Link to={`/renstra/tujuan/edit/${tujuan.id}`} className="text-blue-500 hover:text-blue-700 p-1">
                    <FaEdit />
                  </Link>
                  <button onClick={() => handleTujuanDelete(tujuan.id, tujuan.deskripsi_tujuan)} className="text-red-500 hover:text-red-700 p-1">
                    <FaTrash />
                  </button>
                </div>
              </div>
              <IndikatorTable 
                indikatorList={tujuan.renstra_indikator} 
                periodeAwal={sasaran.periode_awal + 1}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SasaranCard;