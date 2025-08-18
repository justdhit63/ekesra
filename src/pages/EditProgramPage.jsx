// src/pages/EditProgramPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function EditProgramPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [sasaranList, setSasaranList] = useState([]);
  const [selectedSasaranId, setSelectedSasaranId] = useState('');
  const [deskripsiProgram, setDeskripsiProgram] = useState('');
  const [sumberAnggaran, setSumberAnggaran] = useState('');
  const [anggaran, setAnggaran] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Ambil data program yang akan diedit
      const { data: programData, error } = await supabase
        .from('renstra_program')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        alert("Gagal mengambil data program!");
        navigate('/renstra/program');
      } else {
        // Isi state form dengan data yang ada
        setSelectedSasaranId(programData.sasaran_id);
        setDeskripsiProgram(programData.deskripsi_program);
        setSumberAnggaran(programData.sumber_anggaran);
        setAnggaran({
          tahun1: programData.anggaran_tahun_1,
          tahun2: programData.anggaran_tahun_2,
          tahun3: programData.anggaran_tahun_3,
          tahun4: programData.anggaran_tahun_4,
          tahun5: programData.anggaran_tahun_5,
          renja: programData.anggaran_renja,
        });
      }
      
      const { data: sasaranDataList } = await supabase.from('renstra_sasaran').select('*');
      if (sasaranDataList) setSasaranList(sasaranDataList);

      setLoading(false);
    };

    fetchData();
  }, [id, navigate]);

  const handleAnggaranChange = (e) => {
    const { name, value } = e.target;
    setAnggaran(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('renstra_program')
      .update({
        sasaran_id: selectedSasaranId,
        deskripsi_program: deskripsiProgram,
        sumber_anggaran: sumberAnggaran,
        anggaran_tahun_1: anggaran.tahun1,
        anggaran_tahun_2: anggaran.tahun2,
        anggaran_tahun_3: anggaran.tahun3,
        anggaran_tahun_4: anggaran.tahun4,
        anggaran_tahun_5: anggaran.tahun5,
        anggaran_renja: anggaran.renja,
      })
      .eq('id', id);

    if (error) {
      alert('Gagal memperbarui program: ' + error.message);
    } else {
      alert('Data Renstra Program berhasil diperbarui!');
      navigate('/renstra/program');
    }
    setSaving(false);
  };

  if (loading) return <div className="p-6">Memuat data...</div>;

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Form Edit Renstra Program</h1>
      
      <form onSubmit={handleUpdate} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div>
            <label className="block text-sm font-medium text-gray-700">Sasaran</label>
            <select value={selectedSasaranId} onChange={(e) => setSelectedSasaranId(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
              <option value="">Pilih Sasaran</option>
              {sasaranList.map(s => <option key={s.id} value={s.id}>{s.deskripsi_sasaran}</option>)}
            </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Program</label>
          <textarea value={deskripsiProgram} onChange={(e) => setDeskripsiProgram(e.target.value)} rows="3" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"></textarea>
        </div>
        
        <div>
            <label className="block text-sm font-medium text-gray-700">Sumber Anggaran</label>
            <input type="text" value={sumberAnggaran} onChange={(e) => setSumberAnggaran(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"/>
        </div>

        <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Anggaran Program (Rp)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <input type="number" name="tahun1" placeholder="Anggaran 2025" value={anggaran.tahun1 || ''} onChange={handleAnggaranChange} required className="border p-2 rounded-md" />
                <input type="number" name="tahun2" placeholder="Anggaran 2026" value={anggaran.tahun2 || ''} onChange={handleAnggaranChange} required className="border p-2 rounded-md" />
                <input type="number" name="tahun3" placeholder="Anggaran 2027" value={anggaran.tahun3 || ''} onChange={handleAnggaranChange} required className="border p-2 rounded-md" />
                <input type="number" name="tahun4" placeholder="Anggaran 2028" value={anggaran.tahun4 || ''} onChange={handleAnggaranChange} required className="border p-2 rounded-md" />
                <input type="number" name="tahun5" placeholder="Anggaran 2029" value={anggaran.tahun5 || ''} onChange={handleAnggaranChange} required className="border p-2 rounded-md" />
                <input type="number" name="renja" placeholder="Anggaran Renja" value={anggaran.renja || ''} onChange={handleAnggaranChange} required className="border p-2 rounded-md" />
            </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Link to="/renstra/program" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300">
            {saving ? 'Menyimpan...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProgramPage;