import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FaXmark } from 'react-icons/fa6';

function KelolaPJTriwulanModal({ isOpen, onClose, indicator, year, onSave }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileList, setProfileList] = useState([]);
  const [triwulanData, setTriwulanData] = useState([]);
  const [newPJ, setNewPJ] = useState({
    profile_id: '',
    target_tw1: 0,
    target_tw2: 0,
    target_tw3: 0,
    target_tw4: 0,
    realisasi_tw1: 0,
    realisasi_tw2: 0,
    realisasi_tw3: 0,
    realisasi_tw4: 0,
    satuan: indicator?.satuan || 'Unit',
    bobot: 100
  });

  useEffect(() => {
    if (isOpen && indicator && year) {
      fetchProfiles();
      fetchTriwulanData();
    }
  }, [isOpen, indicator, year]);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .order('full_name');

      if (data) {
        setProfileList(data);
      } else {
        console.error('Error fetching profiles:', error);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const fetchTriwulanData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pk_indikator_triwulan')
        .select(`
          *,
          profiles(id, full_name)
        `)
        .eq('indikator_sasaran_id', indicator.id)
        .eq('tahun', year);

      if (data) {
        setTriwulanData(data);
      } else {
        console.error('Error fetching triwulan data:', error);
        setTriwulanData([]);
      }
    } catch (err) {
      console.error('Error:', err);
      setTriwulanData([]);
    }
    setLoading(false);
  };

  const handleAddPJ = async () => {
    if (!newPJ.profile_id) {
      alert('Pilih penanggung jawab terlebih dahulu');
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('pk_indikator_triwulan')
        .insert([{
          indikator_sasaran_id: indicator.id,
          profile_id: newPJ.profile_id,
          tahun: year,
          target_tw1: parseFloat(newPJ.target_tw1) || 0,
          target_tw2: parseFloat(newPJ.target_tw2) || 0,
          target_tw3: parseFloat(newPJ.target_tw3) || 0,
          target_tw4: parseFloat(newPJ.target_tw4) || 0,
          realisasi_tw1: parseFloat(newPJ.realisasi_tw1) || 0,
          realisasi_tw2: parseFloat(newPJ.realisasi_tw2) || 0,
          realisasi_tw3: parseFloat(newPJ.realisasi_tw3) || 0,
          realisasi_tw4: parseFloat(newPJ.realisasi_tw4) || 0,
          satuan: newPJ.satuan,
          bobot: parseFloat(newPJ.bobot) || 100
        }]);

      if (!error) {
        setNewPJ({
          profile_id: '',
          target_tw1: 0,
          target_tw2: 0,
          target_tw3: 0,
          target_tw4: 0,
          realisasi_tw1: 0,
          realisasi_tw2: 0,
          realisasi_tw3: 0,
          realisasi_tw4: 0,
          satuan: indicator?.satuan || 'Unit',
          bobot: 100
        });
        fetchTriwulanData();
      } else {
        console.error('Error adding PJ:', error);
        alert('Gagal menambahkan penanggung jawab');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Terjadi kesalahan');
    }
    setSaving(false);
  };

  const handleUpdateTriwulan = async (id, field, value) => {
    try {
      const { error } = await supabase
        .from('pk_indikator_triwulan')
        .update({ [field]: parseFloat(value) || 0 })
        .eq('id', id);

      if (!error) {
        fetchTriwulanData();
      } else {
        console.error('Error updating:', error);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDeletePJ = async (id) => {
    if (!confirm('Yakin ingin menghapus penanggung jawab ini?')) return;

    try {
      const { error } = await supabase
        .from('pk_indikator_triwulan')
        .delete()
        .eq('id', id);

      if (!error) {
        fetchTriwulanData();
      } else {
        console.error('Error deleting:', error);
        alert('Gagal menghapus data');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Terjadi kesalahan');
    }
  };

  const calculateCapaian = (target, realisasi) => {
    if (!target || target === 0) return 0;
    return ((realisasi / target) * 100).toFixed(2);
  };

  const getCapaianColor = (capaian) => {
    if (capaian >= 100) return 'text-green-600 bg-green-100';
    if (capaian >= 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const handleSaveAndClose = () => {
    onSave();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Kelola Penanggung Jawab Triwulan - {year}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {indicator?.deskripsi_indikator}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaXmark className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Form Tambah PJ */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-4">Tambah Penanggung Jawab Baru</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Penanggung Jawab</label>
                <select
                  value={newPJ.profile_id}
                  onChange={(e) => setNewPJ({...newPJ, profile_id: e.target.value})}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value="">Pilih Penanggung Jawab</option>
                  {profileList.map(profile => (
                    <option key={profile.id} value={profile.id}>
                      {profile.full_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Satuan</label>
                <select
                  value={newPJ.satuan}
                  onChange={(e) => setNewPJ({...newPJ, satuan: e.target.value})}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value="Unit">Unit</option>
                  <option value="Persen">Persen</option>
                  <option value="Rupiah">Rupiah</option>
                  <option value="Orang">Orang</option>
                  <option value="Kegiatan">Kegiatan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bobot (%)</label>
                <input
                  type="number"
                  value={newPJ.bobot}
                  onChange={(e) => setNewPJ({...newPJ, bobot: e.target.value})}
                  className="w-full p-2 border rounded text-sm"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {/* Target Triwulan */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Target TW I</label>
                <input
                  type="number"
                  value={newPJ.target_tw1}
                  onChange={(e) => setNewPJ({...newPJ, target_tw1: e.target.value})}
                  className="w-full p-2 border rounded text-sm"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Target TW II</label>
                <input
                  type="number"
                  value={newPJ.target_tw2}
                  onChange={(e) => setNewPJ({...newPJ, target_tw2: e.target.value})}
                  className="w-full p-2 border rounded text-sm"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Target TW III</label>
                <input
                  type="number"
                  value={newPJ.target_tw3}
                  onChange={(e) => setNewPJ({...newPJ, target_tw3: e.target.value})}
                  className="w-full p-2 border rounded text-sm"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Target TW IV</label>
                <input
                  type="number"
                  value={newPJ.target_tw4}
                  onChange={(e) => setNewPJ({...newPJ, target_tw4: e.target.value})}
                  className="w-full p-2 border rounded text-sm"
                  step="0.01"
                />
              </div>
            </div>

            <button
              onClick={handleAddPJ}
              disabled={saving || !newPJ.profile_id}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 text-sm"
            >
              {saving ? 'Menyimpan...' : 'Tambah Penanggung Jawab'}
            </button>
          </div>

          {/* Tabel Data Triwulan */}
          <div className="border rounded-lg overflow-hidden">
            <h3 className="font-semibold p-4 bg-gray-100 border-b">
              Data Penanggung Jawab Triwulan
            </h3>
            
            {loading ? (
              <p className="p-4 text-center text-gray-500">Memuat data...</p>
            ) : triwulanData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left">Penanggung Jawab</th>
                      <th className="p-3 text-center">TW I</th>
                      <th className="p-3 text-center">TW II</th>
                      <th className="p-3 text-center">TW III</th>
                      <th className="p-3 text-center">TW IV</th>
                      <th className="p-3 text-center">Total</th>
                      <th className="p-3 text-center">Capaian</th>
                      <th className="p-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {triwulanData.map((item) => {
                      const totalTarget = item.target_tw1 + item.target_tw2 + item.target_tw3 + item.target_tw4;
                      const totalRealisasi = item.realisasi_tw1 + item.realisasi_tw2 + item.realisasi_tw3 + item.realisasi_tw4;
                      const capaian = calculateCapaian(totalTarget, totalRealisasi);

                      return (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div className="font-medium">{item.profiles?.full_name}</div>
                            <div className="text-xs text-gray-500">
                              {item.satuan} • Bobot: {item.bobot}%
                            </div>
                          </td>
                          
                          {/* TW I */}
                          <td className="p-3 text-center">
                            <div className="space-y-1">
                              <input
                                type="number"
                                value={item.target_tw1}
                                onChange={(e) => handleUpdateTriwulan(item.id, 'target_tw1', e.target.value)}
                                className="w-16 p-1 border rounded text-xs text-center"
                                title="Target TW I"
                              />
                              <input
                                type="number"
                                value={item.realisasi_tw1}
                                onChange={(e) => handleUpdateTriwulan(item.id, 'realisasi_tw1', e.target.value)}
                                className="w-16 p-1 border rounded text-xs text-center bg-yellow-50"
                                title="Realisasi TW I"
                              />
                            </div>
                          </td>

                          {/* TW II */}
                          <td className="p-3 text-center">
                            <div className="space-y-1">
                              <input
                                type="number"
                                value={item.target_tw2}
                                onChange={(e) => handleUpdateTriwulan(item.id, 'target_tw2', e.target.value)}
                                className="w-16 p-1 border rounded text-xs text-center"
                                title="Target TW II"
                              />
                              <input
                                type="number"
                                value={item.realisasi_tw2}
                                onChange={(e) => handleUpdateTriwulan(item.id, 'realisasi_tw2', e.target.value)}
                                className="w-16 p-1 border rounded text-xs text-center bg-yellow-50"
                                title="Realisasi TW II"
                              />
                            </div>
                          </td>

                          {/* TW III */}
                          <td className="p-3 text-center">
                            <div className="space-y-1">
                              <input
                                type="number"
                                value={item.target_tw3}
                                onChange={(e) => handleUpdateTriwulan(item.id, 'target_tw3', e.target.value)}
                                className="w-16 p-1 border rounded text-xs text-center"
                                title="Target TW III"
                              />
                              <input
                                type="number"
                                value={item.realisasi_tw3}
                                onChange={(e) => handleUpdateTriwulan(item.id, 'realisasi_tw3', e.target.value)}
                                className="w-16 p-1 border rounded text-xs text-center bg-yellow-50"
                                title="Realisasi TW III"
                              />
                            </div>
                          </td>

                          {/* TW IV */}
                          <td className="p-3 text-center">
                            <div className="space-y-1">
                              <input
                                type="number"
                                value={item.target_tw4}
                                onChange={(e) => handleUpdateTriwulan(item.id, 'target_tw4', e.target.value)}
                                className="w-16 p-1 border rounded text-xs text-center"
                                title="Target TW IV"
                              />
                              <input
                                type="number"
                                value={item.realisasi_tw4}
                                onChange={(e) => handleUpdateTriwulan(item.id, 'realisasi_tw4', e.target.value)}
                                className="w-16 p-1 border rounded text-xs text-center bg-yellow-50"
                                title="Realisasi TW IV"
                              />
                            </div>
                          </td>

                          {/* Total */}
                          <td className="p-3 text-center">
                            <div className="text-xs">
                              <div className="font-medium">T: {totalTarget}</div>
                              <div className="text-yellow-600">R: {totalRealisasi}</div>
                            </div>
                          </td>

                          {/* Capaian */}
                          <td className="p-3 text-center">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getCapaianColor(capaian)}`}>
                              {capaian}%
                            </span>
                          </td>

                          {/* Aksi */}
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleDeletePJ(item.id)}
                              className="text-red-500 hover:text-red-700 text-xs"
                              title="Hapus"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="p-4 text-center text-gray-500">
                Belum ada penanggung jawab untuk tahun ini.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            onClick={handleSaveAndClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Simpan & Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

export default KelolaPJTriwulanModal;