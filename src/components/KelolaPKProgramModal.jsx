// src/components/KelolaPKProgramModal.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FaPlus, FaTrash } from 'react-icons/fa';

function KelolaPKProgramModal({ isOpen, onClose, indicator, year, onSave }) {
  const [picList, setPicList] = useState([]);
  const [allProfiles, setAllProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    
    const fetchProfiles = async () => {
      const { data } = await supabase.from('profiles').select('id, full_name').neq('role', 'admin');
      if (data) setAllProfiles(data);
    };

    const fetchExistingPics = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('pk_tahunan_indikator_program')
        .select('id, profile_id, target_pk')
        .eq('indikator_program_id', indicator.id)
        .eq('tahun', year);
      
      if (data) setPicList(data);
      setLoading(false);
    };

    fetchProfiles();
    fetchExistingPics();
  }, [isOpen, indicator, year]);

  const handleAddPic = () => {
    if (allProfiles.length > 0) {
      setPicList([...picList, { id: `new-${Date.now()}`, profile_id: allProfiles[0].id, target_pk: '' }]);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    await supabase.from('pk_tahunan_indikator_program').delete()
      .eq('indikator_program_id', indicator.id)
      .eq('tahun', year);
    
    const newPicData = picList
      .filter(pic => pic.profile_id)
      .map(pic => ({
        indikator_program_id: indicator.id,
        tahun: year,
        profile_id: pic.profile_id,
        target_pk: pic.target_pk,
      }));

    if (newPicData.length > 0) {
      const { error } = await supabase.from('pk_tahunan_indikator_program').insert(newPicData);
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
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Kelola Target PK Program Tahun {year}</h2>
        <div className="bg-gray-100 p-3 rounded-md mb-4 text-sm space-y-1">
            <p><strong>Indikator:</strong> {indicator?.deskripsi_indikator}</p>
            <p><strong>Satuan:</strong> {indicator?.satuan}</p>
        </div>
        
        <form onSubmit={handleSubmit}>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {loading ? <p>Memuat data...</p> : picList.map((pic, index) => (
                    <div key={pic.id || index} className="flex items-center space-x-2">
                        <select 
                          value={pic.profile_id} 
                          onChange={(e) => handlePicChange(index, 'profile_id', e.target.value)} 
                          className="flex-grow border p-2 rounded-md"
                        >
                            {allProfiles.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                        </select>
                        <input
                            type="text"
                            placeholder="Target"
                            value={pic.target_pk || ''}
                            onChange={(e) => handlePicChange(index, 'target_pk', e.target.value)}
                            className="w-32 border p-2 rounded-md"
                        />
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
                  Close
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

export default KelolaPKProgramModal;