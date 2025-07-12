'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LayoutDashboardIcon, LogOut, User } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';

const AdminNavbar = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.admin;
  return (
    <div className='flex items-center justify-between mb-8'>
      <div className='flex items-center gap-3'>
        <Link href="/" className='rounded-lg'>
          <Image
            src="/spotify.png"
            width={36}
            height={36}
            className="size-7 md:size-10 drop-shadow-lg animate-spin-slow cursor-pointer"
            alt="Spotify logo"
          />
        </Link>
        <div>
          <h1 className='text-lg md:text-3xl font-bold'>Music Manager</h1>
          <p className='text-zinc-400 mt-1 max-md:text-xs max-md:mt-0'>Menage your music catalog</p>
        </div>
      </div>
      {/* User Avatar */}
      {session && session.user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="w-10 h-10 cursor-pointer border-2 border-green-400 hover:scale-105 hover:shadow-lg transition-all duration-200 select-none">
              <AvatarImage
                src={session?.user?.imageUrl}
                alt={session.user.fullName || 'User avatar'}
                className="object-cover"
              />
              <AvatarFallback className="bg-green-100 text-green-800 font-medium">
                {session.user.fullName
                  ? session.user.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                  : 'U'}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-60 lg:w-96 rounded-xl shadow-2xl bg-zinc-900 border border-zinc-700 animate-fade-in"
          >
            <div className="px-5 py-4 flex items-center gap-4 border-b border-zinc-800">
              <Avatar className="w-12 h-12 ring-2 ring-green-400 select-none">
                <AvatarImage
                  src={session?.user?.imageUrl}
                  alt={session.user.fullName || 'User avatar'}
                  className="object-cover"
                />
                <AvatarFallback className="bg-green-100 text-green-800">
                  {session.user.fullName
                    ? session.user.fullName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                    : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="text-base font-semibold text-green-300 truncate">{session.user.fullName}</span>
                <span className="text-xs text-zinc-400 truncate">{session.user.email}</span>
              </div>
            </div>
            {isAdmin && (
              <>
                <DropdownMenuItem className="px-5 py-3 text-sm hover:bg-green-500/10 cursor-pointer transition-all">
                  <Link href="/admin" className="w-full flex items-center gap-2 text-zinc-200 hover:text-green-400">
                    <LayoutDashboardIcon className="w-4 h-4 text-green-400" />
                    Admin Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-800" />
              </>
            )}
            <DropdownMenuItem className="px-5 py-3 text-sm hover:bg-green-500/10 cursor-pointer transition-all">
              <Link href="/profile" className="w-full flex items-center gap-2 text-zinc-200 hover:text-green-400">
                <User className="w-4 h-4 text-green-400" />
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="px-5 py-3 text-sm hover:bg-green-500/10 cursor-pointer transition-all">
              <Link href="/profile" className="w-full flex items-center gap-2 text-zinc-200 hover:text-green-400">
                <FaGithub className="w-4 h-4 text-green-400" />
                Github
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-zinc-800" />

            <DropdownMenuItem className="px-5 py-3 text-sm transition-all hover:!bg-transparent">
              <Button onClick={() => signOut()} variant="ghost" type="submit" className="w-full text-left hover:!bg-green-600 bg-green-600 cursor-pointer text-white flex items-center gap-2">
                <LogOut className="w-4 h-4 text-white" />
                Sign out
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

export default AdminNavbar;