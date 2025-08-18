// src/pages/TambahSasaranPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { FaPlus, FaTrash } from 'react-icons/fa';

// State awal untuk satu baris indikator
const initialIndicatorState = {
  deskripsi_indikator: '',
  pk: false,
  iku: false,
  satuan: '',
  cara_pengukuran: '',
  kondisi_awal: '',
  target_tahun_1: '',
  target_tahun_2: '',
  target_tahun_3: '',
  target_tahun_4: '',
  target_tahun_5: '',
  kondisi_akhir: '',
};

function TambahSasaranPage() {
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [selectedDaerahId, setSelectedDaerahId] = useState('');
  const [deskripsiSasaran, setDeskripsiSasaran] = useState('');
  const [indicators, setIndicators] = useState([{ ...initialIndicatorState }]);
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Ambil daftar Perangkat Daerah
  useEffect(() => {
    const fetchPerangkatDaerah = async () => {
      const { data } = await supabase.from('perangkat_daerah').select('*');
      if (data) setPerangkatDaerahList(data);
    };
    fetchPerangkatDaerah();
  }, []);

  // Handler untuk input indikator (termasuk checkbox)
  const handleIndicatorChange = (index, event) => {
    const values = [...indicators];
    const { name, value, type, checked } = event.target;
    values[index][name] = type === 'checkbox' ? checked : value;
    setIndicators(values);
  };

  const handleAddIndicator = () => {
    setIndicators([...indicators, { ...initialIndicatorState }]);
  };

  const handleRemoveIndicator = (index) => {
    const values = [...indicators];
    if (values.length > 1) { // Jaga agar minimal ada satu indikator
      values.splice(index, 1);
      setIndicators(values);
    }
  };
  
  // Handler untuk submit form
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // 1. Simpan data Sasaran
    const { data: sasaranData, error: sasaranError } = await supabase
      .from('renstra_sasaran')
      .insert({
        perangkat_daerah_id: selectedDaerahId,
        deskripsi_sasaran: deskripsiSasaran,
        // Asumsi periode diambil dari konteks lain atau di-hardcode
        periode_awal: 2025, 
        periode_akhir: 2029,
      })
      .select()
      .single();

    if (sasaranError) {
      alert('Gagal menyimpan sasaran: ' + sasaranError.message);
      setLoading(false);
      return;
    }

    // 2. Siapkan dan simpan data Indikator
    const indicatorsToInsert = indicators.map(indicator => ({
      ...indicator,
      sasaran_id: sasaranData.id,
    }));

    const { error: indicatorError } = await supabase
      .from('renstra_indikator_sasaran')
      .insert(indicatorsToInsert);

    if (indicatorError) {
      alert('Gagal menyimpan indikator: ' + indicatorError.message);
    } else {
      alert('Data Renstra Sasaran berhasil disimpan!');
      navigate('/renstra/sasaran');
    }
    setLoading(false);
  };


  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Form Tambah Renstra Sasaran</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div>
            <label className="block text-sm font-medium text-gray-700">Perangkat Daerah</label>
            <select value={selectedDaerahId} onChange={(e) => setSelectedDaerahId(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
              <option value="">Pilih Perangkat Daerah</option>
              {perangkatDaerahList.map(pd => <option key={pd.id} value={pd.id}>{pd.nama_daerah}</option>)}
            </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Sasaran Perangkat Daerah</label>
          <textarea value={deskripsiSasaran} onChange={(e) => setDeskripsiSasaran(e.target.value)} rows="3" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"></textarea>
        </div>

        {/* Indikator Dinamis */}
        <div className="space-y-4">
          {indicators.map((indicator, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md border relative">
               <button type="button" onClick={() => handleRemoveIndicator(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                <FaTrash />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                <input type="text" name="deskripsi_indikator" placeholder="Indikator sasaran *" value={indicator.deskripsi_indikator} onChange={e => handleIndicatorChange(index, e)} required className="border bg-white p-2 rounded-md" />
                <input type="text" name="satuan" placeholder="Satuan *" value={indicator.satuan} onChange={e => handleIndicatorChange(index, e)} required className="border bg-white p-2 rounded-md" />
                <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="pk" checked={indicator.pk} onChange={e => handleIndicatorChange(index, e)} /><span>PK</span></label>
                    <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="iku" checked={indicator.iku} onChange={e => handleIndicatorChange(index, e)} /><span>IKU</span></label>
                </div>
                <input type="text" name="cara_pengukuran" placeholder="Cara Pengukuran *" value={indicator.cara_pengukuran} onChange={e => handleIndicatorChange(index, e)} required className="border bg-white p-2 rounded-md" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mt-4">
                <input type="text" name="kondisi_awal" placeholder="Kondisi Awal *" value={indicator.kondisi_awal} onChange={e => handleIndicatorChange(index, e)} required className="border bg-white p-2 rounded-md" />
                <input type="text" name="target_tahun_1" placeholder="Target 2025 *" value={indicator.target_tahun_1} onChange={e => handleIndicatorChange(index, e)} required className="border bg-white p-2 rounded-md" />
                <input type="text" name="target_tahun_2" placeholder="Target 2026 *" value={indicator.target_tahun_2} onChange={e => handleIndicatorChange(index, e)} required className="border bg-white p-2 rounded-md" />
                <input type="text" name="target_tahun_3" placeholder="Target 2027 *" value={indicator.target_tahun_3} onChange={e => handleIndicatorChange(index, e)} required className="border bg-white p-2 rounded-md" />
                <input type="text" name="target_tahun_4" placeholder="Target 2028 *" value={indicator.target_tahun_4} onChange={e => handleIndicatorChange(index, e)} required className="border bg-white p-2 rounded-md" />
                <input type="text" name="target_tahun_5" placeholder="Target 2029 *" value={indicator.target_tahun_5} onChange={e => handleIndicatorChange(index, e)} required className="border bg-white p-2 rounded-md" />
                <input type="text" name="kondisi_akhir" placeholder="Kondisi Akhir *" value={indicator.kondisi_akhir} onChange={e => handleIndicatorChange(index, e)} required className="border bg-white p-2 rounded-md" />
              </div>
            </div>
          ))}
          <button type="button" onClick={handleAddIndicator} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center">
            <FaPlus className="mr-2" />
            Tambah Indikator
          </button>
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end space-x-4">
          <Link to="/renstra/sasaran" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
            Cancel
          </Link>
          <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300">
            {loading ? 'Menyimpan...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TambahSasaranPage;