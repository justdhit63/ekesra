// src/components/SasaranKegiatanAccordion.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { supabase } from '../lib/supabaseClient';

function SasaranKegiatanAccordion({ sasaranKegiatan, onDataChange }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleDelete = async () => {
    if (window.confirm(`Yakin ingin menghapus: "${sasaranKegiatan.deskripsi_sasaran_kegiatan}"?`)) {
      const { error } = await supabase.from('renstra_sasaran_kegiatan').delete().eq('id', sasaranKegiatan.id);
      if (error) {
        alert("Gagal menghapus: " + error.message);
      } else {
        alert("Sasaran kegiatan berhasil dihapus.");
        onDataChange();
      }
    }
  };

  return (
    <div className="bg-white rounded-sm shadow-md">
      <div className="w-full bg-green-600 text-white p-3 flex justify-between items-center rounded-t-sm">
        <span className="font-semibold text-left">» {sasaranKegiatan.deskripsi_sasaran_kegiatan}</span>
        <div className="flex items-center space-x-2">
            <Link to={`/renstra/kegiatan/sasaran/edit/${sasaranKegiatan.id}`} className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded inline-flex items-center">
                <FaEdit />
            </Link>
            <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded inline-flex items-center">
                <FaTrash />
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
                <FaChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 border-l border-r border-b rounded-b-sm border-gray-300">
          <div className="overflow-x-auto rounded-md shadow-md">
            <table className="min-w-full bg-white border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {/* <-- 1. TAMBAHKAN HEADER KOLOM BARU --> */}
                  <th className="py-2 px-3 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-600">Indikator Kegiatan</th>
                  <th className="py-2 px-3 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-600">Satuan</th>
                  <th className="py-2 px-3 border border-gray-300 border-b border-b-black text-center font-semibold text-gray-600">PK</th>
                  <th className="py-2 px-3 border border-gray-300 border-b border-b-black text-center font-semibold text-gray-600">IKU</th>
                  <th className="py-2 px-3 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-600">Kondisi Awal</th>
                  <th className="py-2 px-3 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-600">Target 2025</th>
                  <th className="py-2 px-3 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-600">Target 2026</th>
                  <th className="py-2 px-3 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-600">Target 2027</th>
                  <th className="py-2 px-3 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-600">Target 2028</th>
                  <th className="py-2 px-3 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-600">Target 2029</th>
                  <th className="py-2 px-3 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-600">Kondisi Akhir</th>
                  <th className="py-2 px-3 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-600">Target Renja</th>
                </tr>
              </thead>
              <tbody>
                {sasaranKegiatan.indikator && sasaranKegiatan.indikator.length > 0 ? (
                    sasaranKegiatan.indikator.map(indikator => (
                    <tr key={indikator.id}>
                      {/* <-- 2. TAMBAHKAN KOLOM DATA BARU --> */}
                      <td className="py-2 px-3 border border-gray-300">{indikator.deskripsi_indikator}</td>
                      <td className="py-2 px-3 border border-gray-300">{indikator.satuan}</td>
                      <td className="py-2 px-3 border border-gray-300 text-center">{indikator.pk ? '✓' : '-'}</td>
                      <td className="py-2 px-3 border border-gray-300 text-center">{indikator.iku ? '✓' : '-'}</td>
                      <td className="py-2 px-3 border border-gray-300">{indikator.kondisi_awal}</td>
                      <td className="py-2 px-3 border border-gray-300">{indikator.target_tahun_1}</td>
                      <td className="py-2 px-3 border border-gray-300">{indikator.target_tahun_2}</td>
                      <td className="py-2 px-3 border border-gray-300">{indikator.target_tahun_3}</td>
                      <td className="py-2 px-3 border border-gray-300">{indikator.target_tahun_4}</td>
                      <td className="py-2 px-3 border border-gray-300">{indikator.target_tahun_5}</td>
                      <td className="py-2 px-3 border border-gray-300">{indikator.kondisi_akhir}</td>
                      <td className="py-2 px-3 border border-gray-300">{indikator.target_renja}</td>
                    </tr>
                  ))
                ) : (
                    <tr>
                        {/* <-- 3. SESUAIKAN COLSPAN --> */}
                        <td colSpan="12" className="py-3 px-3 text-center text-gray-500">Belum ada indikator.</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
           <Link to={`/renstra/kegiatan/sasaran/${sasaranKegiatan.id}/tambah-indikator`} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded inline-flex items-center text-sm">
            <FaPlus className="mr-2" />
            Tambah Indikator
          </Link>
        </div>
      )}
    </div>
  );
}

export default SasaranKegiatanAccordion;