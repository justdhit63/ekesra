// src/components/KelolaPJSasaranRpdModal.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FaPlus, FaTrash } from 'react-icons/fa';

function KelolaPJSasaranRpdModal({ isOpen, onClose, indicator, onSave }) {
  const [picList, setPicList] = useState([]);
  const [allProfiles, setAllProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    
    const fetchProfiles = async () => {
      const { data } = await supabase.from('penanggung_jawab').select('id, nama');
      if (data) setAllProfiles(data);
    };

    const fetchExistingPics = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('pj_indikator_sasaran_rpd')
        .select('id, penanggung_jawab_id')
        .eq('indikator_sasaran_rpd_id', indicator.id);
      
      if (data) setPicList(data);
      setLoading(false);
    };

    fetchProfiles();
    fetchExistingPics();
  }, [isOpen, indicator]);

  const handleAddPic = () => {
    if (allProfiles.length > 0) {
      setPicList([...picList, { id: `new-${Date.now()}`, penanggung_jawab_id: allProfiles[0].id }]);
    }
  };

  const handleDeletePic = (index) => {
    const values = [...picList];
    values.splice(index, 1);
    setPicList(values);
  };

  const handlePicChange = (index, newProfileId) => {
    const values = [...picList];
    values[index].penanggung_jawab_id = newProfileId;
    setPicList(values);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    await supabase.from('pj_indikator_sasaran_rpd').delete().eq('indikator_sasaran_rpd_id', indicator.id);
    
    const newPicData = picList
      .filter(pic => pic.penanggung_jawab_id)
      .map(pic => ({
        indikator_sasaran_rpd_id: indicator.id,
        penanggung_jawab_id: pic.penanggung_jawab_id,
      }));

    if (newPicData.length > 0) {
      const { error } = await supabase.from('pj_indikator_sasaran_rpd').insert(newPicData);
      if (error) {
        alert("Gagal menyimpan perubahan: " + error.message);
        setSaving(false);
        return;
      }
    }
    
    alert("Perubahan berhasil disimpan!");
    onSave();
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
export default KelolaPJSasaranRpdModal;