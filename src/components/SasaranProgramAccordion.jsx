// src/components/sasaranAccordion.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaEdit, FaTrash } from 'react-icons/fa';
import { supabase } from '../lib/supabaseClient';

function SasaranProgramAccordion({ sasaran, onDataChange }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleDelete = async () => {
    if (window.confirm(`Yakin ingin menghapus: "${sasaran.deskripsi_sasaran_program}"?`)) {
      const { error } = await supabase
        .from('renstra_sasaran_program')
        .delete()
        .eq('id', sasaran.id);
      
      if (error) {
        alert("Gagal menghapus: " + error.message);
      } else {
        alert("Sasaran program berhasil dihapus.");
        onDataChange(); // Refresh data di halaman induk
      }
    }
  };

  return (
    <div className="bg-white rounded-sm shadow-md">
      <div className="w-full bg-green-600 text-white p-3 flex justify-between items-center rounded-t-sm">
        <span className="font-semibold text-left">» {sasaran.deskripsi_sasaran_program}</span>
        <div className="flex items-center space-x-2">
            <Link to={`/renstra/program/sasaran/edit/${sasaran.id}`} className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded inline-flex items-center">
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
                  <th className="py-2 px-3 border border-gray-200 border-b border-b-black text-left font-semibold text-gray-600">Indikator Program</th>
                  <th className="py-2 px-3 border border-gray-200 border-b border-b-black text-left font-semibold text-gray-600">Satuan</th>
                  <th className="py-2 px-3 border border-gray-200 border-b border-b-black text-left font-semibold text-gray-600">PK</th>
                  <th className="py-2 px-3 border border-gray-200 border-b border-b-black text-left font-semibold text-gray-600">IR</th>
                  <th className="py-2 px-3 border border-gray-200 border-b border-b-black text-left font-semibold text-gray-600">Target 2025</th>
                  <th className="py-2 px-3 border border-gray-200 border-b border-b-black text-left font-semibold text-gray-600">Target 2026</th>
                  <th className="py-2 px-3 border border-gray-200 border-b border-b-black text-left font-semibold text-gray-600">Target 2027</th>
                  <th className="py-2 px-3 border border-gray-200 border-b border-b-black text-left font-semibold text-gray-600">Target 2028</th>
                  <th className="py-2 px-3 border border-gray-200 border-b border-b-black text-left font-semibold text-gray-600">Target 2029</th>
                </tr>
              </thead>
              <tbody>
                {sasaran.indikator && sasaran.indikator.length > 0 ? (
                    sasaran.indikator.map(indikator => (
                    <tr key={indikator.id}>
                      <td className="py-2 px-3 border border-gray-200">{indikator.deskripsi_indikator}</td>
                      <td className="py-2 px-3 border border-gray-200">{indikator.satuan}</td>
                      <td className="py-2 px-3 border border-gray-200 text-center">{indikator.pk ? '✓' : '-'}</td>
                      <td className="py-2 px-3 border border-gray-200 text-center">{indikator.ir ? '✓' : '-'}</td>
                      <td className="py-2 px-3 border border-gray-200">{indikator.target_tahun_1}</td>
                      <td className="py-2 px-3 border border-gray-200">{indikator.target_tahun_2}</td>
                      <td className="py-2 px-3 border border-gray-200">{indikator.target_tahun_3}</td>
                      <td className="py-2 px-3 border border-gray-200">{indikator.target_tahun_4}</td>
                      <td className="py-2 px-3 border border-gray-200">{indikator.target_tahun_5}</td>
                    </tr>
                  ))
                ) : (
                    <tr>
                        <td colSpan="9" className="py-3 px-3 text-center text-gray-500">Belum ada indikator untuk sasaran program ini.</td>
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

export default SasaranProgramAccordion;