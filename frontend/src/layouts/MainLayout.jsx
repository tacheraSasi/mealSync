import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FiHome, FiUsers, FiCalendar, FiMenu, FiLogOut, FiUser, FiSettings } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: FiHome, current: true },
    { name: 'Weekly Plan', href: '/weekly-plan', icon: FiCalendar, current: false },
  ];

  const adminNavigation = [
    { name: 'Menu Management', href: '/admin/menus', icon: FiMenu, current: false },
    { name: 'User Management', href: '/admin/users', icon: FiUsers, current: false },
    { name: 'Settings', href: '/admin/settings', icon: FiSettings, current: false },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile sidebar */}
      <div className={`md:hidden ${mobileSidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileSidebarOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-indigo-700">
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <h1 className="text-white text-2xl font-bold">MealSync</h1>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`${
                      item.current ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-600'
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                  >
                    <item.icon className="mr-4 h-6 w-6 text-indigo-300" />
                    {item.name}
                  </a>
                ))}
                {user?.role === 'admin' &&
                  adminNavigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`${
                        item.current ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-600'
                      } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                    >
                      <item.icon className="mr-4 h-6 w-6 text-indigo-300" />
                      {item.name}
                    </a>
                  ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
              <div className="flex items-center">
                <div>
                  <div className="text-base font-medium text-white">{user?.username}</div>
                  <div className="text-sm font-medium text-indigo-200">{user?.role}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-auto bg-indigo-600 p-1 rounded-full text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
              >
                <FiLogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="flex-shrink-0 w-14">
            {/* Force sidebar to shrink to fit close icon */}
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden md:flex md:flex-shrink-0 ${sidebarOpen ? 'md:w-64' : 'md:w-20'}`}>
        <div className="flex flex-col w-full bg-indigo-700">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className={`text-white text-2xl font-bold ${!sidebarOpen && 'hidden'}`}>MealSync</h1>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="ml-auto text-indigo-200 hover:text-white focus:outline-none"
              >
                {sidebarOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`${
                    item.current ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-600'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <item.icon className="mr-3 flex-shrink-0 h-6 w-6 text-indigo-300" />
                  {sidebarOpen && item.name}
                </a>
              ))}
              {user?.role === 'admin' &&
                adminNavigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`${
                      item.current ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-600'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon className="mr-3 flex-shrink-0 h-6 w-6 text-indigo-300" />
                    {sidebarOpen && item.name}
                  </a>
                ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                <FiUser className="h-6 w-6 text-white" />
              </div>
              {sidebarOpen && (
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{user?.username}</p>
                  <p className="text-xs font-medium text-indigo-200">{user?.role}</p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className={`ml-auto bg-indigo-600 p-1 rounded-full text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white ${
                !sidebarOpen ? 'mx-auto' : ''
              }`}
              title="Logout"
            >
              <FiLogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none bg-gray-50">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
