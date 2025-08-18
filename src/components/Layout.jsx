
import Sidebar from './Sidebar';
import { useIdleTimer } from 'react-idle-timer';
import { supabase } from '../lib/supabaseClient'; 
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Header from './Header';

function Layout({ children }) {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleOnIdle = (event) => {
    // Tampilkan pesan dan lakukan logout
    alert('Anda tidak aktif selama 1 jam, sesi Anda akan diakhiri.');
    supabase.auth.signOut();
    navigate('/login'); // Arahkan ke halaman login
  };

  // 4. Atur timer
  const timeout = 1000 * 60 * 120; // Timeout = 1 jam (dalam milidetik)

  // Inisialisasi hook
  useIdleTimer({
    timeout,
    onIdle: handleOnIdle,
    debounce: 500
  });
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
      {/* Area konten utama */}
      <div className={`flex-1 flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
      <Header />
      <main className='flex-1 p-6 overflow-y-auto'>
        {/* ml-64 untuk memberi ruang selebar sidebar */}
          {children}
      </main>
      </div>
    </div>
  );
}

export default Layout;