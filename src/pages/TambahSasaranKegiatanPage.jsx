// src/pages/TambahSasaranKegiatanPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { FaPlus, FaTrash } from 'react-icons/fa';

const initialIndicatorState = {
  deskripsi_indikator: '',
  satuan: '',
  pk: false,
  iku: false,
  kondisi_awal: '',
  target_tahun_1: '',
  target_tahun_2: '',
  target_tahun_3: '',
  target_tahun_4: '',
  target_tahun_5: '',
  kondisi_akhir: '',
  target_renja: '',
};

function TambahSasaranKegiatanPage() {
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [kegiatanList, setKegiatanList] = useState([]);
  
  const [selectedDaerahId, setSelectedDaerahId] = useState('');
  const [selectedKegiatanId, setSelectedKegiatanId] = useState('');
  const [deskripsiSasaranKegiatan, setDeskripsiSasaranKegiatan] = useState('');
  const [indicators, setIndicators] = useState([{ ...initialIndicatorState }]);
  
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerangkatDaerah = async () => {
      const { data } = await supabase.from('perangkat_daerah').select('*');
      if (data) setPerangkatDaerahList(data);
    };
    fetchPerangkatDaerah();
  }, []);

  useEffect(() => {
    if (!selectedDaerahId) {
        setKegiatanList([]);
        setSelectedKegiatanId('');
        return;
    };
    const fetchKegiatan = async () => {
        // Memanggil fungsi RPC yang sudah diperbaiki
        const { data } = await supabase.rpc('get_kegiatan_by_pd', { pd_id: selectedDaerahId });
        if(data) setKegiatanList(data);
        else setKegiatanList([]);
    };
    fetchKegiatan();
  }, [selectedDaerahId]);
  
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
    if (indicators.length > 1) {
      const values = [...indicators];
      values.splice(index, 1);
      setIndicators(values);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const { data: sasaranData, error: sasaranError } = await supabase
        .from('renstra_sasaran_kegiatan')
        .insert({ kegiatan_id: selectedKegiatanId, deskripsi_sasaran_kegiatan: deskripsiSasaranKegiatan })
        .select().single();

    if(sasaranError) { 
      alert("Gagal menyimpan Sasaran Kegiatan: " + sasaranError.message);
      setSaving(false);
      return;
    }

    const indicatorsToInsert = indicators.map(ind => ({ ...ind, sasaran_kegiatan_id: sasaranData.id }));
    const { error: indicatorError } = await supabase.from('renstra_indikator_kegiatan').insert(indicatorsToInsert);

    if (indicatorError) {
        alert("Gagal menyimpan Indikator: " + indicatorError.message);
    } else {
        alert('Data Sasaran Kegiatan berhasil disimpan!');
        navigate('/renstra/kegiatan/sasaran');
    }
    setSaving(false);
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Form Tambah Sasaran Kegiatan PD</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Perangkat Daerah</label>
                <select value={selectedDaerahId} onChange={e => setSelectedDaerahId(e.target.value)} required className="w-full border p-2 rounded mt-1">
                    <option value="">Pilih PD</option>
                    {perangkatDaerahList.map(pd => <option key={pd.id} value={pd.id}>{pd.nama_daerah}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Kegiatan PD</label>
                <select value={selectedKegiatanId} onChange={e => setSelectedKegiatanId(e.target.value)} required disabled={!selectedDaerahId} className="w-full border p-2 rounded mt-1">
                    <option value="">Pilih Kegiatan</option>
                    {kegiatanList.map(keg => <option key={keg.id} value={keg.id}>{keg.deskripsi_kegiatan}</option>)}
                </select>
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Sasaran Kegiatan</label>
            <textarea value={deskripsiSasaranKegiatan} onChange={e => setDeskripsiSasaranKegiatan(e.target.value)} required className="w-full border p-2 rounded mt-1" rows="3"></textarea>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">Indikator Sasaran Kegiatan</h3>
          {indicators.map((indicator, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md border relative">
              <button type="button" onClick={() => handleRemoveIndicator(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                <FaTrash />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <input type="text" name="deskripsi_indikator" placeholder="Indikator sasaran *" value={indicator.deskripsi_indikator} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" name="satuan" placeholder="Satuan *" value={indicator.satuan} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
                  <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="pk" checked={indicator.pk} onChange={e => handleIndicatorChange(index, e)} /><span>PK</span></label>
                      <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="iku" checked={indicator.iku} onChange={e => handleIndicatorChange(index, e)} /><span>IKU</span></label>
                  </div>
                </div>
              </div>
              {/* <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cara Pengukuran</label>
                <input type="text" name="cara_pengukuran" placeholder="Cara Pengukuran *" value={indicator.cara_pengukuran} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md w-full" />
              </div> */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mt-4">
                <input type="text" name="kondisi_awal" placeholder="Kondisi Awal *" value={indicator.kondisi_awal} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
                <input type="text" name="target_tahun_1" placeholder="Target 2025 *" value={indicator.target_tahun_1} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
                <input type="text" name="target_tahun_2" placeholder="Target 2026 *" value={indicator.target_tahun_2} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
                <input type="text" name="target_tahun_3" placeholder="Target 2027 *" value={indicator.target_tahun_3} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
                <input type="text" name="target_tahun_4" placeholder="Target 2028 *" value={indicator.target_tahun_4} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
                <input type="text" name="target_tahun_5" placeholder="Target 2029 *" value={indicator.target_tahun_5} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
                <input type="text" name="kondisi_akhir" placeholder="Kondisi Akhir *" value={indicator.kondisi_akhir} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
                <input type="text" name="target_renja" placeholder="Target Renja *" value={indicator.target_renja} onChange={e => handleIndicatorChange(index, e)} required className="border p-2 rounded-md" />
              </div>
            </div>
          ))}
          <button type="button" onClick={handleAddIndicator} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center">
            <FaPlus className="mr-2" />
            Tambah Indikator
          </button>
        </div>

        <div className="flex justify-end space-x-4">
            <Link to="/renstra/kegiatan/sasaran" className="bg-gray-200 py-2 px-4 rounded">Batal</Link>
            <button type="submit" disabled={saving} className="bg-blue-600 text-white py-2 px-4 rounded">{saving ? 'Menyimpan...' : 'Submit'}</button>
        </div>
      </form>
    </div>
  );
}
export default TambahSasaranKegiatanPage;