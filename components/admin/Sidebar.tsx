"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Calendar, Users, Shield, LogOut, Menu, X, Code, BookOpen } from 'lucide-react';
import { logout } from '../../lib/auth';
import { permissions } from '../../lib/permissions';
import api from '@/lib/api';
import { HiMiniUserGroup, HiUser } from "react-icons/hi2";
import Image from 'next/image';
import { IMAGES } from '@/constants/assets';

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    let isMounted = true;
    api
      .get("/users/profile")
      .then((res) => {
        if (!isMounted) return;
        setUser(res.data?.user || res.data?.data?.user || null);
        setLoadingUser(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        const status = err?.response?.status;
        if (status === 401 || status === 403) router.replace("/admin");
        setUser(null);
        setLoadingUser(false);
      });
    return () => {
      isMounted = false;
    };
  }, [router]);

  const canViewUsers = user ? permissions.canViewUsers(user.role) : false;
  const canViewTeams = user ? permissions.canViewTeams(user.role) : false;
  const canViewSecurity = user ? permissions.canViewSecurity(user.role) : false;

  const navItems = [
    { icon: Home, label: 'Dashboard', href: '/admin/dashboard', active: pathname === '/admin/dashboard' },
    { icon: Calendar, label: 'Events', href: '/admin/dashboard/events', active: pathname?.startsWith('/admin/dashboard/events') },
    { icon: BookOpen, label: 'Workshops', href: '/admin/dashboard/workshops', active: pathname?.startsWith('/admin/dashboard/workshops') },
    ...(canViewUsers ? [{ icon: HiUser, label: 'Users', href: '/admin/dashboard/users', active: pathname?.startsWith('/admin/dashboard/users') }] : []),
    ...(canViewTeams ? [{ icon: HiMiniUserGroup, label: 'Teams', href: '/admin/dashboard/teams', active: pathname?.startsWith('/admin/dashboard/teams') }] : []),
    ...(canViewSecurity ? [{ icon: Shield, label: 'Security', href: '/admin/dashboard/security', active: pathname?.startsWith('/admin/dashboard/security') }] : []),
  ];

  const handleNavClick = (index: number) => {
    setActiveIndex(index);
  };

  const doLogout = async () => {
    if (!confirm('Are you sure you want to logout?')) return;
    try {
      await logout();
    } finally {
      router.replace("/admin");
    }
  };

  return (
    <div className="relative">
      {/* Sidebar */}
      <aside
        className={`relative left-0 top-0 h-full bg-slate-900 shadow-2xl flex flex-col transition-all duration-300 ease-in-out z-50 ${
          isCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className={`flex items-center gap-3 transition-opacity duration-300 z-0 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
            <div className="w-10 h-10 bg-linear-to-br from-black-500 to-gray-500 rounded-lg flex items-center justify-center shadow-lg">
              <Image src={IMAGES.mbLogoJpg} alt="Mindbend Logo" width={100} height={100} />
            </div>
            <span className="text-xl font-bold text-white whitespace-nowrap">Mindbend Admin</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-slate-800 rounded-lg transition-all duration-200 text-slate-400 hover:text-white ml-auto z-10"
          >
            {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = item.active;
            
            return (
              <Link
                key={index}
                href={item.href}
                onClick={() => handleNavClick(index)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-linear-to-r from-black-600 to-gray-600 text-white shadow-lg shadow-black-500/50'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span
                  className={`font-medium whitespace-nowrap transition-opacity duration-300 ${
                    isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'
                  }`}
                >
                  {item.label}
                </span>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`p-4 border-t border-slate-800 ${isCollapsed ? 'hidden' : 'block'}`}>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-linear-to-r from-black-600/20 to-gray-600/20 border border-black-500/30">
            <div className="w-10 h-10 bg-linear-to-br from-black-500 to-gray-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              {loadingUser ? '...' : (user?.name ? user.name.charAt(0).toUpperCase() : 'U')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{loadingUser ? 'Loading...' : user?.name || 'Unknown'}</p>
              <p className="text-xs text-slate-400 truncate">{loadingUser ? '' : user?.role || 'Unknown'}</p>
            </div>
          </div>
          <button
            onClick={doLogout}
            className="w-full mt-3 flex items-center gap-3 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Hamburger for collapsed state */}
      {isCollapsed && (
        <button
          onClick={toggleSidebar}
          className="fixed top-6 left-6 p-3 bg-slate-900 hover:bg-slate-800 rounded-xl shadow-2xl transition-all duration-200 z-40 text-white"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}
    </div>
  );
};

export default AdminSidebar;