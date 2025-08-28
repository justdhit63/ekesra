import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function LaporanRenstraPage() {
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [selectedDaerahId, setSelectedDaerahId] = useState('all');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPerangkatDaerah = async () => {
      try {
        const { data, error } = await supabase.from('perangkat_daerah').select('id, nama_daerah');
        if (error) throw error;
        setPerangkatDaerahList(data || []);
      } catch (error) {
        console.error("Gagal mengambil data perangkat daerah:", error);
      }
    };
    fetchPerangkatDaerah();
  }, []);

  // Fetch kebijakan data berdasarkan renstra_sasaran_id
  const fetchKebijakanBySasaranId = async (sasaranId) => {
    try {
      const { data, error } = await supabase
        .from('renstra_program')
        .select('id, deskripsi_program')
        .eq('sasaran_id', sasaranId)
        .limit(1);

      if (error) throw error;
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Error fetching kebijakan:', error);
      return null;
    }
  };

  // // Fetch RPD data berdasarkan perangkat_daerah_id
  // const fetchRpdDataByPdId = async () => {
  //   try {
  //     const { data, error } = await supabase
  //       .from('tujuan_rpd')
  //       .select(`
  //         id,
  //         deskripsi,
  //         sasaran_rpd (
  //           id,
  //           deskripsi
  //         )
  //       `);

  //     if (error) throw error;
  //     return data || [];
  //   } catch (error) {
  //     console.error('Error fetching RPD data:', error);
  //     return [];
  //   }
  // };

  // Ganti function fetchCompleteReportData dengan yang ini
  const fetchCompleteReportData = async (pdId) => {
    try {
      // Query untuk mengambil semua level data sekaligus
      const { data, error } = await supabase
        .from('renstra_tujuan')
        .select(`
        id,
        deskripsi_tujuan,
        perangkat_daerah_id,
        renstra_indikator (
          id,
          deskripsi_indikator,
          satuan,
          kondisi_awal,
          target_tahun_1,
          target_tahun_2,
          target_tahun_3,
          target_tahun_4,
          target_tahun_5,
          kondisi_akhir
        ),
        renstra_sasaran (
          id,
          deskripsi_sasaran,
          renstra_indikator_sasaran (
            id,
            deskripsi_indikator,
            satuan,
            pk,
            iku,
            kondisi_awal,
            target_tahun_1,
            target_tahun_2,
            target_tahun_3,
            target_tahun_4,
            target_tahun_5,
            kondisi_akhir
          ),
          renstra_program (
            id,
            deskripsi_program,
            renstra_sasaran_program(
              id,
              deskripsi_sasaran_program,
              renstra_indikator_sasaran_program (
                id,
                deskripsi_indikator,
                satuan,
                pk,
                ir,
                target_tahun_1,
                target_tahun_2,
                target_tahun_3,
                target_tahun_4,
                target_tahun_5
              )
            ),
            renstra_kegiatan (
              id,
              deskripsi_kegiatan,
              renstra_sasaran_kegiatan (
                id,
                deskripsi_sasaran_kegiatan,
                renstra_indikator_kegiatan (
                  id,
                  deskripsi_indikator,
                  satuan,
                  pk,
                  iku,
                  kondisi_awal,
                  target_tahun_1,
                  target_tahun_2,
                  target_tahun_3,
                  target_tahun_4,
                  target_tahun_5,
                  kondisi_akhir,
                  target_renja
                )
              ),
              renstra_sub_kegiatan (
                id,
                deskripsi_sub_kegiatan,
                renstra_sasaran_sub_kegiatan (
                  id,
                  deskripsi_sasaran_sub_kegiatan,
                  renstra_indikator_sub_kegiatan (
                    id,
                    deskripsi_indikator,
                    satuan,
                    pk,
                    iku,
                    kondisi_awal,
                    target_tahun_1,
                    target_tahun_2,
                    target_tahun_3,
                    target_tahun_4,
                    target_tahun_5,
                    kondisi_akhir,
                    target_renja
                  )
                )
              )
            )
          )
        )
      `)
        .eq('perangkat_daerah_id', pdId);

      if (error) throw error;

      // Transform data menjadi struktur yang flat untuk semua level indikator
      const allIndicators = [];

      (data || []).forEach(tujuan => {
        // 1. Indikator dari Renstra Tujuan
        if (tujuan.renstra_indikator && tujuan.renstra_indikator.length > 0) {
          tujuan.renstra_indikator.forEach(indikator => {
            allIndicators.push({
              level: 'Tujuan',
              perangkat_daerah_id: pdId,
              renstra_tujuan: tujuan.deskripsi_tujuan,
              renstra_sasaran: '-',
              renstra_program: '-',
              renstra_kegiatan: '-',
              sasaran_kegiatan: '-',
              renstra_sub_kegiatan: '-',
              sasaran_sub_kegiatan: '-',
              indikator: indikator
            });
          });
        }

        // 2. Indikator dari Renstra Sasaran
        if (tujuan.renstra_sasaran) {
          tujuan.renstra_sasaran.forEach(sasaran => {
            if (sasaran.renstra_indikator_sasaran && sasaran.renstra_indikator_sasaran.length > 0) {
              sasaran.renstra_indikator_sasaran.forEach(indikator => {
                allIndicators.push({
                  level: 'Sasaran',
                  perangkat_daerah_id: pdId,
                  renstra_tujuan: tujuan.deskripsi_tujuan,
                  renstra_sasaran: sasaran.deskripsi_sasaran,
                  renstra_program: '-',
                  renstra_kegiatan: '-',
                  sasaran_kegiatan: '-',
                  renstra_sub_kegiatan: '-',
                  sasaran_sub_kegiatan: '-',
                  indikator: indikator
                });
              });
            }

            // 3. Indikator dari Renstra Program (Perbaiki nama tabel)
            if (sasaran.renstra_program) {
              sasaran.renstra_program.forEach(program => {
                if (program.renstra_sasaran_program && program.renstra_sasaran_program.length > 0) {
                  program.renstra_sasaran_program.forEach(indikator => {
                    allIndicators.push({
                      level: 'Program',
                      perangkat_daerah_id: pdId,
                      renstra_tujuan: tujuan.deskripsi_tujuan,
                      renstra_sasaran: sasaran.deskripsi_sasaran,
                      renstra_program: program.deskripsi_program,
                      renstra_kegiatan: '-',
                      sasaran_kegiatan: '-',
                      renstra_sub_kegiatan: '-',
                      sasaran_sub_kegiatan: '-',
                      indikator: {
                        ...indikator,
                        kondisi_awal: '-',
                        kondisi_akhir: '-'
                      }
                    });
                  });
                }

                // 4. Indikator dari Renstra Kegiatan
                if (program.renstra_kegiatan) {
                  program.renstra_kegiatan.forEach(kegiatan => {
                    if (kegiatan.renstra_sasaran_kegiatan) {
                      kegiatan.renstra_sasaran_kegiatan.forEach(sasaranKegiatan => {
                        if (sasaranKegiatan.renstra_indikator_kegiatan && sasaranKegiatan.renstra_indikator_kegiatan.length > 0) {
                          sasaranKegiatan.renstra_indikator_kegiatan.forEach(indikator => {
                            allIndicators.push({
                              level: 'Kegiatan',
                              perangkat_daerah_id: pdId,
                              renstra_tujuan: tujuan.deskripsi_tujuan,
                              renstra_sasaran: sasaran.deskripsi_sasaran,
                              renstra_program: program.deskripsi_program,
                              renstra_kegiatan: kegiatan.deskripsi_kegiatan,
                              sasaran_kegiatan: sasaranKegiatan.deskripsi_sasaran_kegiatan,
                              renstra_sub_kegiatan: '-',
                              sasaran_sub_kegiatan: '-',
                              indikator: indikator
                            });
                          });
                        }
                      });
                    }

                    // 5. Indikator dari Renstra Sub Kegiatan
                    if (kegiatan.renstra_sub_kegiatan) {
                      kegiatan.renstra_sub_kegiatan.forEach(subKegiatan => {
                        if (subKegiatan.renstra_sasaran_sub_kegiatan) {
                          subKegiatan.renstra_sasaran_sub_kegiatan.forEach(sasaranSubKegiatan => {
                            if (sasaranSubKegiatan.renstra_indikator_sub_kegiatan && sasaranSubKegiatan.renstra_indikator_sub_kegiatan.length > 0) {
                              sasaranSubKegiatan.renstra_indikator_sub_kegiatan.forEach(indikator => {
                                allIndicators.push({
                                  level: 'Sub Kegiatan',
                                  perangkat_daerah_id: pdId,
                                  renstra_tujuan: tujuan.deskripsi_tujuan,
                                  renstra_sasaran: sasaran.deskripsi_sasaran,
                                  renstra_program: program.deskripsi_program,
                                  renstra_kegiatan: kegiatan.deskripsi_kegiatan,
                                  sasaran_kegiatan: '-',
                                  renstra_sub_kegiatan: subKegiatan.deskripsi_sub_kegiatan,
                                  sasaran_sub_kegiatan: sasaranSubKegiatan.deskripsi_sasaran_sub_kegiatan,
                                  indikator: indikator
                                });
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });

      return allIndicators;
    } catch (error) {
      console.error('Error fetching complete report data:', error);
      return [];
    }
  };

  const fetchReportData = async () => {
    setLoading(true);

    try {
      if (selectedDaerahId === 'all') {
        // Ambil data dari semua perangkat daerah
        const allData = [];

        for (const pd of perangkatDaerahList) {
          const data = await fetchCompleteReportData(pd.id);
          allData.push(...data.map(item => ({
            ...item,
            nama_perangkat_daerah: pd.nama_daerah
          })));
        }

        setReportData(allData);
      } else {
        // Ambil data untuk perangkat daerah tertentu
        const data = await fetchCompleteReportData(selectedDaerahId);
        const selectedPd = perangkatDaerahList.find(pd => pd.id === selectedDaerahId);
        setReportData(data.map(item => ({
          ...item,
          nama_perangkat_daerah: selectedPd?.nama_daerah || '-'
        })));
      }
    } catch (error) {
      console.error("Gagal mengambil data laporan:", error);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (perangkatDaerahList.length > 0) {
      fetchReportData();
    }
  }, [selectedDaerahId, perangkatDaerahList]);

  // Flatten data dengan struktur hierarki yang benar
  const flattenedData = reportData.map((item, index) => ({
    no: index + 1,
    level: item.level,
    nama_perangkat_daerah: item.nama_perangkat_daerah || '-',
    renstra_tujuan: item.renstra_tujuan || '-',
    renstra_sasaran: item.renstra_sasaran || '-',
    renstra_program: item.renstra_program || '-',
    renstra_kegiatan: item.renstra_kegiatan || '-',
    sasaran_kegiatan: item.sasaran_kegiatan || '-',
    renstra_sub_kegiatan: item.renstra_sub_kegiatan || '-',
    sasaran_sub_kegiatan: item.sasaran_sub_kegiatan || '-',
    deskripsi_indikator: item.indikator?.deskripsi_indikator || '-',
    satuan: item.indikator?.satuan || '-',
    pk: item.indikator?.pk || false,
    iku: item.indikator?.iku || false,
    kondisi_awal: item.indikator?.kondisi_awal || '-',
    target_tahun_1: item.indikator?.target_tahun_1 || '-',
    target_tahun_2: item.indikator?.target_tahun_2 || '-',
    target_tahun_3: item.indikator?.target_tahun_3 || '-',
    target_tahun_4: item.indikator?.target_tahun_4 || '-',
    target_tahun_5: item.indikator?.target_tahun_5 || '-',
    kondisi_akhir: item.indikator?.kondisi_akhir || '-',
    target_renja: item.indikator?.target_renja || '-'
  }));

  // Export to Excel function
  // Update bagian exportToExcel untuk menyesuaikan dengan data yang benar
  const exportToExcel = () => {
    if (flattenedData.length === 0) {
      alert('Tidak ada data untuk diekspor');
      return;
    }

    // Prepare data for Excel
    const excelData = flattenedData.map((item, index) => ({
      'No': item.no,
      'Level': item.level,
      'Perangkat Daerah': item.nama_perangkat_daerah,
      'Renstra Tujuan': item.renstra_tujuan,
      'Renstra Sasaran': item.renstra_sasaran,
      'Renstra Program': item.renstra_program,
      'Renstra Kegiatan': item.renstra_kegiatan,
      'Sasaran Kegiatan': item.sasaran_kegiatan,
      'Renstra Sub Kegiatan': item.renstra_sub_kegiatan,
      'Sasaran Sub Kegiatan': item.sasaran_sub_kegiatan,
      'Indikator': item.deskripsi_indikator,
      'Satuan': item.satuan,
      'PK': item.pk ? 'Ya' : 'Tidak',
      'IKU': item.iku ? 'Ya' : 'Tidak',
      'Kondisi Awal': item.kondisi_awal,
      '2025': item.target_tahun_1,
      '2026': item.target_tahun_2,
      '2027': item.target_tahun_3,
      '2028': item.target_tahun_4,
      '2029': item.target_tahun_5,
      'Kondisi Akhir': item.kondisi_akhir,
      'Target Renja': item.target_renja,
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths - update untuk kolom tambahan
    const colWidths = [
      { wch: 5 },   // No
      { wch: 15 },  // Level
      { wch: 25 },  // Perangkat Daerah
      { wch: 30 },  // Renstra Tujuan
      { wch: 30 },  // Renstra Sasaran
      { wch: 30 },  // Renstra Program
      { wch: 30 },  // Renstra Kegiatan
      { wch: 25 },  // Sasaran Kegiatan
      { wch: 30 },  // Renstra Sub Kegiatan
      { wch: 30 },  // Sasaran Sub Kegiatan
      { wch: 40 },  // Indikator
      { wch: 15 },  // Satuan
      { wch: 8 },   // PK
      { wch: 8 },   // IKU
      { wch: 15 },  // Kondisi Awal
      { wch: 10 },  // 2025
      { wch: 10 },  // 2026
      { wch: 10 },  // 2027
      { wch: 10 },  // 2028
      { wch: 10 },  // 2029
      { wch: 15 },  // Kondisi Akhir
      { wch: 15 },  // Target Renja
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Renstra Lengkap');

    // Generate filename
    const selectedPdName = selectedDaerahId === 'all' ? 'Semua_PD' :
      perangkatDaerahList.find(pd => pd.id === selectedDaerahId)?.nama_daerah?.replace(/\s+/g, '_') || 'Unknown';
    const filename = `Laporan_Renstra_Lengkap_${selectedPdName}_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);
  };

  // Export to PDF function
  const exportToPDF = () => {
    if (flattenedData.length === 0) {
      alert('Tidak ada data untuk diekspor');
      return;
    }

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Add title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    const title = 'Laporan Lengkap Renstra';
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleWidth = doc.getTextWidth(title);
    const titleX = (pageWidth - titleWidth) / 2;
    doc.text(title, titleX, 20);

    // Add subtitle with selected PD
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const selectedPdName = selectedDaerahId === 'all' ? 'Semua Perangkat Daerah' :
      perangkatDaerahList.find(pd => pd.id === selectedDaerahId)?.nama_daerah || 'Unknown';
    const subtitle = `Perangkat Daerah: ${selectedPdName}`;
    const subtitleWidth = doc.getTextWidth(subtitle);
    const subtitleX = (pageWidth - subtitleWidth) / 2;
    doc.text(subtitle, subtitleX, 30);

    // Prepare table data
    const tableData = flattenedData.map((item, index) => [
      index + 1,
      item.level,
      item.nama_perangkat_daerah,
      item.renstra_tujuan,
      item.renstra_sasaran,
      item.renstra_program,
      item.renstra_kegiatan,
      item.sasaran_kegiatan,
      item.renstra_sub_kegiatan,
      item.sasaran_sub_kegiatan,
      item.deskripsi_indikator,
      item.satuan,
      item.pk ? 'Ya' : 'Tidak',
      item.iku ? 'Ya' : 'Tidak',
      item.kondisi_awal,
      item.target_tahun_1,
      item.target_tahun_2,
      item.target_tahun_3,
      item.target_tahun_4,
      item.target_tahun_5,
      item.kondisi_akhir,
      item.target_renja,
    ]);

    const tableHeaders = [
      'No', 'Level', 'PD', 'Tujuan', 'Sasaran', 'Program',
      'Kegiatan', 'Sasaran Keg.', 'Sub Kegiatan', 'Sasaran SK', 'Indikator',
      'Satuan', 'PK', 'IKU', 'K.Awal',
      '2025', '2026', '2027', '2028', '2029', 'K.Akhir', 'T.Renja'
    ];

    // Add table using the correct method
    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: 40,
      theme: 'striped',
      styles: {
        fontSize: 5,
        cellPadding: 1,
        overflow: 'linebreak',
        halign: 'left',
        valign: 'top'
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontSize: 6,
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 6 },    // No
        1: { halign: 'center', cellWidth: 12 },   // Level
        11: { cellWidth: 10 },                    // Satuan
        12: { halign: 'center', cellWidth: 6 },   // PK
        13: { halign: 'center', cellWidth: 6 },   // IKU
        14: { halign: 'center', cellWidth: 10 },  // Kondisi Awal
        15: { halign: 'center', cellWidth: 8 },   // 2025
        16: { halign: 'center', cellWidth: 8 },   // 2026
        17: { halign: 'center', cellWidth: 8 },   // 2027
        18: { halign: 'center', cellWidth: 8 },   // 2028
        19: { halign: 'center', cellWidth: 8 },   // 2029
        20: { halign: 'center', cellWidth: 10 },  // Kondisi Akhir
        21: { halign: 'center', cellWidth: 10 },  // Target Renja
      },
      margin: { top: 40, left: 5, right: 5 },
      didDrawPage: (data) => {
        // Add page number
        const pageCount = doc.internal.getNumberOfPages();
        const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
        doc.setFontSize(10);
        doc.text(`Halaman ${currentPage} dari ${pageCount}`, pageWidth - 30, doc.internal.pageSize.getHeight() - 10);
      }
    });

    // Generate filename
    const filename = `Laporan_Renstra_${selectedPdName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;

    // Save PDF
    doc.save(filename);
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Laporan Lengkap Renstra</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="mb-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700">Perangkat Daerah</label>
            <select
              value={selectedDaerahId}
              onChange={(e) => setSelectedDaerahId(e.target.value)}
              className="mt-1 block w-full border p-2 rounded-md"
            >
              <option value="all">Semua Perangkat Daerah</option>
              {perangkatDaerahList.map(daerah => (
                <option key={daerah.id} value={daerah.id}>
                  {daerah.nama_daerah}
                </option>
              ))}
            </select>
          </div>
          {/* Export buttons */}
          {flattenedData.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={exportToExcel}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                Excel
              </button>

              <button
                onClick={exportToPDF}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                PDF
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <p className="text-center py-4">Memuat data...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 text-xs">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-2 border border-gray-300 text-left font-semibold text-gray-600">No</th>
                  <th className="py-2 px-2 border border-gray-300 text-left font-semibold text-gray-600">Level</th>
                  <th className="py-2 px-2 border border-gray-300 text-left font-semibold text-gray-600">Perangkat Daerah</th>
                  <th className="py-2 px-2 border border-gray-300 text-left font-semibold text-gray-600">Renstra Tujuan</th>
                  <th className="py-2 px-2 border border-gray-300 text-left font-semibold text-gray-600">Renstra Sasaran</th>
                  <th className="py-2 px-2 border border-gray-300 text-left font-semibold text-gray-600">Renstra Program</th>
                  <th className="py-2 px-2 border border-gray-300 text-left font-semibold text-gray-600">Renstra Kegiatan</th>
                  <th className="py-2 px-2 border border-gray-300 text-left font-semibold text-gray-600">Sasaran Kegiatan</th>
                  <th className="py-2 px-2 border border-gray-300 text-left font-semibold text-gray-600">Renstra Sub Kegiatan</th>
                  <th className="py-2 px-2 border border-gray-300 text-left font-semibold text-gray-600">Sasaran Sub Kegiatan</th>
                  <th className="py-2 px-2 border border-gray-300 text-left font-semibold text-gray-600">Indikator</th>
                  <th className="py-2 px-2 border border-gray-300 text-left font-semibold text-gray-600">Satuan</th>
                  <th className="py-2 px-2 border border-gray-300 text-center font-semibold text-gray-600">PK</th>
                  <th className="py-2 px-2 border border-gray-300 text-center font-semibold text-gray-600">IKU</th>
                  <th className="py-2 px-2 border border-gray-300 text-center font-semibold text-gray-600">Kondisi Awal</th>
                  <th className="py-2 px-2 border border-gray-300 text-center font-semibold text-gray-600">2025</th>
                  <th className="py-2 px-2 border border-gray-300 text-center font-semibold text-gray-600">2026</th>
                  <th className="py-2 px-2 border border-gray-300 text-center font-semibold text-gray-600">2027</th>
                  <th className="py-2 px-2 border border-gray-300 text-center font-semibold text-gray-600">2028</th>
                  <th className="py-2 px-2 border border-gray-300 text-center font-semibold text-gray-600">2029</th>
                  <th className="py-2 px-2 border border-gray-300 text-center font-semibold text-gray-600">Kondisi Akhir</th>
                  <th className="py-2 px-2 border border-gray-300 text-center font-semibold text-gray-600">Target Renja</th>
                </tr>
              </thead>
              <tbody>
                {flattenedData.length > 0 ? (
                  flattenedData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-2 px-2 border border-gray-300 text-center">{item.no}</td>
                      <td className="py-2 px-2 border border-gray-300">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.level === 'Tujuan' ? 'bg-blue-100 text-blue-800' :
                          item.level === 'Sasaran' ? 'bg-green-100 text-green-800' :
                            item.level === 'Program' ? 'bg-yellow-100 text-yellow-800' :
                              item.level === 'Kegiatan' ? 'bg-purple-100 text-purple-800' :
                                'bg-red-100 text-red-800'
                          }`}>
                          {item.level}
                        </span>
                      </td>
                      <td className="py-2 px-2 border border-gray-300">{item.nama_perangkat_daerah}</td>
                      <td className="py-2 px-2 border border-gray-300">{item.renstra_tujuan}</td>
                      <td className="py-2 px-2 border border-gray-300">{item.renstra_sasaran}</td>
                      <td className="py-2 px-2 border border-gray-300">{item.renstra_program}</td>
                      <td className="py-2 px-2 border border-gray-300">{item.renstra_kegiatan}</td>
                      <td className="py-2 px-2 border border-gray-300">{item.sasaran_kegiatan}</td>
                      <td className="py-2 px-2 border border-gray-300">{item.renstra_sub_kegiatan}</td>
                      <td className="py-2 px-2 border border-gray-300">{item.sasaran_sub_kegiatan}</td>
                      <td className="py-2 px-2 border border-gray-300">{item.deskripsi_indikator}</td>
                      <td className="py-2 px-2 border border-gray-300">{item.satuan}</td>
                      <td className="py-2 px-2 border border-gray-300 text-center">{item.pk ? '✓' : '-'}</td>
                      <td className="py-2 px-2 border border-gray-300 text-center">{item.iku ? '✓' : '-'}</td>
                      <td className="py-2 px-2 border border-gray-300 text-center">{item.kondisi_awal}</td>
                      <td className="py-2 px-2 border border-gray-300 text-center">{item.target_tahun_1}</td>
                      <td className="py-2 px-2 border border-gray-300 text-center">{item.target_tahun_2}</td>
                      <td className="py-2 px-2 border border-gray-300 text-center">{item.target_tahun_3}</td>
                      <td className="py-2 px-2 border border-gray-300 text-center">{item.target_tahun_4}</td>
                      <td className="py-2 px-2 border border-gray-300 text-center">{item.target_tahun_5}</td>
                      <td className="py-2 px-2 border border-gray-300 text-center">{item.kondisi_akhir}</td>
                      <td className="py-2 px-2 border border-gray-300 text-center">{item.target_renja}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="22" className="py-4 px-2 text-center text-gray-500">
                      Belum ada data untuk ditampilkan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary */}
        {flattenedData.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
              <p>Total indikator: <span className="font-semibold">{flattenedData.length}</span></p>
              <p>Total sasaran sub kegiatan: <span className="font-semibold">{new Set(flattenedData.map(item => item.sasaran_sub_kegiatan)).size}</span></p>
              <p>Total sub kegiatan: <span className="font-semibold">{new Set(flattenedData.map(item => item.renstra_sub_kegiatan)).size}</span></p>
              <p>Total perangkat daerah: <span className="font-semibold">{new Set(flattenedData.map(item => item.nama_perangkat_daerah)).size}</span></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LaporanRenstraPage;