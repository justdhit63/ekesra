import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaChartBar, FaCog, FaChevronDown, FaFileAlt, FaSignOutAlt, FaBook, FaClipboardList, FaBars, FaFileSignature, FaLandmark, FaAnchor, FaTree } from 'react-icons/fa';
import { supabase } from '../lib/supabaseClient'; // Impor untuk logout
import { FaPerson } from 'react-icons/fa6';

function Sidebar({ isOpen, toggle }) {
  const [isRenstraOpen, setIsRenstraOpen] = useState(false);
  const [isSasaranOpen, setIsSasaranOpen] = useState(false);
  const [isProgramOpen, setIsProgramOpen] = useState(false);
  const [isKegiatanOpen, setIsKegiatanOpen] = useState(false);
  const [isSubKegiatanOpen, setIsSubKegiatanOpen] = useState(false);
  const [isPkOpen, setIsPkOpen] = useState(false);
  const [isTargetPkSasaranOpen, setIsTargetPkSasaranOpen] = useState(false);
  const [isRpdOpen, setIsRpdOpen] = useState(false);

  // Style untuk NavLink yang aktif
  const activeLinkStyle = {
    backgroundColor: '#0c8a36', // bg-green-700
    color: 'white',
  };

  const handleLogout = () => {
    supabase.auth.signOut();
  }

  return (
    <div className={`h-screen bg-green-600 text-white flex flex-col fixed transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      {/* Logo / Header */}
      <div className="p-6 flex items-center justify-between my-2">
        {/* 4. Tampilkan judul hanya jika sidebar terbuka */}
        {isOpen && <h1 className="text-2xl font-medium uppercase">e-Kesra</h1>}
        {/* 5. Tombol untuk memanggil fungsi toggle dari Layout */}
        <button onClick={toggle} className="p-2 rounded-md hover:bg-green-800">
          <FaBars />
        </button>
      </div>
      {/* Menu Navigasi */}
      <nav className="flex-grow p-2 text-sm">
        <ul>
          <li>
            <NavLink
              to="/"
              style={({ isActive }) => isActive ? activeLinkStyle : undefined}
              className="flex items-center p-3 my-1 rounded-md hover:bg-green-800 transition-colors"
            >
              <FaHome size={20} className={isOpen ? 'mr-3' : 'mx-auto'} />
              {isOpen && <span>Dashboard</span>}
            </NavLink>
          </li>
          <div className="border border-green-800 w-3/4 mx-auto my-4"></div>
          <li>
            <NavLink
              to="/penanggung-jawab"
              style={({ isActive }) => isActive ? activeLinkStyle : undefined}
              className="flex items-center p-3 my-1 rounded-md hover:bg-green-800 transition-colors"
            >
              <FaPerson size={20} className={isOpen ? 'mr-3' : 'mx-auto'} />
              {isOpen && <span>Penanggung Jawab</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/tambah-perangkat-daerah"
              style={({ isActive }) => isActive ? activeLinkStyle : undefined}
              className="flex items-center p-3 my-1 rounded-md hover:bg-green-800 transition-colors"
            >
              <FaAnchor size={20} className={isOpen ? 'mr-3' : 'mx-auto'} />
              {isOpen && <span>Perangkat Daerah</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/pk"
              style={({ isActive }) => isActive ? activeLinkStyle : undefined}
              className="flex items-center p-3 my-1 rounded-md hover:bg-green-800 transition-colors"
            >
              <FaFileSignature size={20} className={isOpen ? 'mr-3' : 'mx-auto'} />
              {isOpen && <span>Perjanjian Kinerja</span>}
            </NavLink>
          </li>
          <li>
          <button
              onClick={() => setIsRpdOpen(!isRpdOpen)}
              className="w-full flex justify-between items-center p-3 my-1 rounded-md hover:bg-green-800 transition-colors"
            >
              <div className="flex items-center justify-center">
                <FaLandmark size={20} className={isOpen ? 'mr-3' : 'mx-2'} />
                {isOpen && <span>RPJMB</span>}
              </div>
              {isOpen && <FaChevronDown className={`transition-transform duration-200 ${isRenstraOpen ? 'rotate-180' : ''}`} />}
            </button>
            {isOpen && isRpdOpen && (
              <ul className="pl-4 py-1">
                <li><NavLink to="/rpd/tujuan" className="block p-2 rounded-md hover:bg-green-800 text-sm">Tujuan RPJMB</NavLink></li>
                <li><NavLink to="/rpd/sasaran" className="block p-2 rounded-md hover:bg-green-800 text-sm">Sasaran RPJMB</NavLink></li>
              </ul>
            )}
          </li>
          <li>
            <button
              onClick={() => setIsRenstraOpen(!isRenstraOpen)}
              className="w-full flex justify-between items-center p-3 my-1 rounded-md hover:bg-green-800 transition-colors"
            >
              <div className="flex items-center justify-center">
                <FaBook size={20} className={isOpen ? 'mr-3' : 'mx-2'} />
                {isOpen && <span>Renstra</span>}
              </div>
              {isOpen && <FaChevronDown className={`transition-transform duration-200 ${isRenstraOpen ? 'rotate-180' : ''}`} />}
            </button>
            {/* Sub-menu Renstra */}
            {isOpen && isRenstraOpen && (
              <ul className="pl-8 py-1 bg-green-700 rounded-md pr-2">
                <li>
                  <NavLink to="/renstra/tujuan" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="flex items-center p-2 my-1 rounded-md hover:bg-green-800 transition-colors text-sm">
                    Tujuan
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={() => setIsSasaranOpen(!isSasaranOpen)} // Gunakan state baru untuk sub-dropdown
                    className="w-full flex justify-between items-center p-2 my-1 rounded-md hover:bg-green-800 transition-colors text-sm"
                  >
                    <span>Sasaran</span>
                    <FaChevronDown className={`transition-transform duration-200 ${isSasaranOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isSasaranOpen && (
                    <ul className="pl-4 py-1 text-xs">
                      <li><NavLink to="/renstra/sasaran" className="block p-2 rounded-md hover:bg-green-800">Sasaran</NavLink></li>
                      <li><NavLink to="/renstra/sasaran/penanggung-jawab" className="block p-2 rounded-md hover:bg-green-800">Penanggung Jawab</NavLink></li>
                    </ul>
                  )}
                </li>
                <li>
                  <NavLink to="/renstra/strategi" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="flex items-center p-2 my-1 rounded-md hover:bg-green-800 transition-colors text-sm">
                    Strategi
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/renstra/kebijakan" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="flex items-center p-2 my-1 rounded-md hover:bg-green-800 transition-colors text-sm">
                    Kebijakan
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={() => setIsProgramOpen(!isProgramOpen)}
                    className="w-full flex justify-between items-center p-2 my-1 rounded-md hover:bg-green-800 transition-colors text-sm"
                  >
                    <div className="flex items-center">Program</div>
                    <FaChevronDown className={`transition-transform duration-200 ${isProgramOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isProgramOpen && (
                    <ul className="pl-4 py-1 text-xs">
                      <li><NavLink to="/renstra/program" className="block p-2 rounded-md hover:bg-green-800 ">Program</NavLink></li>
                      <li><NavLink to="/renstra/program/sasaran" className="block p-2 rounded-md hover:bg-green-800 ">Sasaran Program</NavLink></li>
                      <li><NavLink to="/renstra/program/penanggung-jawab" className="block p-2 rounded-md hover:bg-green-800 ">Penanggung Jawab</NavLink></li>
                      {/* Anda bisa menambahkan Penanggung Jawab di sini nanti */}
                    </ul>
                  )}
                </li>
                <li>
                  <button onClick={() => setIsKegiatanOpen(!isKegiatanOpen)} className="w-full flex justify-between items-center p-2 my-1 rounded-md hover:bg-green-800 text-sm">
                    <span>Kegiatan</span>
                    <FaChevronDown className={`transition-transform duration-200 ${isKegiatanOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isKegiatanOpen && (
                    <ul className="pl-4 py-1">
                      <li><NavLink to="/renstra/kegiatan" className="block p-2 rounded-md hover:bg-green-800 text-xs">Kegiatan</NavLink></li>
                      <li><NavLink to="/renstra/kegiatan/sasaran" className="block p-2 rounded-md hover:bg-green-800 text-xs">Sasaran Kegiatan</NavLink></li>
                      <li><NavLink to="/renstra/kegiatan/penanggung-jawab" className="block p-2 rounded-md hover:bg-green-800 text-xs">Penanggung Jawab</NavLink></li>
                      {/* Link lain seperti Sasaran Kegiatan bisa ditambahkan di sini nanti */}
                    </ul>
                  )}
                </li>
                <li>
                  <button onClick={() => setIsSubKegiatanOpen(!isSubKegiatanOpen)} className="w-full flex justify-between items-center p-2 my-1 rounded-md hover:bg-green-800 text-sm">
                    <span>Sub Kegiatan</span>
                    <FaChevronDown className={`transition-transform duration-200 ${isSubKegiatanOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isSubKegiatanOpen && (
                    <ul className="pl-4 py-1">
                      <li><NavLink to="/renstra/sub-kegiatan" className="block p-2 rounded-md hover:bg-green-800 text-xs">Sub Kegiatan</NavLink></li>
                      <li><NavLink to="/renstra/sub-kegiatan/sasaran" className="block p-2 rounded-md hover:bg-green-800 text-xs">Sasaran Sub Kegiatan</NavLink></li>
                      <li><NavLink to="/renstra/sub-kegiatan/penanggung-jawab" className="block p-2 rounded-md hover:bg-green-800 text-xs">Penanggung Jawab</NavLink></li>
                      {/* Link lain bisa ditambahkan di sini */}
                    </ul>
                  )}
                </li>
              </ul>
            )}
          </li>
          <li>
            <button onClick={() => setIsPkOpen(!isPkOpen)} className="w-full flex justify-between items-center p-3 my-1 rounded-md hover:bg-green-800 transition-colors text-sm">
              <div className="flex items-center justify-center">
                <FaFileSignature size={20} className={isOpen ? 'mr-3' : 'mx-2'} />
                {isOpen && <span>Perjanjian Kinerja</span>}
              </div>
              {isOpen && <FaChevronDown className={`transition-transform duration-200 ${isPkOpen ? 'rotate-180' : ''}`} />}
            </button>
            {isOpen && isPkOpen && (
              <ul className="pl-8 py-1 bg-green-700 rounded-md pr-2">
                <li>
                  <button onClick={() => setIsTargetPkSasaranOpen(!isTargetPkSasaranOpen)} className="w-full flex justify-between items-center p-2 my-1 rounded-md hover:bg-green-800 transition-colors text-sm">
                    <span>Target PK Indikator Sasaran</span>
                    <FaChevronDown className={`transition-transform duration-200 ${isTargetPkSasaranOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isTargetPkSasaranOpen && (
                    <ul className="pl-4 py-1 text-xs">
                      <li><NavLink to="/pk/sasaran/tahunan" className="block p-2 rounded-md hover:bg-green-800">Tahunan</NavLink></li>
                      <li><NavLink to="/pk/sasaran/triwulan" className="block p-2 rounded-md hover:bg-green-800">Triwulan</NavLink></li>
                    </ul>
                  )}
                </li>
                <li>
                  <NavLink to="/pk/program/tahunan" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="block p-2 rounded-md hover:bg-green-800 transition-colors text-sm">
                    Target PK Indikator Program
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/pk/program/triwulan" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="block p-2 rounded-md hover:bg-green-800 transition-colors text-sm">
                    Target PK Triwulan Program
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/pk/kegiatan/tahunan" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="block p-2 rounded-md hover:bg-green-800 transition-colors text-sm">
                    Target PK Indikator Kegiatan
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/pk/kegiatan/triwulan" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="block p-2 rounded-md hover:bg-green-800 transition-colors text-sm">
                    Target PK Triwulan Kegiatan
                  </NavLink>
                </li>
                {/* Item menu PK lainnya bisa ditambahkan di sini */}
              </ul>
            )}
          </li>
          <li>
            <NavLink
              to="/laporan"
              style={({ isActive }) => isActive ? activeLinkStyle : undefined}
              className="flex items-center p-3 my-1 rounded-md hover:bg-green-800 transition-colors text-sm"
            >
              <FaChartBar size={20} className={isOpen ? 'mr-3' : 'mx-auto'} />
              {isOpen && <span>Laporan</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/pohon-kinerja"
              style={({ isActive }) => isActive ? activeLinkStyle : undefined}
              className="flex items-center p-3 my-1 rounded-md hover:bg-green-800 transition-colors text-sm"
            >
              <FaTree size={20} className={isOpen ? 'mr-3' : 'mx-auto'} />
              {isOpen && <span>Pohon Kinerja</span>}
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Footer / Logout Button */}
      <div className="p-4 border-t border-green-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center p-3 rounded-md bg-red-600 hover:bg-red-700 transition-colors"
        >
          <FaSignOutAlt size={20} className={isOpen ? 'mr-3' : 'mx-auto'} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;