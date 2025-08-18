// src/components/KegiatanPKAccordion.jsx
import { useState } from 'react';
import { FaChevronDown, FaEdit } from 'react-icons/fa';
import KelolaPKKegiatanModal from './KelolaPKKegiatanModal';

function KegiatanPKAccordion({ kegiatan, onDataChange }) {
  const [isOpen, setIsOpen] = useState(true);
  const [modalState, setModalState] = useState({ isOpen: false, indicator: null, year: null });
  const years = [2025, 2026, 2027, 2028, 2029];

  return (
    <>
      <div className="bg-white rounded-sm shadow-md">
        <button onClick={() => setIsOpen(!isOpen)} className="w-full bg-green-600 text-white p-3 flex justify-between items-center rounded-t-sm">
          <span className="font-semibold text-left">» Kegiatan: {kegiatan.deskripsi_kegiatan}</span>
          <FaChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="p-4 border-l border-r border-b rounded-b-sm border-gray-300">
            {kegiatan.sasaran_kegiatan.map(sasaranKeg => (
              <div key={sasaranKeg.id} className="mb-4">
                <h4 className="font-bold text-gray-700">{sasaranKeg.deskripsi_sasaran_kegiatan}</h4>
                <div className="overflow-x-auto mt-2">
                  <table className="min-w-full bg-white border text-sm">
                    {/* Header Tabel */}
                    <thead>
                      <tr>
                        <th className="py-2 px-3 border border-gray-300 border-b border-b-black text-left">Indikator</th>
                        <th className="py-2 px-3 border border-gray-300 border-b border-b-black text-left">Satuan</th>
                        {years.map(year => <th key={year} className="py-2 px-3 border border-gray-300 border-b border-b-black text-left">Target PK {year}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {sasaranKeg.indikator.map(indicator => {
                        const pjByYear = new Map();
                        indicator.pk_tahunan?.forEach(pj => {
                          if (!pjByYear.has(pj.tahun)) pjByYear.set(pj.tahun, []);
                          pjByYear.get(pj.tahun).push({ name: pj.full_name, target: pj.target_pk });
                        });
                        return (
                          <tr key={indicator.id}>
                            <td className="p-2 border border-gray-300">{indicator.deskripsi_indikator}</td>
                            <td className="p-2 border border-gray-300">{indicator.satuan}</td>
                            {years.map(year => (
                              <td key={year} className="p-2 border border-gray-300 align-top">
                                {/* Tampilan Target & Tombol Kelola */}
                                <button onClick={() => setModalState({ isOpen: true, indicator: indicator, year: year })} className="text-blue-500 mt-2 text-xs">
                                  <FaEdit size={10} className="mr-1"/> Kelola
                                </button>
                              </td>
                            ))}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {modalState.isOpen && (
        <KelolaPKKegiatanModal
          isOpen={modalState.isOpen}
          onClose={() => setModalState({ isOpen: false, indicator: null, year: null })}
          indicator={modalState.indicator}
          year={modalState.year}
          onSave={() => {
            onDataChange();
            setModalState({ isOpen: false, indicator: null, year: null });
          }}
        />
      )}
    </>
  );
}
export default KegiatanPKAccordion;