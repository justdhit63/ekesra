// src/components/TujuanCard.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaEdit, FaTrash } from 'react-icons/fa';
import { supabase } from '../lib/supabaseClient';

function TujuanCard({ tujuan, onDataChange }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleTujuanDelete = async () => {
    if (window.confirm(`Yakin ingin menghapus tujuan: "${tujuan.deskripsi_tujuan}"?`)) {
        const { error } = await supabase.from('renstra_tujuan').delete().eq('id', tujuan.id);
        if (error) {
            alert("Gagal menghapus: " + error.message);
        } else {
            alert("Tujuan berhasil dihapus.");
            onDataChange();
        }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-4">
      <div className="w-full bg-green-800 text-white p-3 flex justify-between items-center rounded-t-md">
        <span className="font-semibold text-left">
          Tujuan: {tujuan.deskripsi_tujuan}
        </span>
        <div className="flex items-center space-x-2">
            <Link to={`/renstra/tujuan/edit/${tujuan.id}`} className="p-1 hover:bg-green-700 rounded"><FaEdit /></Link>
            <button onClick={handleTujuanDelete} className="p-1 hover:bg-green-700 rounded"><FaTrash /></button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-1">
                <FaChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 border-l border-r border-b rounded-b-md">
          {tujuan.renstra_sasaran.map(sasaran => (
            <div key={sasaran.id} className="mb-2 p-3 bg-gray-50 rounded shadow-sm">
              <p><strong>Sasaran:</strong> {sasaran.deskripsi_sasaran}</p>
              
              {/* <-- BAGIAN YANG DILENGKAPI: Tabel Indikator Sasaran --> */}
              <div className="overflow-x-auto mt-2">
                <table className="min-w-full bg-white text-xs">
                  <thead className="bg-green-100">
                    <tr>
                      <th className="py-1 px-2 border text-left font-semibold text-green-800">Indikator Sasaran</th>
                      <th className="py-1 px-2 border text-left font-semibold text-green-800">Satuan</th>
                      <th className="py-1 px-2 border text-center font-semibold text-green-800">IKU</th>
                      <th className="py-1 px-2 border text-left font-semibold text-green-800">Target 2025</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sasaran.renstra_indikator_sasaran && sasaran.renstra_indikator_sasaran.length > 0 ? (
                      sasaran.renstra_indikator_sasaran.map(indikator => (
                        <tr key={indikator.id}>
                          <td className="py-1 px-2 border">{indikator.deskripsi_indikator}</td>
                          <td className="py-1 px-2 border">{indikator.satuan}</td>
                          <td className="py-1 px-2 border text-center">{indikator.iku ? '✓' : '-'}</td>
                          <td className="py-1 px-2 border">{indikator.target_tahun_1}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-2 px-2 text-center text-gray-400">
                          Belum ada indikator untuk sasaran ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TujuanCard;