// src/App.jsx
import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';

// Layout & Halaman
import Layout from './components/Layout'; // Impor Layout
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';
import DetailPerencanaan from './pages/DetailPerencanaan';
import RenstraTujuanPage from './pages/RenstraTujuanPage';
import TambahTujuanPage from './pages/TambahTujuanPage';
import RenstraSasaranPage from './pages/RenstraSasaranPage';
import TambahSasaranPage from './pages/TambahSasaranPage';
import PenanggungJawabPage from './pages/PenanggungJawab';
import EditSasaranPage from './pages/EditSasaranPage';
import EditTujuanPage from './pages/EditTujuanPage';
import RenstraStrategiPage from './pages/RenstraStrategiPage';
import RenstraKebijakanPage from './pages/RenstraKebijakanPage';
import RenstraProgramPage from './pages/RenstraProgramPage';
import TambahProgramPage from './pages/TambahProgramPage';
import EditProgramPage from './pages/EditProgramPage';
import SasaranProgramPage from './pages/SasaranProgramPage';
import TambahSasaranProgramPage from './pages/TambahSasaranProgramPage';
import EditSasaranProgramPage from './pages/EditSasaranProgram';
import PJProgramPage from './pages/PJProgramPage';
import RenstraKegiatanPage from './pages/RenstraKegiatanPage';
import TambahKegiatanPage from './pages/TambahKegiatanPage';
import SasaranKegiatanPage from './pages/SasaranKegiatanPage';
import TambahSasaranKegiatanPage from './pages/TambahSasaranKegiatanPage';
import EditKegiatanPage from './pages/EditKegiatanPage';
import EditSasaranKegiatanPage from './pages/EditSasaranKegiatanPage';
import TambahIndikatorKegiatanPage from './pages/TambahIndikatorKegiatanPage';
import PJKegiatanPage from './pages/PJKegiatanPage';
import RenstraSubKegiatanPage from './pages/RenstraSubKegiatanPage';
import TambahSubKegiatanPage from './pages/TambahSubKegiatanPage';
import EditSubKegiatanPage from './pages/EditSubKegiatanPage';
import SasaranSubKegiatanPage from './pages/SasaranSubKegiatanPage';
import TambahSasaranSubKegiatanPage from './pages/TambahSasaranSubKegiatanPage';
import EditSasaranSubKegiatanPage from './pages/EditSasaranSubKegiatanPage';
import TambahIndikatorSubKegiatanPage from './pages/TambahIndikatorSubKegiatanPage';
import PJSubKegiatanPage from './pages/PJSubKegiatanPage';
import PKTahunanSasaranPage from './pages/PKTahunanSasaranPage';
import PKTahunanProgramPage from './pages/PKTahunanProgramPage';
import PKTahunanKegiatanPage from './pages/PKTahunanKegiatanPage';
import LaporanRenstraPage from './pages/LaporanRenstraPage';
import PohonKinerjaPage from './pages/PohonKinerjaPage';
import TujuanRpdPage from './pages/TujuanRpdPage';
import TambahTujuanRpdPage from './pages/TambahTujuanRpdPage';
import EditTujuanRpdPage from './pages/EditTujuanRpdPage';
import SasaranRpdPage from './pages/SasaranRpdPage';
import TambahSasaranRpdPage from './pages/TambahSasaranRpdPage';
import EditSasaranRpdPage from './pages/EditSasaranRpdPage';
import TambahIndikatorTujuanRpdPage from './pages/TambahIndikatorTujuanRpdPage';
import TambahIndikatorSasaranRpdPage from './pages/TambahIndikatorSasaranPage';
import TambahPerangkatDaerahPage from './pages/TambahPerangkatDaerahPage';
import PKTriwulanSasaranPage from './pages/PKTriwulanSasaranPage';
import PKTriwulanProgramPage from './pages/PKTriwulanProgramPage';

// Buat halaman placeholder untuk contoh
const LaporanPage = () => <div><h1>Halaman Laporan</h1></div>;
const ProfilPage = () => <div><h1>Halaman Profil Saya</h1></div>;
const AkunPage = () => <div><h1>Halaman Manajemen Akun</h1></div>;
const SasaranPage = () => <div><h1>Halaman Renstra Sasaran</h1></div>;
const StrategiPage = () => <div><h1>Halaman Renstra Strategi</h1></div>;

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // console.log("Auth State Changed:", { _event, session });
      setSession(session);
      setLoading(false);
      // if (_event === 'SIGNED_IN') {
      //   navigate('/');
      // }
      if (_event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return null; // atau <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Rute yang dilindungi dan menggunakan Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <Dashboard session={session} />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/perencanaan/:id"
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <DetailPerencanaan session={session} />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tambah-perangkat-daerah"
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <TambahPerangkatDaerahPage session={session} />
            </Layout>
          </ProtectedRoute>
        }
      />
      {/* <Route path="/renstra-tujuan" element={...} /> */}

      {/* Menjadi rute baru di bawah ini */}
      <Route
        path="/renstra/tujuan"
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <RenstraTujuanPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/renstra/tujuan/tambah" // Rute untuk form
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <TambahTujuanPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/renstra/tujuan/edit/:id" // Rute dinamis untuk edit tujuan
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <EditTujuanPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Tambahkan rute baru untuk item menu lainnya */}
      <Route
        path="/renstra/sasaran"
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <RenstraSasaranPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/renstra/sasaran/tambah" // Rute untuk form tambah sasaran
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <TambahSasaranPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/renstra/sasaran/edit/:id" // Rute dinamis dengan parameter :id
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <EditSasaranPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/renstra/sasaran/penanggung-jawab"
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <PenanggungJawabPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/renstra/strategi"
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <RenstraStrategiPage /> {/* Gunakan komponen yang benar */}
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/renstra/kebijakan"
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <RenstraKebijakanPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/renstra/program"
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <RenstraProgramPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/renstra/program/tambah"
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <TambahProgramPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/renstra/program/edit/:id"
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <EditProgramPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/renstra/program/sasaran"
        element={
          <ProtectedRoute session={session}>
            <Layout><SasaranProgramPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/renstra/program/sasaran/tambah"
        element={
          <ProtectedRoute session={session}>
            <Layout><TambahSasaranProgramPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/renstra/program/sasaran/edit/:id"
        element={
          <ProtectedRoute session={session}>
            <Layout><EditSasaranProgramPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/renstra/program/penanggung-jawab"
        element={
          <ProtectedRoute session={session}>
            <Layout><PJProgramPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/renstra/kegiatan"
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <RenstraKegiatanPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/renstra/kegiatan/tambah"
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <TambahKegiatanPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/renstra/kegiatan/sasaran"
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <SasaranKegiatanPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/renstra/kegiatan/sasaran/tambah"
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <TambahSasaranKegiatanPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/renstra/kegiatan/edit/:id"
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <EditKegiatanPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/renstra/kegiatan/sasaran/edit/:id"
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <EditSasaranKegiatanPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/renstra/kegiatan/sasaran/:sasaranId/tambah-indikator"
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <TambahIndikatorKegiatanPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/renstra/kegiatan/penanggung-jawab"
        element={
          <ProtectedRoute session={session}>
            <Layout><PJKegiatanPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/renstra/sub-kegiatan"
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <RenstraSubKegiatanPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/renstra/sub-kegiatan/tambah"
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <TambahSubKegiatanPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/renstra/sub-kegiatan/edit/:id"
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <EditSubKegiatanPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/renstra/sub-kegiatan/sasaran"
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <SasaranSubKegiatanPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/renstra/sub-kegiatan/sasaran/tambah"
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <TambahSasaranSubKegiatanPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/renstra/sub-kegiatan/sasaran/edit/:id"
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <EditSasaranSubKegiatanPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/renstra/sub-kegiatan/sasaran/:sasaranId/tambah-indikator"
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <TambahIndikatorSubKegiatanPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/renstra/sub-kegiatan/penanggung-jawab"
        element={
          <ProtectedRoute session={session}>
            <Layout><PJSubKegiatanPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pk/sasaran/tahunan"
        element={
          <ProtectedRoute session={session}>
            <Layout><PKTahunanSasaranPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pk/sasaran/triwulan"
        element={
          <ProtectedRoute session={session}>
            <Layout><PKTriwulanSasaranPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pk/program/tahunan"
        element={
          <ProtectedRoute session={session}>
            <Layout><PKTahunanProgramPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pk/program/triwulan"
        element={
          <ProtectedRoute session={session}>
            <Layout><PKTriwulanProgramPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pk/kegiatan/tahunan"
        element={
          <ProtectedRoute session={session}>
            <Layout><PKTahunanKegiatanPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/laporan"
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <LaporanRenstraPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pohon-kinerja"
        element={
          <ProtectedRoute session={session}>
            <Layout><PohonKinerjaPage /></Layout>
          </ProtectedRoute>
        }
      />
      {/* Rute untuk Tujuan RPD */}
      <Route path="/rpd/tujuan" element={<ProtectedRoute session={session}><Layout><TujuanRpdPage /></Layout></ProtectedRoute>} />
      <Route path="/rpd/tujuan/tambah" element={<ProtectedRoute session={session}><Layout><TambahTujuanRpdPage /></Layout></ProtectedRoute>} />
      <Route path="/rpd/tujuan/edit/:id" element={<ProtectedRoute session={session}><Layout><EditTujuanRpdPage /></Layout></ProtectedRoute>} />
      <Route
        path="/rpd/tujuan/:tujuanId/tambah-indikator"
        element={
          <ProtectedRoute session={session}>
            <Layout><TambahIndikatorTujuanRpdPage /></Layout>
          </ProtectedRoute>
        }
      />

      {/* Rute untuk Sasaran RPD */}
      <Route path="/rpd/sasaran" element={<ProtectedRoute session={session}><Layout><SasaranRpdPage /></Layout></ProtectedRoute>} />
      <Route path="/rpd/sasaran/tambah" element={<ProtectedRoute session={session}><Layout><TambahSasaranRpdPage /></Layout></ProtectedRoute>} />
      <Route path="/rpd/sasaran/edit/:id" element={<ProtectedRoute session={session}><Layout><EditSasaranRpdPage /></Layout></ProtectedRoute>} />
      <Route
        path="/rpd/sasaran/:sasaranId/tambah-indikator"
        element={
          <ProtectedRoute session={session}>
            <Layout><TambahIndikatorSasaranRpdPage /></Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/pengaturan/profil"
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <ProfilPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pengaturan/akun"
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <AkunPage />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;