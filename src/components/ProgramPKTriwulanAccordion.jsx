import { useState } from 'react';
import { FaChevronDown, FaEdit } from 'react-icons/fa';
import KelolaPJProgramTriwulanModal from './KelolaPJProgramTriwulanModal';

function ProgramPKTriwulanAccordion({ program, onDataChange, tahun }) {
  const [isOpen, setIsOpen] = useState(true);
  const [modalState, setModalState] = useState({ isOpen: false, indicator: null, year: null });

  // Asumsi periode 5 tahun, sesuaikan jika perlu
  const years = [2025, 2026, 2027, 2028, 2029];

  return (
    <>
      <div className="bg-white rounded-sm shadow-md">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="w-full bg-purple-600 text-white p-3 flex justify-between items-center rounded-t-sm hover:bg-purple-700 transition-colors"
        >
          <span className="font-semibold text-left">» {program.deskripsi_program}</span>
          <FaChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="p-4 border-l border-r border-b rounded-b-sm border-gray-300 overflow-x-auto">
            <table className="min-w-full bg-white border text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-3 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-600">
                    Indikator Program
                  </th>
                  <th className="py-2 px-3 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-600">
                    Satuan
                  </th>
                  <th className="py-2 px-3 border border-gray-300 border-b border-b-black text-center font-semibold text-gray-600">
                    IKU
                  </th>
                  {years.map(year => (
                    <th key={year} className="py-2 px-3 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-600">
                      Target PK Triwulan {year}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {program.indikator && program.indikator.length > 0 ? (
                  program.indikator.map(indicator => {
                    // Kelompokkan data triwulan berdasarkan tahun
                    const triwulanByYear = new Map();
                    
                    // Pastikan pk_triwulan ada dan berbentuk array
                    if (indicator.pk_triwulan && Array.isArray(indicator.pk_triwulan)) {
                      indicator.pk_triwulan.forEach(tw => {
                        if (!triwulanByYear.has(tw.tahun)) {
                          triwulanByYear.set(tw.tahun, []);
                        }
                        triwulanByYear.get(tw.tahun).push({
                          name: tw.full_name || 'Tidak diketahui',
                          target_tw1: tw.target_tw1 || 0,
                          target_tw2: tw.target_tw2 || 0,
                          target_tw3: tw.target_tw3 || 0,
                          target_tw4: tw.target_tw4 || 0,
                          realisasi_tw1: tw.realisasi_tw1 || 0,
                          realisasi_tw2: tw.realisasi_tw2 || 0,
                          realisasi_tw3: tw.realisasi_tw3 || 0,
                          realisasi_tw4: tw.realisasi_tw4 || 0,
                          satuan: tw.satuan || indicator.satuan || 'Unit'
                        });
                      });
                    }

                    return (
                      <tr key={indicator.id} className="hover:bg-gray-50">
                        <td className="py-2 px-3 border border-gray-300">
                          <div className="font-medium">
                            {indicator.deskripsi_indikator || indicator.nama_indikator || 'Indikator Program'}
                          </div>
                          {indicator.keterangan && (
                            <div className="text-xs text-gray-500 mt-1">
                              {indicator.keterangan}
                            </div>
                          )}
                        </td>
                        <td className="py-2 px-3 border border-gray-300">
                          {indicator.satuan || 'Unit'}
                        </td>
                        <td className="py-2 px-3 border border-gray-300 text-center">
                          {indicator.iku ? (
                            <span className="text-green-600 font-bold">✓</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        {years.map(year => (
                          <td key={year} className="py-2 px-3 border border-gray-300 align-top">
                            {triwulanByYear.has(year) && triwulanByYear.get(year).length > 0 ? (
                              <div className="space-y-2">
                                {triwulanByYear.get(year).map((tw, i) => {
                                  const totalTarget = tw.target_tw1 + tw.target_tw2 + tw.target_tw3 + tw.target_tw4;
                                  const totalRealisasi = tw.realisasi_tw1 + tw.realisasi_tw2 + tw.realisasi_tw3 + tw.realisasi_tw4;
                                  const capaian = totalTarget > 0 ? ((totalRealisasi / totalTarget) * 100).toFixed(1) : 0;

                                  return (
                                    <div key={i} className="text-xs border rounded p-2 bg-purple-50 border-purple-200">
                                      <div className="font-semibold mb-1 text-purple-800">{tw.name}</div>
                                      <div className="grid grid-cols-2 gap-1 mb-2">
                                        <div className="flex justify-between">
                                          <span>TW1:</span>
                                          <span className="font-medium text-purple-600">{tw.target_tw1}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>TW2:</span>
                                          <span className="font-medium text-purple-600">{tw.target_tw2}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>TW3:</span>
                                          <span className="font-medium text-purple-600">{tw.target_tw3}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>TW4:</span>
                                          <span className="font-medium text-purple-600">{tw.target_tw4}</span>
                                        </div>
                                      </div>
                                      
                                      <div className="border-t border-purple-200 pt-1 space-y-1">
                                        <div className="flex justify-between text-gray-700">
                                          <span className="font-medium">Target:</span>
                                          <span className="font-bold">{totalTarget} {tw.satuan}</span>
                                        </div>
                                        <div className="flex justify-between text-purple-600">
                                          <span className="font-medium">Realisasi:</span>
                                          <span className="font-bold">{totalRealisasi} {tw.satuan}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium">Capaian:</span>
                                          <span className={`font-bold ${
                                            capaian >= 100 ? 'text-green-600' : 
                                            capaian >= 80 ? 'text-yellow-600' : 'text-red-600'
                                          }`}>
                                            {capaian}%
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="text-center py-2">
                                <span className="text-gray-400 text-xs block mb-2">- Belum ada data -</span>
                              </div>
                            )}
                            
                            <button 
                              onClick={() => setModalState({ 
                                isOpen: true, 
                                indicator: indicator, 
                                year: year 
                              })} 
                              className="text-purple-500 hover:text-purple-700 hover:bg-purple-100 mt-2 text-xs inline-flex items-center font-semibold px-2 py-1 rounded border border-purple-200 w-full justify-center transition-colors"
                            >
                              <FaEdit size={10} className="mr-1"/> 
                              Kelola Triwulan {year}
                            </button>
                          </td>
                        ))}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={3 + years.length} className="py-8 px-3 text-center">
                      <div className="text-gray-400 mb-2">
                        <svg className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">Belum ada indikator untuk program ini</p>
                      <p className="text-gray-400 text-xs mt-1">
                        Silakan tambahkan indikator program terlebih dahulu
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {modalState.isOpen && (
        <KelolaPJProgramTriwulanModal
          isOpen={modalState.isOpen}
          onClose={() => setModalState({ 
            isOpen: false, 
            indicator: null, 
            year: null 
          })}
          indicator={modalState.indicator}
          year={modalState.year}
          onSave={() => {
            onDataChange(); // Refresh data di parent
            setModalState({ 
              isOpen: false, 
              indicator: null, 
              year: null 
            });
          }}
        />
      )}
    </>
  );
}

export default ProgramPKTriwulanAccordion;