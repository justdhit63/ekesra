// src/components/Header.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FaUserCircle, FaSignOutAlt, FaUserEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Header() {
  const [session, setSession] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      // Ambil sesi pengguna yang sedang aktif
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    
    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = () => {
    supabase.auth.signOut();
  };

  // Get user display name from session
  const getDisplayName = () => {
    if (!session?.user) return 'Memuat...';
    
    // Try to get full name from user metadata first
    if (session.user.user_metadata?.full_name) {
      return session.user.user_metadata.full_name;
    }
    
    // Fallback to email
    return session.user.email || 'Pengguna';
  };

  return (
    <header className="bg-white shadow-md w-full p-4 flex justify-between items-center">
      {/* Sisi Kiri Header */}
      <h1 className="text-xl font-medium text-gray-800">Dinas Kesehatan</h1>
      
      {/* Sisi Kanan Header */}
      <div className="flex items-center space-x-4 relative">
        <span className="text-gray-700 font-medium hidden sm:block">
          {getDisplayName()}
        </span>
        
        {/* Ikon Profil dengan Dropdown */}
        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="focus:outline-none">
          <FaUserCircle size={28} className="text-gray-600 hover:text-blue-600" />
        </button>

        {/* Menu Dropdown */}
        {isDropdownOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
            <Link
              to="/pengaturan/profil"
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              onClick={() => setIsDropdownOpen(false)}
            >
              <FaUserEdit className="mr-3" />
              Profil Saya
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <FaSignOutAlt className="mr-3" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;