// src/components/SasaranStrategiAccordion.jsx
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FaChevronDown, FaPlus, FaTrash } from 'react-icons/fa';

function SasaranStrategiAccordion({ sasaran, onDataChange }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newStrategi, setNewStrategi] = useState('');

  const handleSaveNewStrategi = async () => {
    if (newStrategi.trim() === '') return;

    const { error } = await supabase.from('renstra_strategi').insert({
      sasaran_id: sasaran.id,
      deskripsi_strategi: newStrategi,
    });

    if (error) {
      alert(error.message);
    } else {
      setNewStrategi('');
      setIsAdding(false);
      onDataChange(); // Refresh data di halaman induk
    }
  };

  const handleDeleteStrategi = async (strategiId) => {
    if (window.confirm("Yakin ingin menghapus strategi ini?")) {
      const { error } = await supabase.from('renstra_strategi').delete().eq('id', strategiId);
      if (error) alert(error.message);
      else onDataChange();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-green-600 text-white p-3 flex justify-between items-center rounded-t-lg"
      >
        <span className="font-semibold text-left">» Sasaran Perangkat Daerah: {sasaran.deskripsi_sasaran}</span>
        <FaChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="p-4 border-l border-r border-b rounded-b-lg border-gray-200">
          <div className="rounded-lg shadow-md border border-gray-200 p-4 mb-2">
            <h3 className="font-semibold text-gray-700 mb-2">Strategi PD</h3>
            <div className="space-y-2">
              {sasaran.renstra_strategi.map(strategi => (
                <div key={strategi.id} className="flex justify-between items-center bg-gray-50 border border-gray-200 shadow-md p-2 rounded">
                  <p className="text-sm">{strategi.deskripsi_strategi}</p>
                  <button onClick={() => handleDeleteStrategi(strategi.id)} className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {isAdding && (
            <div className="mt-4">
              <textarea
                value={newStrategi}
                onChange={(e) => setNewStrategi(e.target.value)}
                placeholder="Tulis strategi baru di sini..."
                className="w-full border rounded p-2"
                rows="3"
              ></textarea>
              <div className="flex justify-end space-x-2 mt-2">
                <button onClick={() => setIsAdding(false)} className="bg-gray-200 text-gray-800 py-1 px-3 rounded text-sm">Batal</button>
                <button onClick={handleSaveNewStrategi} className="bg-green-600 text-white py-1 px-3 rounded text-sm">Simpan</button>
              </div>
            </div>
          )}

          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded inline-flex items-center text-sm"
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

export default SasaranStrategiAccordion;