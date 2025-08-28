import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

const CRUDPenanggungJawabPage = () => {
    const [penanggungJawab, setPenanggungJawab] = useState([]);
    const [formData, setFormData] = useState([{ nama: '', jabatan: '' }]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    useEffect(() => {
        getPenanggungJawab();
    }, []);

    async function getPenanggungJawab() {
        const { data, error } = await supabase
            .from('penanggung_jawab')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching data:", error);
        }
        else {
            setPenanggungJawab(data);
        }
    }

    function handleChange(event) {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value,
            }
        })
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (isEditing) {
            const { error } = await supabase
                .from('penanggung_jawab')
                .update({ nama: formData.nama, jabatan: formData.jabatan })
                .eq('id', currentId);
            if (error) {
                console.error('Error updating data:', error);
            } else {
                setIsEditing(false); // Keluar dari mode edit
                setCurrentId(null);
            }
        }

        else {
            // --- CREATE ---
            const { error } = await supabase
              .from('penanggung_jawab')
              .insert([{ nama: formData.nama, jabatan: formData.jabatan }]);
      
            if (error) {
              console.error('Error inserting data:', error);
            }
          }
          
          // Reset form dan ambil data terbaru
          setFormData({ nama: '', jabatan: '' });
          getPenanggungJawab();
    }

    async function handleDelete(id) {
        // Konfirmasi sebelum menghapus
        if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
          const { error } = await supabase
            .from('penanggung_jawab')
            .delete()
            .eq('id', id);
    
          if (error) {
            console.error('Error deleting data:', error);
          }
          
          // Ambil data terbaru
          getPenanggungJawab();
        }
      }
    
      // Fungsi untuk masuk ke mode edit
      function handleEdit(pj) {
        setIsEditing(true);
        setCurrentId(pj.id);
        setFormData({ nama: pj.nama, jabatan: pj.jabatan });
      }

    return (
        <>
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Data Penanggung Jawab</h1>
                
                {/* Form */}
                <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-2">
                                Nama
                            </label>
                            <input
                                type="text"
                                id="nama"
                                name="nama"
                                value={formData.nama}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="jabatan" className="block text-sm font-medium text-gray-700 mb-2">
                                Jabatan
                            </label>
                            <input
                                type="text"
                                id="jabatan"
                                name="jabatan"
                                value={formData.jabatan}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <button
                            type="submit"
                            className={`px-6 py-2 rounded-md text-white font-medium ${
                                isEditing 
                                    ? 'bg-yellow-500 hover:bg-yellow-600' 
                                    : 'bg-blue-500 hover:bg-blue-600'
                            } transition duration-200`}
                        >
                            {isEditing ? 'Update' : 'Tambah'}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setCurrentId(null);
                                    setFormData({ nama: '', jabatan: '' });
                                }}
                                className="ml-2 px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium transition duration-200"
                            >
                                Batal
                            </button>
                        )}
                    </div>
                </form>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    No
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nama
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Jabatan
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {penanggungJawab.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                        Tidak ada data
                                    </td>
                                </tr>
                            ) : (
                                penanggungJawab.map((pj, index) => (
                                    <tr key={pj.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {pj.nama}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {pj.jabatan}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(pj)}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(pj.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </>
    )
}

export default CRUDPenanggungJawabPage
