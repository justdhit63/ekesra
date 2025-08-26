import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import PKTriwulanKegiatanModal from './PKTriwulanKegiatanModal';

function KegiatanPKTriwulanAccordion({ kegiatan, tahun, onDataChange }) {
    const [isOpen, setIsOpen] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedTahun, setSelectedTahun] = useState('2025');

    const handleKelolaTriwulan = (targetTahun) => {
        setSelectedTahun(targetTahun);
        setShowModal(true);
    };

    return (
        <div className="bg-white rounded-sm shadow-md">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-sm"
            >
                <span className="font-semibold text-left">» Kegiatan: {kegiatan.nama_kegiatan}</span>
                <FaChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="p-4 border-l border-r border-b rounded-b-sm border-gray-200">
                    <div className="overflow-x-auto rounded-md shadow-md">
                        <table className="min-w-full bg-white text-sm">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-700">Indikator</th>
                                    <th className="py-2 px-4 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-700">Satuan</th>
                                    <th className="py-2 px-4 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-700">IKU</th>
                                    <th className="py-2 px-4 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-700">Target PK Triwulan 2025</th>
                                    <th className="py-2 px-4 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-700">Target PK Triwulan 2026</th>
                                    <th className="py-2 px-4 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-700">Target PK Triwulan 2027</th>
                                    <th className="py-2 px-4 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-700">Target PK Triwulan 2028</th>
                                    <th className="py-2 px-4 border border-gray-300 border-b border-b-black text-left font-semibold text-gray-700">Target PK Triwulan 2029</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {kegiatan.pk_indikator_kegiatan_triwulan && kegiatan.pk_indikator_kegiatan_triwulan.length > 0 ? (
                                    kegiatan.pk_indikator_kegiatan_triwulan.map(indikator => (
                                        <tr key={indikator.id} className="hover:bg-gray-50">
                                            <td className="py-2 px-4 border border-gray-300 font-medium">{indikator.nama_indikator}</td>
                                            <td className="py-2 px-4 border border-gray-300">{indikator.satuan || '-'}</td>
                                            <td className="py-2 px-4 border border-gray-300 text-center">
                                                <input type="checkbox" disabled />
                                            </td>
                                            <td className="py-2 px-4 border border-gray-300">
                                                <div className="text-center">
                                                    {indikator.tahun === 2025 && (indikator.target_tw1 || indikator.target_tw2 || indikator.target_tw3 || indikator.target_tw4) ? 
                                                        `TW1: ${indikator.target_tw1 || 0}, TW2: ${indikator.target_tw2 || 0}, TW3: ${indikator.target_tw3 || 0}, TW4: ${indikator.target_tw4 || 0}` :
                                                        '- Belum ada data -'
                                                    }
                                                    <br />
                                                    <button
                                                        onClick={() => handleKelolaTriwulan('2025')}
                                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                                    >
                                                        ☑ Kelola Triwulan 2025
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="py-2 px-4 border border-gray-300">
                                                <div className="text-center">
                                                    - Belum ada data -
                                                    <br />
                                                    <button
                                                        onClick={() => handleKelolaTriwulan('2026')}
                                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                                    >
                                                        ☑ Kelola Triwulan 2026
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="py-2 px-4 border border-gray-300">
                                                <div className="text-center">
                                                    - Belum ada data -
                                                    <br />
                                                    <button
                                                        onClick={() => handleKelolaTriwulan('2027')}
                                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                                    >
                                                        ☑ Kelola Triwulan 2027
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="py-2 px-4 border border-gray-300">
                                                <div className="text-center">
                                                    - Belum ada data -
                                                    <br />
                                                    <button
                                                        onClick={() => handleKelolaTriwulan('2028')}
                                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                                    >
                                                        ☑ Kelola Triwulan 2028
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="py-2 px-4 border border-gray-300">
                                                <div className="text-center">
                                                    - Belum ada data -
                                                    <br />
                                                    <button
                                                        onClick={() => handleKelolaTriwulan('2029')}
                                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                                    >
                                                        ☑ Kelola Triwulan 2029
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="py-4 px-4 text-center text-gray-500">
                                            Belum ada indikator untuk kegiatan ini.
                                            <br />
                                            <button
                                                onClick={() => handleKelolaTriwulan('2025')}
                                                className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                                            >
                                                ☑ Kelola Triwulan 2025
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showModal && (
                <PKTriwulanKegiatanModal
                    kegiatan={kegiatan}
                    initialTahun={selectedTahun}
                    onClose={() => setShowModal(false)}
                    onSave={onDataChange}
                />
            )}
        </div>
    );
}

export default KegiatanPKTriwulanAccordion;