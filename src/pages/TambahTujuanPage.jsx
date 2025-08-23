// src/pages/TambahTujuanPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { FaPlus, FaTrash } from 'react-icons/fa';

const initialIndicatorState = {
  deskripsi_indikator: '',
  satuan: '',
  kondisi_awal: '',
  target_tahun_1: '',
  target_tahun_2: '',
  target_tahun_3: '',
  target_tahun_4: '',
  target_tahun_5: '',
  kondisi_akhir: '',
};

function TambahTujuanPage() {
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [sasaranRpdList, setSasaranRpdList] = useState([]);
  
  const [selectedDaerahId, setSelectedDaerahId] = useState('');
  const [selectedSasaranRpdId, setSelectedSasaranRpdId] = useState('');
  const [deskripsiTujuan, setDeskripsiTujuan] = useState('');
  const [indicators, setIndicators] = useState([{...initialIndicatorState}]); // Gunakan spread operator
  
  const [saving, setSaving] = useState(false); // Diubah dari loading ke saving
  const navigate = useNavigate();

  // Fetch Perangkat Daerah dan Sasaran RPD
  useEffect(() => {
    const fetchPerangkatDaerah = async () => {
      const { data } = await supabase.from('perangkat_daerah').select('*');
      if (data) setPerangkatDaerahList(data);
    };
    
    const fetchSasaranRpd = async () => {
      const { data } = await supabase.from('sasaran_rpd').select('*');
      if (data) setSasaranRpdList(data);
    };

    fetchPerangkatDaerah();
    fetchSasaranRpd();
  }, []);

  // Handler untuk input indikator dinamis
  const handleIndicatorChange = (index, event) => {
    const values = [...indicators];
    values[index][event.target.name] = event.target.value;
    setIndicators(values);
  };

  const handleAddIndicator = () => {
    setIndicators([...indicators, { ...initialIndicatorState }]); // Gunakan spread operator
  };

  const handleRemoveIndicator = (index) => {
    if (indicators.length > 1) { // Menjaga agar minimal ada satu baris
        const values = [...indicators];
        values.splice(index, 1);
        setIndicators(values);
    }
  };
  
  // Handler untuk submit form
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    // 1. Insert data ke tabel renstra_tujuan
    const { data: tujuanData, error: tujuanError } = await supabase
      .from('renstra_tujuan')
      .insert({
        sasaran_rpd_id: selectedSasaranRpdId,
        perangkat_daerah_id: selectedDaerahId,
        deskripsi_tujuan: deskripsiTujuan,
      })
      .select()
      .single();

    if (tujuanError) {
      alert('Gagal menyimpan tujuan: ' + tujuanError.message);
      setSaving(false);
      return;
    }

    // 2. Siapkan data indikator dengan tujuan_id yang baru
    const indicatorsToInsert = indicators.map(indicator => ({
      ...indicator,
      tujuan_id: tujuanData.id,
    }));

    // 3. Insert data ke tabel renstra_indikator
    const { error: indicatorError } = await supabase
      .from('renstra_indikator')
      .insert(indicatorsToInsert);

    if (indicatorError) {
      alert('Gagal menyimpan indikator: ' + indicatorError.message);
    } else {
      alert('Data Renstra Tujuan berhasil disimpan!');
      navigate('/renstra/tujuan');
    }
    setSaving(false);
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Form Tambah Renstra Tujuan</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Perangkat Daerah</label>
            <select value={selectedDaerahId} onChange={(e) => setSelectedDaerahId(e.target.value)} required className="mt-1 block w-full border p-2 rounded-md">
              <option value="">Pilih PD</option>
              {perangkatDaerahList.map(pd => <option key={pd.id} value={pd.id}>{pd.nama_daerah}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sasaran RPD (Acuan)</label>
            {/* --- PERBAIKAN DI SINI --- */}
            <select value={selectedSasaranRpdId} onChange={(e) => setSelectedSasaranRpdId(e.target.value)} required className="mt-1 block w-full border p-2 rounded-md">
              <option value="">Pilih Sasaran RPD</option>
              {sasaranRpdList.map(s => <option key={s.id} value={s.id}>{s.deskripsi}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tujuan</label>
          <textarea value={deskripsiTujuan} onChange={(e) => setDeskripsiTujuan(e.target.value)} rows="3" required className="mt-1 block w-full border p-2 rounded-md"></textarea>
        </div>

        {/* Indikator Dinamis */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">Indikator Tujuan</h3>
          {indicators.map((indicator, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md border relative">
              <button type="button" onClick={() => handleRemoveIndicator(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                <FaTrash />
              </button>
              {/* Salin JSX dari form Tambah Sasaran Kegiatan untuk layout yang lebih baik */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <input type="text" name="deskripsi_indikator" placeholder="Indikator Tujuan *" value={indicator.deskripsi_indikator} onChange={e => handleIndicatorChange(index, e)} required className="col-span-full border bg-white p-2 rounded-md" />
                  <input type="text" name="satuan" placeholder="Satuan *" value={indicator.satuan} onChange={e => handleIndicatorChange(index, e)} required className="border bg-white p-2 rounded-md" />
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

        <div className="flex justify-end space-x-4">
          <Link to="/renstra/tujuan" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
            Batal
          </Link>
          <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300">
            {saving ? 'Menyimpan...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TambahTujuanPage;