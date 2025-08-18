// src/components/SasaranSubKegiatanAccordion.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { supabase } from '../lib/supabaseClient';

function SasaranSubKegiatanAccordion({ sasaranSubKegiatan, onDataChange }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleDelete = async () => {
    if (window.confirm(`Yakin ingin menghapus: "${sasaranSubKegiatan.deskripsi_sasaran_sub_kegiatan}"?`)) {
      const { error } = await supabase.from('renstra_sasaran_sub_kegiatan').delete().eq('id', sasaranSubKegiatan.id);
      if (error) alert(error.message);
      else {
        alert("Sasaran sub kegiatan berhasil dihapus.");
        onDataChange();
      }
    }
  };

  return (
    <div className="bg-white rounded-sm shadow-md">
      <div className="w-full bg-green-600 text-white p-3 flex justify-between items-center rounded-t-sm">
        <span className="font-semibold text-left">» {sasaranSubKegiatan.deskripsi_sasaran_sub_kegiatan}</span>
        <div className="flex items-center space-x-2">
            <Link to={`/renstra/sub-kegiatan/sasaran/edit/${sasaranSubKegiatan.id}`} className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded inline-flex items-center">
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
        <div className="p-4 border-l border-r border-b rounded-b-sm border-gray-200">
          <div className="overflow-x-auto rounded-md shadow-md">
            <table className="min-w-full bg-white border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-3 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-600">Indikator Sub Kegiatan</th>
                  <th className="py-2 px-3 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-600">Satuan</th>
                  <th className="py-2 px-3 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-600">PK</th>
                  <th className="py-2 px-3 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-600">IKU</th>
                  <th className="py-2 px-3 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-600">Target Renja</th>
                </tr>
              </thead>
              <tbody>
                {sasaranSubKegiatan.indikator && sasaranSubKegiatan.indikator.length > 0 ? (
                    sasaranSubKegiatan.indikator.map(indikator => (
                    <tr key={indikator.id}>
                      <td className="py-2 px-3 border border-gray-300">{indikator.deskripsi_indikator}</td>
                      <td className="py-2 px-3 border border-gray-300">{indikator.satuan}</td>
                      <td className="py-2 px-3 border border-gray-300 text-center">{indikator.pk ? '✓' : '-'}</td>
                      <td className="py-2 px-3 border border-gray-300 text-center">{indikator.iku ? '✓' : '-'}</td>
                      <td className="py-2 px-3 border border-gray-300">{indikator.target_renja}</td>
                    </tr>
                  ))
                ) : (
                    <tr>
                        <td colSpan="5" className="py-3 px-3 text-center text-gray-500">Belum ada indikator.</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
           <Link to={`/renstra/sub-kegiatan/sasaran/${sasaranSubKegiatan.id}/tambah-indikator`} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded inline-flex items-center text-sm">
            <FaPlus className="mr-2" />
            Tambah Target
          </Link>
        </div>
      )}
    </div>
  );
}

export default SasaranSubKegiatanAccordion;