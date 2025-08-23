// src/components/KegiatanPKAccordion.jsx
import { useState } from 'react';
import { FaChevronDown, FaEdit } from 'react-icons/fa';
import KelolaPKKegiatanModal from './KelolaPKKegiatanModal';

function KegiatanPKAccordion({ kegiatan, onDataChange }) {
  const [isOpen, setIsOpen] = useState(true);
  const [modalState, setModalState] = useState({ isOpen: false, indicator: null, year: null });
  const years = [2025, 2026, 2027, 2028, 2029];

  const handleOpenModal = (indicator, year) => {
    setModalState({ isOpen: true, indicator, year });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, indicator: null, year: null });
    onDataChange(); // Refresh data setelah modal ditutup
  };

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
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-2 px-3 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-600">Indikator</th>
                        <th className="py-2 px-3 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-600">Satuan</th>
                        {years.map(year => (
                          <th key={year} className="py-2 px-3 border border-gray-300 border-b border-b-black text-center font-semibold text-gray-600">Target PK {year}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sasaranKeg.indikator.length > 0 ? (
                        sasaranKeg.indikator.map(indicator => {
                          const targetsByYear = new Map();
                          indicator.pk_tahunan?.forEach(target => {
                            if (!targetsByYear.has(target.tahun)) targetsByYear.set(target.tahun, []);
                            targetsByYear.get(target.tahun).push({ name: target.full_name, target: target.target_pk });
                          });

                          return (
                            <tr key={indicator.id} className="hover:bg-gray-50">
                              <td className="py-2 px-3 border border-gray-300">{indicator.deskripsi_indikator}</td>
                              <td className="py-2 px-3 border border-gray-300">{indicator.satuan}</td>
                              {years.map(year => (
                                <td key={year} className="py-2 px-3 border border-gray-300 align-top">
                                  {targetsByYear.has(year) && targetsByYear.get(year).length > 0 ? (
                                    <ul className="list-disc list-inside space-y-1">
                                      {targetsByYear.get(year).map((target, i) =>
                                        <li key={i} className="text-xs">
                                          {target.name}: <span className="font-semibold">{target.target}</span>
                                        </li>
                                      )}
                                    </ul>
                                  ) : (
                                    <span className="text-gray-400 text-xs">- Belum ada -</span>
                                  )}
                                  <button
                                    onClick={() => handleOpenModal(indicator, year)}
                                    className="text-blue-500 hover:text-blue-700 mt-2 text-xs inline-flex items-center font-semibold"
                                  >
                                    <FaEdit size={10} className="mr-1"/> Kelola
                                  </button>
                                </td>
                              ))}
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={2 + years.length} className="py-3 px-3 text-center text-gray-500">
                            Belum ada indikator untuk sasaran kegiatan ini.
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
      {modalState.isOpen && (
        <KelolaPKKegiatanModal
          isOpen={modalState.isOpen}
          onClose={handleCloseModal}
          indicator={modalState.indicator}
          year={modalState.year}
          onSave={handleCloseModal} // Panggil handleCloseModal untuk refresh data
        />
      )}
    </>
  );
}
export default KegiatanPKAccordion;