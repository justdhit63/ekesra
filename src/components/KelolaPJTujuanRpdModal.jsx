// src/components/KelolaPJTujuanRpdModal.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FaPlus, FaTrash } from 'react-icons/fa';

function KelolaPJTujuanRpdModal({ isOpen, onClose, indicator, onSave }) {
  const [picList, setPicList] = useState([]); // Daftar Penanggung Jawab (PIC)
  const [allProfiles, setAllProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    
    // Ambil semua pegawai (kecuali admin) untuk pilihan dropdown
    const fetchProfiles = async () => {
      const { data } = await supabase.from('penanggung_jawab').select('id, nama');
      if (data) setAllProfiles(data);
    };

    // Ambil daftar PIC yang sudah ada untuk indikator ini
    const fetchExistingPics = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('pj_indikator_tujuan_rpd')
        .select('id, penanggung_jawab_id')
        .eq('indikator_tujuan_rpd_id', indicator.id);
      
      if (data) setPicList(data);
      setLoading(false);
    };

    fetchProfiles();
    fetchExistingPics();
  }, [isOpen, indicator]);

  // Menambah baris baru HANYA di state lokal
  const handleAddPic = () => {
    if (allProfiles.length > 0) {
      setPicList([...picList, { id: `new-${Date.now()}`, penanggung_jawab_id: allProfiles[0].id }]);
    }
  };

  // Menghapus baris HANYA dari state lokal
  const handleDeletePic = (index) => {
    const values = [...picList];
    values.splice(index, 1);
    setPicList(values);
  };

  // Mengubah pilihan penanggung jawab di state lokal
  const handlePicChange = (index, newProfileId) => {
    const values = [...picList];
    values[index].penanggung_jawab_id = newProfileId;
    setPicList(values);
  };

  // Fungsi untuk menyimpan semua perubahan ke database
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // 1. Hapus semua penanggung jawab lama untuk indikator ini
    await supabase.from('pj_indikator_tujuan_rpd').delete().eq('indikator_tujuan_rpd_id', indicator.id);
    
    // 2. Siapkan data baru dari state untuk disimpan
    const newPicData = picList
      .filter(pic => pic.penanggung_jawab_id)
      .map(pic => ({
        indikator_tujuan_rpd_id: indicator.id,
        penanggung_jawab_id: pic.penanggung_jawab_id,
      }));

    // 3. Masukkan data baru jika ada
    if (newPicData.length > 0) {
      const { error } = await supabase.from('pj_indikator_tujuan_rpd').insert(newPicData);
      if (error) {
        alert("Gagal menyimpan perubahan: " + error.message);
        setSaving(false);
        return;
      }
    }
    
    alert("Perubahan berhasil disimpan!");
    onSave(); // Panggil fungsi dari parent untuk refresh dan menutup modal
    setSaving(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Kelola Penanggung Jawab</h2>
        <div className="bg-gray-100 p-3 rounded-md mb-4 text-sm">
            <p><strong>Indikator:</strong> {indicator?.deskripsi}</p>
        </div>
        
        <form onSubmit={handleSubmit}>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {loading ? <p>Memuat...</p> : picList.map((pic, index) => (
                    <div key={pic.id || index} className="flex items-center space-x-2">
                        <select 
                          value={pic.penanggung_jawab_id} 
                          onChange={(e) => handlePicChange(index, e.target.value)} 
                          className="flex-grow border p-2 rounded-md"
                        >
                            {allProfiles.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                        </select>
                        <button type="button" onClick={() => handleDeletePic(index)} className="text-red-500 hover:text-red-700 p-2 rounded-md bg-red-50 hover:bg-red-100">
                          <FaTrash />
                        </button>
                    </div>
                ))}
            </div>

            <button type="button" onClick={handleAddPic} className="mt-3 text-blue-600 font-semibold text-sm inline-flex items-center hover:underline">
                <FaPlus size={12} className="mr-2"/> Tambah Penanggung Jawab
            </button>

            <div className="mt-6 flex justify-end space-x-4 border-t pt-4">
                <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
                  Tutup
                </button>
                <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300">
                  {saving ? 'Menyimpan...' : 'Submit'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}
export default KelolaPJTujuanRpdModal;