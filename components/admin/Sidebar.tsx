"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Calendar, Users, Shield, LogOut, BookOpen, ChevronLeft } from 'lucide-react';
import { logout } from '../../lib/auth';
import { permissions } from '../../lib/permissions';
import api from '@/lib/api';
import { HiMiniUserGroup, HiUser } from "react-icons/hi2";
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
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

  const doLogout = async () => {
    if (!confirm('Are you sure you want to logout?')) return;
    try {
      await logout();
    } finally {
      router.replace("/admin");
    }
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-[#0a0a0a] border-r border-white/5 flex flex-col transition-all duration-300 ease-in-out z-50",
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
          <div className={cn(
            "flex items-center gap-3 transition-all duration-300",
            isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
          )}>
            <div className="w-8 h-8 rounded-md overflow-hidden flex-shrink-0">
              <Image
                src="/images/mb_logo.jpg"
                alt="Mindbend"
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
            <span className="text-sm font-semibold text-white whitespace-nowrap">
              Mindbend Admin
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className={cn(
              "p-1.5 hover:bg-white/5 rounded-md transition-colors text-gray-400 hover:text-white",
              isCollapsed && "mx-auto"
            )}
          >
            <ChevronLeft className={cn(
              "w-4 h-4 transition-transform duration-300",
              isCollapsed && "rotate-180"
            )} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = item.active;

            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group relative text-sm",
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className={cn(
                  "font-medium whitespace-nowrap transition-all duration-300",
                  isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'
                )}>
                  {item.label}
                </span>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-white rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <Separator className="bg-white/5" />

        {/* Footer - User Profile */}
        <div className="p-3">
          {!isCollapsed && (
            <div className="flex items-center gap-3 p-2 rounded-md bg-white/5 mb-2">
              <Avatar className="w-8 h-8 border border-white/10">
                <AvatarFallback className="bg-white/10 text-white text-xs">
                  {loadingUser ? '...' : (user?.name ? user.name.charAt(0).toUpperCase() : 'U')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">
                  {loadingUser ? 'Loading...' : user?.name || 'Unknown'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {loadingUser ? '' : user?.role || 'Unknown'}
                </p>
              </div>
            </div>
          )}

          <Button
            onClick={doLogout}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-sm h-9",
              isCollapsed && "justify-center px-2"
            )}
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Spacer to prevent content overlap */}
      <div className={cn(
        "transition-all duration-300",
        isCollapsed ? 'w-16' : 'w-64'
      )} />
    </>
  );
};

export default AdminSidebar;