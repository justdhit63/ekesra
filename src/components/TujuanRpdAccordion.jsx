// src/components/TujuanRpdAccordion.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { supabase } from '../lib/supabaseClient';
import KelolaPJTujuanRpdModal from './KelolaPJTujuanRpdModal';

function TujuanRpdAccordion({ tujuan, onDataChange }) {
  const [isOpen, setIsOpen] = useState(true);
  const [modalState, setModalState] = useState({ isOpen: false, indicator: null });

  const handleDelete = async () => {
    if (window.confirm(`Yakin ingin menghapus tujuan: "${tujuan.deskripsi}"?`)) {
      const { error } = await supabase.from('tujuan_rpd').delete().eq('id', tujuan.id);
      if (error) {
        alert("Gagal menghapus: " + error.message);
      } else {
        alert("Tujuan RPD berhasil dihapus.");
        onDataChange();
      }
    }
  };

  const openModal = (indicator) => {
    setModalState({ isOpen: true, indicator: indicator });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, indicator: null });
    onDataChange(); // Refresh data setelah modal ditutup
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md">
        <div className="w-full bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-lg">
          <span className="font-semibold text-left">» {tujuan.deskripsi}</span>
          <div className="flex items-center space-x-2">
              {/* <Link to={`/rpd/tujuan/edit/${tujuan.id}`} className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"><FaEdit /></Link> */}
              <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"><FaTrash /></button>
              <button onClick={() => setIsOpen(!isOpen)} className="p-2">
                <FaChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
          </div>
        </div>

        {isOpen && (
          <div className="p-4 border-l border-r border-b rounded-b-lg">
            <h3 className="font-semibold mb-2">Indikator Tujuan RPD</h3>
            {tujuan.indikator_tujuan_rpd.map(indikator => (
              <div key={indikator.id} className="mb-2 p-3 bg-gray-50 rounded shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <p><strong>Indikator:</strong> {indikator.deskripsi} ({indikator.satuan})</p>
                        <p className="text-sm">
                            <strong>Penanggung Jawab:</strong> 
                            <span className="ml-1 text-gray-600">
                                {indikator.pj_indikator_tujuan_rpd.map(pj => pj.profiles.full_name).join(', ') || 'Belum diatur'}
                            </span>
                        </p>
                    </div>
                    <button onClick={() => openModal(indikator)} className="text-blue-600 hover:text-blue-800 text-xs font-semibold">
                        Kelola PJ
                    </button>
                </div>
              </div>
            ))}
            <Link to={`/rpd/tujuan/${tujuan.id}/tambah-indikator`} className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-flex items-center font-semibold">
                <FaPlus size={12} className="inline mr-1"/> Tambah Indikator
            </Link>
          </div>
        )}
      </div>
      {/* Render Modal */}
      {modalState.isOpen && (
        <KelolaPJTujuanRpdModal 
            isOpen={modalState.isOpen}
            onClose={closeModal}
            onSave={closeModal}
            indicator={modalState.indicator}
        />
      )}
    </>
  );
}
export default TujuanRpdAccordion;