// src/components/SasaranAccordion.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaTrash, FaPlus, FaEdit } from 'react-icons/fa';
import { supabase } from '../lib/supabaseClient';

// <-- PERUBAHAN 1: Terima prop onDataChange
function SasaranAccordion({ sasaran, onDataChange }) {
  const [isOpen, setIsOpen] = useState(true);

  // <-- PERUBAHAN 2: Implementasikan fungsi hapus
  const handleDelete = async () => {
    if (window.confirm(`Yakin ingin menghapus sasaran: "${sasaran.deskripsi_sasaran}"? Ini akan menghapus semua data terkait.`)) {
      const { error } = await supabase.from('renstra_sasaran').delete().eq('id', sasaran.id);
      
      if (error) {
        alert("Gagal menghapus: " + error.message);
      } else {
        alert("Sasaran berhasil dihapus.");
        onDataChange(); // Panggil fungsi refresh dari induk untuk update UI
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-4">
      {/* Header Accordion (biru) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-green-600 text-white p-3 flex justify-between items-center rounded-t-sm"
      >
        <span className="font-semibold text-left">Sasaran Perangkat Daerah: {sasaran.deskripsi_sasaran}</span>
        {/* <-- PERUBAHAN 3: Tambahkan tombol Edit dan aktifkan Hapus --> */}
        <div className="flex items-center space-x-2">
            <Link to={`/renstra/sasaran/edit/${sasaran.id}`} className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded inline-flex items-center">
                <FaEdit />
            </Link>
            <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded inline-flex items-center">
                <FaTrash />
            </button>
            <FaChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Konten Accordion (Tabel Indikator) */}
      {isOpen && (
        <div className="p-4 border-l border-r border-b rounded-b-sm border-gray-200">
          <div className="overflow-x-auto shadow-md">
            <table className="min-w-full bg-white border text-sm ">
              <thead className="">
                <tr>
                  <th className="py-2 px-3 border-b border border-gray-200 border-b-black text-left font-semibold text-gray-600">Indikator Sasaran</th>
                  <th className="py-2 px-3 border-b border border-gray-200 border-b-black text-left font-semibold text-gray-600">PK</th>
                  <th className="py-2 px-3 border-b border border-gray-200 border-b-black text-left font-semibold text-gray-600">IKU</th>
                  <th className="py-2 px-3 border-b border border-gray-200 border-b-black text-left font-semibold text-gray-600">Satuan</th>
                  <th className="py-2 px-3 border-b border border-gray-200 border-b-black text-left font-semibold text-gray-600">Target 2025</th>
                </tr>
              </thead>
              <tbody>
                {sasaran.renstra_indikator_sasaran.map(indikator => (
                  <tr key={indikator.id}>
                    <td className="py-2 px-3 border border-gray-200">{indikator.deskripsi_indikator}</td>
                    <td className="py-2 px-3 border border-gray-200">{indikator.pk ? '✓' : '-'}</td>
                    <td className="py-2 px-3 border border-gray-200">{indikator.iku ? '✓' : '-'}</td>
                    <td className="py-2 px-3 border border-gray-200">{indikator.satuan}</td>
                    <td className="py-2 px-3 border border-gray-200">{indikator.target_tahun_5}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* <button className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded inline-flex items-center text-sm">
            <FaPlus className="mr-2" />
            Tambah Indikator
          </button> */}
        </div>
      )}
    </div>
  );
}

export default SasaranAccordion;