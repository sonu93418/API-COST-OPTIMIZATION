import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  DollarSign, 
  Bell, 
  Wallet, 
  Lightbulb,
  LogOut,
  User,
  Menu,
  X,
  ChevronRight,
  Zap
} from 'lucide-react';

const Layout = () => {
  const { user, logout, isAdmin } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, description: 'Overview & Analytics' },
    { name: 'API Logs', href: '/logs', icon: FileText, description: 'Request History' },
    { name: 'Test Logger', href: '/test-logger', icon: Zap, description: 'Log Real API Calls' },
    { name: 'Pricing Rules', href: '/pricing', icon: DollarSign, description: 'Cost Configuration' },
    { name: 'Alerts', href: '/alerts', icon: Bell, description: 'Cost Notifications' },
    { name: 'Budgets', href: '/budgets', icon: Wallet, description: 'Spending Limits' },
    { name: 'Optimization', href: '/optimization', icon: Lightbulb, description: 'Cost Savings' },
    { name: 'Profile', href: '/profile', icon: User, description: 'Account Settings' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-6 py-6 border-b border-gray-100 bg-gradient-to-r from-primary-500 to-primary-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  API Cost
                </h1>
                <p className="text-xs text-primary-100">Optimization Platform</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item, index) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 animate-fadeIn ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:shadow-md'
                  }`
                }
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 mr-3" />
                  <div>
                    <span className="font-semibold text-sm">{item.name}</span>
                    <p className={({ isActive }) => 
                      `text-xs mt-0.5 ${isActive ? 'text-primary-100' : 'text-gray-500'}`
                    }>
                      {item.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </NavLink>
            ))}
          </nav>

          {/* User Info */}
          <div className="px-4 py-4 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center mb-3 px-3 py-2">
              <div className="w-11 h-11 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-gray-900">{user?.name || user?.email}</p>
                <p className="text-xs text-gray-500 capitalize flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${user?.role === 'admin' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                  {user?.role}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:shadow-md active:scale-95"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-72' : 'ml-0'}`}>
        <main className="p-4 lg:p-8 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
