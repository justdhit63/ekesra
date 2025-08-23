import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import SaveToDriveButton from '../components/SaveToDriveButton';

function LaporanRenstraPage() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const years = [2025, 2026, 2027, 2028, 2029];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_full_renstra_report');
      if (data) {
        setReportData(data);
      } else {
        setReportData([]);
        console.error("Gagal mengambil data laporan:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Fungsi untuk ekspor ke Excel
  const handleExportExcel = () => {
    const flatData = [];
    reportData.forEach(tujuan => {
        tujuan.sasaran?.forEach(sasaran => {
            // Indikator Sasaran
            sasaran.indikator_sasaran?.forEach(indikatorSasaran => {
                flatData.push({
                    "Tujuan": tujuan.deskripsi_tujuan,
                    "Sasaran": sasaran.deskripsi_sasaran,
                    "Indikator Sasaran": indikatorSasaran.deskripsi_indikator,
                    "Satuan": indikatorSasaran.satuan,
                    "Kondisi Awal": indikatorSasaran.kondisi_awal,
                    "Target 2025": indikatorSasaran.target_tahun_1,
                    "Target 2026": indikatorSasaran.target_tahun_2,
                    "Target 2027": indikatorSasaran.target_tahun_3,
                    "Target 2028": indikatorSasaran.target_tahun_4,
                    "Target 2029": indikatorSasaran.target_tahun_5,
                    "Kondisi Akhir": indikatorSasaran.kondisi_akhir,
                    "Program": "",
                    "Kegiatan": "",
                    "Indikator Kegiatan": ""
                });
            });
            // Program, Kegiatan, dan Indikator Kegiatan
            sasaran.program?.forEach(program => {
                program.kegiatan?.forEach(kegiatan => {
                    kegiatan.indikator_kegiatan?.forEach(indikatorKegiatan => {
                        flatData.push({
                            "Tujuan": tujuan.deskripsi_tujuan,
                            "Sasaran": sasaran.deskripsi_sasaran,
                            "Indikator Sasaran": "",
                            "Satuan": indikatorKegiatan.satuan,
                            "Kondisi Awal": indikatorKegiatan.kondisi_awal,
                            "Target 2025": indikatorKegiatan.target_tahun_1,
                            "Target 2026": indikatorKegiatan.target_tahun_2,
                            "Target 2027": indikatorKegiatan.target_tahun_3,
                            "Target 2028": indikatorKegiatan.target_tahun_4,
                            "Target 2029": indikatorKegiatan.target_tahun_5,
                            "Kondisi Akhir": indikatorKegiatan.kondisi_akhir,
                            "Program": program.deskripsi_program,
                            "Kegiatan": kegiatan.deskripsi_kegiatan,
                            "Indikator Kegiatan": indikatorKegiatan.deskripsi_indikator
                        });
                    });
                });
            });
        });
    });

    if (flatData.length === 0) {
        alert("Tidak ada data untuk diekspor!");
        return;
    }

    const worksheet = XLSX.utils.json_to_sheet(flatData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Renstra");
    XLSX.writeFile(workbook, "Laporan_Renstra.xlsx");
  };

  // Fungsi untuk ekspor ke PDF
  const handleExportPdf = () => {
    if (!reportData || reportData.length === 0) {
        alert("Tidak ada data untuk diekspor!");
        return;
    }

    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(16);
    doc.text("Laporan Rencana Strategis (Renstra)", 14, 16);
    doc.setFontSize(10);
    doc.text("Data Indikator Sasaran", 14, 28);
    
    // Tabel Indikator Sasaran
    let tableColumnSasaran = ["Tujuan", "Sasaran", "Indikator", "Satuan", "Kondisi Awal", ...years.map(year => `Target ${year}`), "Kondisi Akhir"];
    let tableRowsSasaran = [];
    reportData.forEach(tujuan => {
        tujuan.sasaran?.forEach(sasaran => {
            sasaran.indikator_sasaran?.forEach(indikator => {
                tableRowsSasaran.push([
                    tujuan.deskripsi_tujuan || '',
                    sasaran.deskripsi_sasaran || '',
                    indikator.deskripsi_indikator || '',
                    indikator.satuan || '',
                    indikator.kondisi_awal || '',
                    indikator.target_tahun_1 || '',
                    indikator.target_tahun_2 || '',
                    indikator.target_tahun_3 || '',
                    indikator.target_tahun_4 || '',
                    indikator.target_tahun_5 || '',
                    indikator.kondisi_akhir || '',
                ]);
            });
        });
    });
    
    autoTable(doc, {
        head: [tableColumnSasaran],
        body: tableRowsSasaran,
        startY: 32,
        theme: 'grid',
        styles: { fontSize: 6 },
        headStyles: { fillColor: [22, 160, 133] },
    });
    
    // Tabel Indikator Kegiatan
    doc.addPage();
    doc.setFontSize(16);
    doc.text("Laporan Rencana Strategis (Renstra)", 14, 16);
    doc.setFontSize(10);
    doc.text("Data Indikator Kegiatan", 14, 28);
    
    let tableColumnKegiatan = ["Program", "Kegiatan", "Indikator", "Satuan", "Kondisi Awal", ...years.map(year => `Target ${year}`), "Kondisi Akhir"];
    let tableRowsKegiatan = [];
    reportData.forEach(tujuan => {
        tujuan.sasaran?.forEach(sasaran => {
            sasaran.program?.forEach(program => {
                program.kegiatan?.forEach(kegiatan => {
                    kegiatan.indikator_kegiatan?.forEach(indikator => {
                        tableRowsKegiatan.push([
                            program.deskripsi_program || '',
                            kegiatan.deskripsi_kegiatan || '',
                            indikator.deskripsi_indikator || '',
                            indikator.satuan || '',
                            indikator.kondisi_awal || '',
                            indikator.target_tahun_1 || '',
                            indikator.target_tahun_2 || '',
                            indikator.target_tahun_3 || '',
                            indikator.target_tahun_4 || '',
                            indikator.target_tahun_5 || '',
                            indikator.kondisi_akhir || '',
                        ]);
                    });
                });
            });
        });
    });

    autoTable(doc, {
        head: [tableColumnKegiatan],
        body: tableRowsKegiatan,
        startY: 32,
        theme: 'grid',
        styles: { fontSize: 6 },
        headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save(`Laporan_Renstra.pdf`);
  };

  const generatePdfData = () => {
    // Fungsi ini membutuhkan implementasi lebih lanjut.
    alert("Fungsi ini membutuhkan implementasi lebih lanjut.");
    return null;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Laporan Renstra</h1>
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex justify-end space-x-2">
        <button onClick={handleExportExcel} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">
          Ekspor Excel
        </button>
        <button onClick={handleExportPdf} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors">
          Ekspor PDF
        </button>
        <SaveToDriveButton getFileData={generatePdfData} />
      </div>

      {/* Tampilan Laporan di Halaman Web */}
      <div id="laporan-renstra" className="bg-white p-6 rounded-lg shadow-md">
        {loading ? <p className="text-center">Memuat laporan...</p> : (
            reportData.length > 0 ? reportData.map((tujuan, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <h2 className="text-lg font-bold bg-blue-100 p-2 rounded">Tujuan: {tujuan.deskripsi_tujuan}</h2>
              {tujuan.sasaran?.map((sasaran, idx) => (
                <div key={idx} className="ml-4 mt-2 border-l-2 border-blue-200 pl-4">
                  <h3 className="font-semibold text-gray-800">Sasaran: {sasaran.deskripsi_sasaran}</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm mt-1">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border p-2 text-left">Indikator</th>
                          <th className="border p-2 text-left">Satuan</th>
                          <th className="border p-2 text-left">Kondisi Awal</th>
                          {years.map(year => (
                              <th key={year} className="border p-2 text-left">Target {year}</th>
                          ))}
                          <th className="border p-2 text-left">Kondisi Akhir</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sasaran.indikator_sasaran?.map((ind, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="border p-2">{ind.deskripsi_indikator}</td>
                            <td className="border p-2">{ind.satuan}</td>
                            <td className="border p-2">{ind.kondisi_awal}</td>
                            <td className="border p-2">{ind.target_tahun_1}</td>
                            <td className="border p-2">{ind.target_tahun_2}</td>
                            <td className="border p-2">{ind.target_tahun_3}</td>
                            <td className="border p-2">{ind.target_tahun_4}</td>
                            <td className="border p-2">{ind.target_tahun_5}</td>
                            <td className="border p-2">{ind.kondisi_akhir}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Program dan Kegiatan di bawah Sasaran */}
                  {sasaran.program?.map((program, progIdx) => (
                      <div key={progIdx} className="ml-4 mt-4 border-l-2 border-green-200 pl-4">
                          <h4 className="font-semibold text-gray-700">Program: {program.deskripsi_program}</h4>
                          {program.kegiatan?.map((kegiatan, kegIdx) => (
                              <div key={kegIdx} className="ml-4 mt-2 border-l-2 border-yellow-200 pl-4">
                                  <h5 className="font-medium text-gray-600">Kegiatan: {kegiatan.deskripsi_kegiatan}</h5>
                                  <div className="overflow-x-auto mt-1">
                                      <table className="min-w-full text-sm">
                                          <thead className="bg-gray-50">
                                              <tr>
                                                  <th className="border p-2 text-left">Indikator Kegiatan</th>
                                                  <th className="border p-2 text-left">Satuan</th>
                                                  <th className="border p-2 text-left">Kondisi Awal</th>
                                                  {years.map(year => (
                                                      <th key={year} className="border p-2 text-left">Target {year}</th>
                                                  ))}
                                                  <th className="border p-2 text-left">Kondisi Akhir</th>
                                              </tr>
                                          </thead>
                                          <tbody>
                                              {kegiatan.indikator_kegiatan?.map((ind, i) => (
                                                  <tr key={i} className="hover:bg-gray-50">
                                                      <td className="border p-2">{ind.deskripsi_indikator}</td>
                                                      <td className="border p-2">{ind.satuan}</td>
                                                      <td className="border p-2">{ind.kondisi_awal}</td>
                                                      <td className="border p-2">{ind.target_tahun_1}</td>
                                                      <td className="border p-2">{ind.target_tahun_2}</td>
                                                      <td className="border p-2">{ind.target_tahun_3}</td>
                                                      <td className="border p-2">{ind.target_tahun_4}</td>
                                                      <td className="border p-2">{ind.target_tahun_5}</td>
                                                      <td className="border p-2">{ind.kondisi_akhir}</td>
                                                  </tr>
                                              ))}
                                          </tbody>
                                      </table>
                                  </div>
                              </div>
                          ))}
                      </div>
                  ))}
                </div>
              ))}
            </div>
          )) : <p className="text-center text-gray-500">Tidak ada data laporan untuk ditampilkan.</p>
        )}
      </div>
    </div>
  );
}

export default LaporanRenstraPage;