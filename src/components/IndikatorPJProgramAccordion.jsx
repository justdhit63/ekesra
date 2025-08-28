// src/components/IndikatorPJProgramAccordion.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FaChevronDown, FaPlus, FaTrash, FaSave } from 'react-icons/fa';

function IndikatorPJProgramAccordion({ indicator }) {
  const [isOpen, setIsOpen] = useState(true);
  const [picList, setPicList] = useState([]);
  const [allProfiles, setAllProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data } = await supabase.from('penanggung_jawab').select('id, nama');
      if (data) setAllProfiles(data);
    };
    fetchProfiles();
  }, []);

  const fetchPics = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('penanggung_jawab_indikator_program')
      .select(`*, penanggung_jawab(nama)`)
      .eq('indikator_program_id', indicator.id);
    if (data) setPicList(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) fetchPics();
  }, [isOpen]);

  const handleAddPic = () => {
    if (allProfiles.length === 0) return;
    setPicList([...picList, { id: `new-${Date.now()}`, penanggung_jawab_id: allProfiles[0].id }]);
  };

  const handleDeletePic = (index) => {
    const values = [...picList];
    values.splice(index, 1);
    setPicList(values);
  };

  const handlePicChange = (index, field, value) => {
    const values = [...picList];
    values[index][field] = value;
    setPicList(values);
  };

  const handleSubmit = async () => {
    setSaving(true);
    await supabase.from('penanggung_jawab_indikator_program').delete().eq('indikator_program_id', indicator.id);

    const newPicData = picList.map(pic => ({
      indikator_program_id: indicator.id,
      penanggung_jawab_id: pic.penanggung_jawab_id,
      target_tahun_1: pic.target_tahun_1,
      target_tahun_2: pic.target_tahun_2,
      target_tahun_3: pic.target_tahun_3,
      target_tahun_4: pic.target_tahun_4,
      target_tahun_5: pic.target_tahun_5,
    }));

    if (newPicData.length > 0) {
      const { error } = await supabase.from('penanggung_jawab_indikator_program').insert(newPicData);
      if (error) alert("Gagal menyimpan: " + error.message);
      else alert("Perubahan berhasil disimpan!");
    } else {
      alert("Perubahan berhasil disimpan (kosong).");
    }

    setSaving(false);
    fetchPics();
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full bg-green-600 text-white p-3 flex justify-between items-center rounded-t-lg border-b">
        <span className="font-semibold text-left">» Indikator: {indicator.deskripsi_indikator}</span>
        <FaChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="p-4">
          {loading ? (
            <p>Memuat...</p>
          ) : (
            <div className="rounded-md shadow-md">
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">Penanggung Jawab</th>
                    <th className="border border-gray-300 p-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {picList.map((pic, index) => (
                    <tr key={pic.id}>
                      <td className="border border-gray-300 p-2">
                        <select
                          value={pic.penanggung_jawab_id}
                          onChange={(e) => handlePicChange(index, 'penanggung_jawab_id', e.target.value)}
                          className="w-full border p-2 rounded-md"
                        >
                          {allProfiles.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.nama}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
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
          <div className="mt-4 flex items-center space-x-4">
            <button
              onClick={handleAddPic}
              className="bg-blue-500 text-white py-1 px-3 rounded text-sm inline-flex items-center"
            >
              <FaPlus className="mr-2" />
              Tambah Penanggung Jawab
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-green-600 text-white py-1 px-3 rounded text-sm inline-flex items-center disabled:bg-green-300"
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

export default IndikatorPJProgramAccordion;