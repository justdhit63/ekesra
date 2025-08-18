// src/components/TambahTargetPKModal.jsx
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function TambahTargetPKModal({ isOpen, onClose, indicator, year, onSave }) {
  const [target, setTarget] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('pk_tahunan_indikator_sasaran').insert({
      indikator_sasaran_id: indicator.id,
      tahun: year,
      target_pk: target,
    });

    if (error) {
      alert("Gagal menyimpan: " + error.message);
    } else {
      onSave(); // Panggil fungsi onSave dari parent
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Tambah Target PK {year}</h2>
        <p className="text-sm text-gray-600 mb-4">Indikator: {indicator?.deskripsi_indikator}</p>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700">Target</label>
          <input 
            type="text" 
            value={target} 
            onChange={(e) => setTarget(e.target.value)}
            className="mt-1 block w-full border p-2 rounded-md"
            required
          />
          <div className="mt-6 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="bg-gray-200 py-2 px-4 rounded">Batal</button>
            <button type="submit" disabled={saving} className="bg-blue-600 text-white py-2 px-4 rounded">{saving ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default TambahTargetPKModal;