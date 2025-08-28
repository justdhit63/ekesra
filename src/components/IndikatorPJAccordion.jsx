// src/components/IndikatorPJAccordion.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FaChevronDown, FaPlus, FaTrash, FaSave } from 'react-icons/fa';

function IndikatorPJAccordion({ indicator }) {
  const [isOpen, setIsOpen] = useState(true);
  const [picList, setPicList] = useState([]); // State ini sekarang menjadi "source of truth" untuk form
  const [allProfiles, setAllProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Ambil semua data pegawai untuk pilihan dropdown
  useEffect(() => {
    const fetchProfiles = async () => {
      const { data } = await supabase.from('penanggung_jawab').select('id, nama');
      if (data) setAllProfiles(data);
    };
    fetchProfiles();
  }, []);

  // Ambil daftar PIC untuk indikator ini saat accordion dibuka
  const fetchPics = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('penanggung_jawab_indikator')
      .select(`*, penanggung_jawab(nama)`)
      .eq('indikator_id', indicator.id);
    if (data) setPicList(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchPics();
    }
  }, [isOpen]); // Hanya bergantung pada isOpen

  // --- PERUBAHAN LOGIKA HANDLER ---

  // Menambah baris baru HANYA di state lokal
  const handleAddPic = () => {
    if (allProfiles.length === 0) return;
    setPicList([
      ...picList,
      {
        // Buat ID sementara untuk key di React, ini tidak akan disimpan ke DB
        id: `new-${Date.now()}`,
        penanggung_jawab_id: allProfiles[0].id,
        indikator_id: indicator.id,
        target_tahun_1: '', target_tahun_2: '', target_tahun_3: '',
        target_tahun_4: '', target_tahun_5: '',
      }
    ]);
  };

  // Menghapus baris HANYA dari state lokal
  const handleDeletePic = (index) => {
    const values = [...picList];
    values.splice(index, 1);
    setPicList(values);
  };

  // Mengubah data (nama atau target) HANYA di state lokal
  const handlePicChange = (index, field, value) => {
    const values = [...picList];
    values[index][field] = value;
    setPicList(values);
  };

  // --- FUNGSI BARU UNTUK SUBMIT SEMUA PERUBAHAN ---
  const handleSubmit = async () => {
    setSaving(true);

    // Strategi: Hapus semua data lama, lalu masukkan semua data baru dari state
    // Ini cara paling sederhana dan aman untuk sinkronisasi

    // 1. Hapus semua penanggung jawab yang ada untuk indikator ini
    const { error: deleteError } = await supabase
      .from('penanggung_jawab_indikator')
      .delete()
      .eq('indikator_id', indicator.id);

    if (deleteError) {
      alert("Gagal membersihkan data lama: " + deleteError.message);
      setSaving(false);
      return;
    }

    // 2. Siapkan data baru dari state untuk disimpan (tanpa ID sementara)
    const newPicData = picList.map(pic => ({
      indikator_id: indicator.id,
      penanggung_jawab_id: pic.penanggung_jawab_id,
      target_tahun_1: pic.target_tahun_1,
      target_tahun_2: pic.target_tahun_2,
      target_tahun_3: pic.target_tahun_3,
      target_tahun_4: pic.target_tahun_4,
      target_tahun_5: pic.target_tahun_5,
    }));

    // Jangan insert jika tidak ada data
    if (newPicData.length === 0) {
      alert("Data berhasil disimpan (kosong).");
      setSaving(false);
      return;
    }

    // 3. Masukkan semua data baru
    const { error: insertError } = await supabase
      .from('penanggung_jawab_indikator')
      .insert(newPicData);

    if (insertError) {
      alert("Gagal menyimpan data baru: " + insertError.message);
    } else {
      alert("Perubahan berhasil disimpan!");
      fetchPics(); // Muat ulang data dari DB untuk sinkronisasi
    }
    setSaving(false);
  };

  return (
    <div className="bg-white rounded-sm shadow-md border border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-green-600 text-gray-50 p-3 flex justify-between items-center rounded-t-sm border-b"
      >
        <span className="font-semibold text-left">» Indikator: {indicator.deskripsi_indikator}</span>
        <FaChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="p-4">
          {loading ? (
            <p>Memuat...</p>
          ) : (
            <div className="rounded-lg shadow-md overflow-x-auto">
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="">
                    <th className="border border-gray-300 border-b-2 border-b-black p-2 w-1/3">Penanggung Jawab</th>
                    <th className="border border-gray-300 border-b-2 border-b-black p-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {picList.map((pic, index) => (
                    <tr key={pic.id} className="text-center">
                      <td className="border border-gray-300 p-2 w-1/3">
                        <select
                          value={pic.penanggung_jawab_id}
                          onChange={(e) => handlePicChange(index, 'penanggung_jawab_id', e.target.value)}
                          className="border p-2 rounded-md w-full"
                        >
                          {allProfiles.map(p => (
                            <option key={p.id} value={p.id}>{p.nama}</option>
                          ))}
                        </select>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <button
                          onClick={() => handleDeletePic(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* --- TOMBOL-TOMBOL AKSI BARU --- */}
          <div className="mt-4 flex items-center space-x-4">
            <button
              onClick={handleAddPic}
              className="bg-blue-500 text-white py-1 px-3 rounded-lg shadow-md text-sm inline-flex items-center"
            >
              <FaPlus className="mr-2" />
              Tambah Penanggung Jawab
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-green-600 text-white py-1 px-3 rounded-lg shadow-md text-sm inline-flex items-center disabled:bg-green-300"
            >
              <FaSave className="mr-2" />
              {saving ? 'Menyimpan...' : 'Submit Perubahan'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default IndikatorPJAccordion;