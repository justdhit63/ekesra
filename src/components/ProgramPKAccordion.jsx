// src/components/ProgramPKAccordion.jsx
import { useState } from 'react';
import { FaChevronDown, FaEdit } from 'react-icons/fa';
// Asumsikan KelolaPKProgramModal ada dan berfungsi mirip KelolaPJModal
import KelolaPKProgramModal from './KelolaPKProgramModal';

function ProgramPKAccordion({ program, onDataChange }) {
  const [isOpen, setIsOpen] = useState(true);
  const [modalState, setModalState] = useState({ isOpen: false, indicator: null, year: null });
  const years = [2025, 2026, 2027, 2028, 2029];

  return (
    <>
      <div className="bg-white rounded-sm shadow-md">
        <button onClick={() => setIsOpen(!isOpen)} className="w-full bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-sm">
          <span className="font-semibold text-left">» Program: {program.deskripsi_program}</span>
          <FaChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="p-4 border-l border-r border-b rounded-b-sm border-gray-300 overflow-x-auto">
            {program.sasaran_program && program.sasaran_program.length > 0 ? (
              program.sasaran_program.map(sasaranProg => (
                <div key={sasaranProg.id} className="mb-4">
                  <h4 className="font-bold text-gray-700">{sasaranProg.deskripsi_sasaran_program}</h4>
                  <div className="overflow-x-auto mt-2">
                    <table className="min-w-full bg-white border text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-2 px-3 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-600">Indikator Program</th>
                          {years.map(year => (
                            <th key={year} className="py-2 px-3 border border-gray-300 border-b border-b-black text-center font-semibold text-gray-600">Target PK {year}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sasaranProg.indikator && sasaranProg.indikator.length > 0 ? (
                          sasaranProg.indikator.map(indicator => {
                            // Kelompokkan target berdasarkan tahun
                            const targetsByYear = new Map();
                            indicator.pk_tahunan?.forEach(target => {
                                if (!targetsByYear.has(target.tahun)) targetsByYear.set(target.tahun, []);
                                targetsByYear.get(target.tahun).push({ name: target.full_name, target: target.target_pk });
                            });
                            
                            return (
                              <tr key={indicator.id} className="hover:bg-gray-50">
                                <td className="py-2 px-3 border border-gray-300">{indicator.deskripsi_indikator}</td>
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
                                      onClick={() => setModalState({ isOpen: true, indicator: indicator, year: year })}
                                      className="text-blue-500 hover:text-blue-700 mt-2 text-xs inline-flex items-center font-semibold"
                                    >
                                      <FaEdit size={10} className="mr-1"/> Kelola
                                    </button>
                                  </td>
                                ))}
                              </tr>
                            )
                          })
                        ) : (
                          <tr>
                            <td colSpan={1 + years.length} className="py-3 px-3 text-center text-gray-500">
                              Belum ada indikator untuk sasaran ini.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            ) : (
                <p className="text-center text-gray-500">Belum ada sasaran untuk program ini.</p>
            )}
          </div>
        )}
      </div>
      
      {modalState.isOpen && (
        <KelolaPKProgramModal
          isOpen={modalState.isOpen}
          onClose={() => setModalState({ isOpen: false, indicator: null, year: null })}
          indicator={modalState.indicator}
          year={modalState.year}
          onSave={() => {
            onDataChange(); // Refresh data di parent
            setModalState({ isOpen: false, indicator: null, year: null });
          }}
        />
      )}
    </>
  );
}
export default ProgramPKAccordion;