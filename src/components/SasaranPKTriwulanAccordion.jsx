import { useState } from 'react';
import { FaChevronDown, FaEdit } from 'react-icons/fa';
import KelolaPJTriwulanModal from './KelolaPJTriwulanModal';

function SasaranPKTriwulanAccordion({ sasaran, onDataChange }) {
  const [isOpen, setIsOpen] = useState(true);
  const [modalState, setModalState] = useState({ isOpen: false, indicator: null, year: null });

  // Asumsi periode 5 tahun, sesuaikan jika perlu
  const years = [2025, 2026, 2027, 2028, 2029]; 

  return (
    <>
      <div className="bg-white rounded-sm shadow-md">
        <button onClick={() => setIsOpen(!isOpen)} className="w-full bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-sm">
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
                    <th key={year} className="py-2 px-3 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-600">Target PK Triwulan {year}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sasaran.indikator && sasaran.indikator.length > 0 ? (
                  sasaran.indikator.map(indicator => {
                    // Kelompokkan data triwulan berdasarkan tahun
                    const triwulanByYear = new Map();
                    indicator.pk_triwulan?.forEach(tw => {
                        if (!triwulanByYear.has(tw.tahun)) triwulanByYear.set(tw.tahun, []);
                        triwulanByYear.get(tw.tahun).push({
                            name: tw.full_name,
                            target_tw1: tw.target_tw1,
                            target_tw2: tw.target_tw2,
                            target_tw3: tw.target_tw3,
                            target_tw4: tw.target_tw4,
                            realisasi_tw1: tw.realisasi_tw1,
                            realisasi_tw2: tw.realisasi_tw2,
                            realisasi_tw3: tw.realisasi_tw3,
                            realisasi_tw4: tw.realisasi_tw4,
                            satuan: tw.satuan
                        });
                    });

                    return (
                      <tr key={indicator.id} className="hover:bg-gray-50">
                        <td className="py-2 px-3 border border-gray-300">{indicator.deskripsi_indikator}</td>
                        <td className="py-2 px-3 border border-gray-300">{indicator.satuan}</td>
                        <td className="py-2 px-3 border border-gray-300 text-center">{indicator.iku ? '✓' : '-'}</td>
                        {years.map(year => (
                          <td key={year} className="py-2 px-3 border border-gray-300 align-top">
                            {triwulanByYear.has(year) && triwulanByYear.get(year).length > 0 ? (
                              <div className="space-y-2">
                                {triwulanByYear.get(year).map((tw, i) => (
                                  <div key={i} className="text-xs border rounded p-2 bg-gray-50">
                                    <div className="font-semibold mb-1">{tw.name}</div>
                                    <div className="grid grid-cols-2 gap-1">
                                      <div>TW1: <span className="font-medium">{tw.target_tw1}</span></div>
                                      <div>TW2: <span className="font-medium">{tw.target_tw2}</span></div>
                                      <div>TW3: <span className="font-medium">{tw.target_tw3}</span></div>
                                      <div>TW4: <span className="font-medium">{tw.target_tw4}</span></div>
                                    </div>
                                    <div className="mt-1 text-gray-600">
                                      Total: <span className="font-medium">
                                        {(tw.target_tw1 + tw.target_tw2 + tw.target_tw3 + tw.target_tw4) || 0} {tw.satuan}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs">- Belum ada -</span>
                            )}
                            <button 
                              onClick={() => setModalState({ isOpen: true, indicator: indicator, year: year })} 
                              className="text-blue-500 hover:text-blue-700 mt-2 text-xs inline-flex items-center font-semibold"
                            >
                              <FaEdit size={10} className="mr-1"/> Kelola Triwulan
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
        <KelolaPJTriwulanModal
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

export default SasaranPKTriwulanAccordion;