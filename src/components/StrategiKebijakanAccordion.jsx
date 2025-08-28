// src/components/StrategiKebijakanAccordion.jsx
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FaChevronDown, FaPlus, FaTrash } from 'react-icons/fa';

function StrategiKebijakanAccordion({ strategi, onDataChange }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newKebijakan, setNewKebijakan] = useState('');

  const handleSaveNewKebijakan = async () => {
    if (newKebijakan.trim() === '') return;
    const { error } = await supabase.from('renstra_kebijakan').insert({
      strategi_id: strategi.id,
      deskripsi_kebijakan: newKebijakan,
    });

    if (error) {
      alert(error.message);
    } else {
      setNewKebijakan('');
      setIsAdding(false);
      onDataChange();
    }
  };

  const handleDeleteKebijakan = async (kebijakanId) => {
    if (window.confirm("Yakin ingin menghapus kebijakan ini?")) {
      const { error } = await supabase.from('renstra_kebijakan').delete().eq('id', kebijakanId);
      if (error) alert(error.message);
      else onDataChange();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-green-800 text-white p-3 flex justify-between items-center rounded-t-lg"
      >
        <span className="font-semibold text-left">» Strategi PD: {strategi.deskripsi_strategi}</span>
        <FaChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="p-4 border-l border-r border-b rounded-b-lg border-gray-200">
          <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-md">
            <h3 className="font-semibold text-gray-700 mb-2">Kebijakan PD</h3>
            <div className="space-y-2">
              
              {/* --- PERBAIKAN DI SINI --- */}
              {strategi.renstra_kebijakan && strategi.renstra_kebijakan.length > 0 ? (
                strategi.renstra_kebijakan.map(kebijakan => (
                  <div key={kebijakan.id} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-200 shadow-md">
                    <p className="text-sm">{kebijakan.deskripsi_kebijakan}</p>
                    <button onClick={() => handleDeleteKebijakan(kebijakan.id)} className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center text-gray-500">Belum ada kebijakan untuk strategi ini.</p>
              )}
            </div>
          </div>

          {isAdding && (
            <div className="mt-4">
              <textarea
                value={newKebijakan}
                onChange={(e) => setNewKebijakan(e.target.value)}
                placeholder="Tulis kebijakan baru di sini..."
                className="w-full border rounded p-2"
                rows="3"
              ></textarea>
              <div className="flex justify-end space-x-2 mt-2">
                <button onClick={() => setIsAdding(false)} className="bg-gray-200 text-gray-800 py-1 px-3 rounded text-sm">Batal</button>
                <button onClick={handleSaveNewKebijakan} className="bg-green-700 text-white py-1 px-3 rounded text-sm">Simpan</button>
              </div>
            </div>
          )}

          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="mt-4 bg-green-700 hover:bg-green-800 text-white font-bold py-1 px-3 rounded inline-flex items-center text-sm"
            >
              <FaPlus className="mr-2" />
              Tambah Poin
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default StrategiKebijakanAccordion;