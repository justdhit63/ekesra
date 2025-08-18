// src/components/ProgramPKAccordion.jsx
import { useState } from 'react';
import { FaChevronDown, FaEdit } from 'react-icons/fa';
import KelolaPKProgramModal from './KelolaPKProgramModal';

function ProgramPKAccordion({ program, onDataChange }) {
  const [isOpen, setIsOpen] = useState(true);
  const [modalState, setModalState] = useState({ isOpen: false, indicator: null, year: null });

  const years = [2025, 2026, 2027, 2028, 2029];

  return (
    <>
      <div className="bg-white rounded-sm shadow-md">
        <button onClick={() => setIsOpen(!isOpen)} className="w-full bg-green-600 text-white p-3 flex justify-between items-center rounded-t-sm">
          <span className="font-semibold text-left">» Program: {program.deskripsi_program}</span>
          <FaChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="p-4 border-l border-r border-b border-gray-300 rounded-b-sm">
            {program.sasaran_program.map(sasaranProg => (
              <div key={sasaranProg.id} className="mb-4">
                <h4 className="font-bold text-gray-700">Deskripsi Sasaran Program: {sasaranProg.deskripsi_sasaran_program}</h4>
                <div className="overflow-x-auto mt-2">
                  <table className="min-w-full bg-white border text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-2 px-3 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-600">Indikator</th>
                        <th className="py-2 px-3 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-600">Satuan</th>
                        {years.map(year => (
                          <th key={year} className="py-2 px-3 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-600">Target PK {year}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sasaranProg.indikator.map(indicator => {
                        const pjByYear = new Map();
                        indicator.pk_tahunan?.forEach(pj => {
                          if (!pjByYear.has(pj.tahun)) pjByYear.set(pj.tahun, []);
                          pjByYear.get(pj.tahun).push({ name: pj.full_name, target: pj.target_pk });
                        });
                        return (
                          <tr key={indicator.id} className="hover:bg-gray-50">
                            <td className="py-2 px-3 border border-gray-300 w-1/4">{indicator.deskripsi_indikator}</td>
                            <td className="py-2 px-3 border border-gray-300">{indicator.satuan}</td>
                            {years.map(year => (
                              <td key={year} className="py-2 px-3 border border-gray-300 align-top">
                                {pjByYear.has(year) && pjByYear.get(year).length > 0 ? (
                                  <ul className="list-disc list-inside space-y-1">
                                    {pjByYear.get(year).map((pj, i) => 
                                      <li key={i} className="text-xs">
                                        {pj.name}: <span className="font-semibold">{pj.target}</span>
                                      </li>
                                    )}
                                  </ul>
                                ) : (
                                  <span className="text-gray-400 text-xs">- Belum ada -</span>
                                )}
                                <button onClick={() => setModalState({ isOpen: true, indicator: indicator, year: year })} className="text-blue-500 hover:text-blue-700 mt-2 text-xs inline-flex items-center font-semibold">
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
        <KelolaPKProgramModal
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

export default ProgramPKAccordion;