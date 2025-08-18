// src/components/SasaranPKAccordion.jsx
import { useState } from 'react';
import { FaChevronDown, FaEdit } from 'react-icons/fa';
import KelolaPJModal from './KelolaPJModal';

function SasaranPKAccordion({ sasaran, onDataChange }) {
  const [isOpen, setIsOpen] = useState(true);
  const [modalState, setModalState] = useState({ isOpen: false, indicator: null, year: null });

  // Asumsi periode 5 tahun, sesuaikan jika perlu
  const years = [2025, 2026, 2027, 2028, 2029]; 

  return (
    <>
      <div className="bg-white rounded-sm shadow-md">
        <button onClick={() => setIsOpen(!isOpen)} className="w-full bg-green-600 text-white p-3 flex justify-between items-center rounded-t-sm">
          <span className="font-semibold text-left">» {sasaran.deskripsi_sasaran}</span>
          <FaChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="p-4 border-l border-r border-b rounded-b-sm border-gray-300 overflow-x-auto">
            <table className="min-w-full bg-white border text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-3 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-600">Indikator Sasaran</th>
                  <th className="py-2 px-3 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-600">Satuan</th>
                  <th className="py-2 px-3 border border-gray-300 border-b border-b-black text-center font-semibold text-gray-600">IKU</th>
                  {years.map(year => (
                    <th key={year} className="py-2 px-3 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-600">Target PK {year}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sasaran.indikator && sasaran.indikator.length > 0 ? (
                  sasaran.indikator.map(indicator => {
                    // Kelompokkan penanggung jawab berdasarkan tahun
                    const pjByYear = new Map();
                    indicator.pk_tahunan?.forEach(pj => {
                        if (!pjByYear.has(pj.tahun)) pjByYear.set(pj.tahun, []);
                        // Simpan objek lengkap (nama dan target)
                        pjByYear.get(pj.tahun).push({ name: pj.full_name, target: pj.target_pk });
                    });

                    return (
                      <tr key={indicator.id} className="hover:bg-gray-50">
                        <td className="py-2 px-3 border border-gray-300">{indicator.deskripsi_indikator}</td>
                        <td className="py-2 px-3 border border-gray-300">{indicator.satuan}</td>
                        <td className="py-2 px-3 border border-gray-300 text-center">{indicator.iku ? '✓' : '-'}</td>
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
                    <td colSpan={3 + years.length} className="py-3 px-3 text-center text-gray-500">
                      Belum ada indikator untuk sasaran ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {modalState.isOpen && (
        <KelolaPJModal
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

export default SasaranPKAccordion;