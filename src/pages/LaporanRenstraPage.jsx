// src/pages/LaporanRenstraPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import SaveToDriveButton from '../components/SaveToDriveButton';

function LaporanRenstraPage() {
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [selectedDaerahId, setSelectedDaerahId] = useState('');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  // <-- BAGIAN YANG DILENGKAPI: Mengambil daftar Perangkat Daerah -->
  useEffect(() => {
    const fetchPerangkatDaerah = async () => {
      const { data } = await supabase.from('perangkat_daerah').select('id, nama_daerah');
      if (data) {
        setPerangkatDaerahList(data);
        if (data.length > 0) {
          setSelectedDaerahId(data[0].id);
        }
      }
    };
    fetchPerangkatDaerah();
  }, []);

  useEffect(() => {
    if (!selectedDaerahId) return;
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_full_renstra_report', { pd_id: selectedDaerahId });
      if (data) {
        setReportData(data);
      } else {
        setReportData([]);
        console.error("Gagal mengambil data laporan:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, [selectedDaerahId]);

  // Fungsi untuk ekspor ke Excel
  const handleExportExcel = () => {
    const flatData = [];
    reportData.forEach(sasaran => {
      sasaran.tujuan?.forEach(tujuan => {
        tujuan.indikator_tujuan?.forEach(indikator => {
          flatData.push({
            "Sasaran": sasaran.deskripsi_sasaran,
            "Tujuan": tujuan.deskripsi_tujuan,
            "Indikator Tujuan": indikator.deskripsi_indikator,
            "Satuan": indikator.satuan,
            "Kondisi Awal": indikator.kondisi_awal,
            "Target 2025": indikator.target_tahun_1,
            "Target 2026": indikator.target_tahun_2,
            "Target 2027": indikator.target_tahun_3,
            "Target 2028": indikator.target_tahun_4,
            "Target 2029": indikator.target_tahun_5,
            "Kondisi Akhir": indikator.kondisi_akhir,
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

  const handleExportPdf = () => {
    if (!reportData || reportData.length === 0) {
        alert("Tidak ada data untuk diekspor!");
        return;
    }
  
    const doc = new jsPDF({ orientation: 'landscape' });
    const selectedPD = perangkatDaerahList.find(pd => pd.id === selectedDaerahId);
    
    doc.setFontSize(16);
    doc.text("Laporan Rencana Strategis (Renstra)", 14, 16);
    doc.setFontSize(10);
    doc.text(`Perangkat Daerah: ${selectedPD ? selectedPD.nama_daerah : ''}`, 14, 22);
    
    const tableColumn = ["Sasaran", "Tujuan", "Indikator Tujuan", "Satuan", "Kondisi Awal", "Target 2025"];
    const tableRows = [];
  
    // Proses data yang kompleks menjadi format array yang sederhana
    reportData.forEach(sasaran => {
      const sasaranText = sasaran.deskripsi_sasaran || '';
      
      if (sasaran.tujuan && sasaran.tujuan.length > 0) {
        sasaran.tujuan.forEach((tujuan, tujuanIndex) => {
          const tujuanText = tujuan.deskripsi_tujuan || '';
  
          if (tujuan.indikator_tujuan && tujuan.indikator_tujuan.length > 0) {
            tujuan.indikator_tujuan.forEach((indikator, indicatorIndex) => {
              const rowData = [
                (tujuanIndex === 0 && indicatorIndex === 0) ? sasaranText : '', // Tampilkan Sasaran hanya sekali
                indicatorIndex === 0 ? tujuanText : '', // Tampilkan Tujuan hanya sekali per grup indikator
                indikator.deskripsi_indikator || '',
                indikator.satuan || '',
                indikator.kondisi_awal || '',
                indikator.target_tahun_1 || '',
              ];
              tableRows.push(rowData);
            });
          } else {
            // Jika tujuan tidak punya indikator, tetap tampilkan barisnya
            const rowData = [
               tujuanIndex === 0 ? sasaranText : '',
               tujuanText,
               '(Tidak ada indikator)', '', '', ''
            ];
            tableRows.push(rowData);
          }
        });
      } else {
        // Jika sasaran tidak punya tujuan
        const rowData = [sasaranText, '(Tidak ada tujuan)', '', '', '', ''];
        tableRows.push(rowData);
      }
    });
  
    console.log("Data yang akan dicetak ke PDF:", tableRows); // Untuk debugging di console
  
    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 28,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [22, 160, 133] },
      });
  
      doc.save(`Laporan_Renstra.pdf`);
    };

    const generatePdfData = () => {
        if (!reportData || reportData.length === 0) {
            alert("Tidak ada data untuk diekspor!");
            return null;
        }

        const doc = new jsPDF({ orientation: 'landscape' });
        const selectedPD = perangkatDaerahList.find(pd => pd.id === selectedDaerahId);

        doc.setFontSize(16);
        doc.text("Laporan Rencana Strategis (Renstra)", 14, 16);
        doc.setFontSize(10);
        doc.text(`Perangkat Daerah: ${selectedPD ? selectedPD.nama_daerah : ''}`, 14, 22);

        const tableColumn = ["Sasaran", "Tujuan", "Indikator Tujuan", "Satuan", "Kondisi Awal", "Target 2025"];
        const tableRows = [];

        reportData.forEach(sasaran => {
            const sasaranText = sasaran.deskripsi_sasaran || '';

            if (sasaran.tujuan && sasaran.tujuan.length > 0) {
                sasaran.tujuan.forEach((tujuan, tujuanIndex) => {
                    const tujuanText = tujuan.deskripsi_tujuan || '';

                    if (tujuan.indikator_tujuan && tujuan.indikator_tujuan.length > 0) {
                        tujuan.indikator_tujuan.forEach((indikator, indicatorIndex) => {
                            const rowData = [
                                (tujuanIndex === 0 && indicatorIndex === 0) ? sasaranText : '',
                                indicatorIndex === 0 ? tujuanText : '',
                                indikator.deskripsi_indikator || '',
                                indikator.satuan || '',
                                indikator.kondisi_awal || '',
                                indikator.target_tahun_1 || '',
                            ];
                            tableRows.push(rowData);
                        });
                    } else {
                        const rowData = [
                            tujuanIndex === 0 ? sasaranText : '',
                            tujuanText,
                            '(Tidak ada indikator)', '', '', ''
                        ];
                        tableRows.push(rowData);
                    }
                });
            } else {
                const rowData = [sasaranText, '(Tidak ada tujuan)', '', '', '', ''];
                tableRows.push(rowData);
            }
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 28,
            theme: 'grid',
            styles: { fontSize: 8 },
            headStyles: { fillColor: [22, 160, 133] },
        });

        return {
            blob: doc.output('blob'),
            fileName: 'Laporan_Renstra.pdf'
        };
    };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Laporan Renstra</h1>
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex justify-between items-center">
        <div>
          <label htmlFor="perangkat-daerah" className="block text-sm font-medium text-gray-700">Perangkat Daerah</label>
          {/* <-- BAGIAN YANG DILENGKAPI: Opsi dropdown --> */}
          <select 
            id="perangkat-daerah"
            value={selectedDaerahId} 
            onChange={(e) => setSelectedDaerahId(e.target.value)} 
            className="mt-1 block w-full md:w-96 border p-2 rounded-md"
          >
            <option value="">Pilih Perangkat Daerah</option>
            {perangkatDaerahList.map(daerah => (
              <option key={daerah.id} value={daerah.id}>{daerah.nama_daerah}</option>
            ))}
          </select>
        </div>
        <div className="flex space-x-2">
          <button onClick={handleExportExcel} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">
            Ekspor Excel
          </button>
          <button onClick={handleExportPdf} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors">
            Ekspor PDF
          </button>
          <SaveToDriveButton getFileData={generatePdfData} />
        </div>
      </div>
      
      {/* Tampilan Laporan di Halaman Web */}
      <div id="laporan-renstra" className="bg-white p-6 rounded-lg shadow-md">
        {loading ? <p className="text-center">Memuat laporan...</p> : (
            reportData.length > 0 ? reportData.map((sasaran, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <h2 className="text-lg font-bold bg-blue-100 p-2 rounded">Sasaran: {sasaran.deskripsi_sasaran}</h2>
              {sasaran.tujuan?.map((tujuan, idx) => (
                <div key={idx} className="ml-4 mt-2 border-l-2 border-blue-200 pl-4">
                  <h3 className="font-semibold text-gray-800">Tujuan: {tujuan.deskripsi_tujuan}</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm mt-1">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border p-2 text-left">Indikator Tujuan</th>
                          <th className="border p-2 text-left">Satuan</th>
                          <th className="border p-2 text-left">Kondisi Awal</th>
                          <th className="border p-2 text-left">Target 2025</th>
                          <th className="border p-2 text-left">Kondisi Akhir</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tujuan.indikator_tujuan?.map((ind, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="border p-2">{ind.deskripsi_indikator}</td>
                            <td className="border p-2">{ind.satuan}</td>
                            <td className="border p-2">{ind.kondisi_awal}</td>
                            <td className="border p-2">{ind.target_tahun_1}</td>
                            <td className="border p-2">{ind.kondisi_akhir}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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