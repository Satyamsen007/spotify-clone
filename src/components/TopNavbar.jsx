'use client'

import { LayoutDashboardIcon, LogOut, Menu, Settings, User } from 'lucide-react';
import Link from 'next/link';
import SignInAuthButton from './SignInAuthButton';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from './ui/button';
import { signOut, useSession } from 'next-auth/react';
import { FaGithub } from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LeftSideBar from './mainlayout/components/LeftSideBar';
import { AnimatePresence, motion } from 'framer-motion';

const TopNavbar = () => {
  const { data: session } = useSession();
  const [openSideBar, setOpenSideBar] = useState(false)
  const isAdmin = session?.user?.admin;
  const router = useRouter();
  return (
    <>
      {
        <AnimatePresence>
          {openSideBar && (
            <motion.div
              className='absolute md:hidden w-full z-30'
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <LeftSideBar setOpenSideBar={setOpenSideBar} />
            </motion.div>
          )}
        </AnimatePresence>
      }
      <div
        className="flex items-center justify-between px-6 max-sm:px-3 py-3 sticky top-0 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900/90
      backdrop-blur-lg z-20 md:rounded-t-xl shadow-lg border-b border-zinc-800 transition-all"
      >
        <div className='flex items-center gap-2'>
          <button
            onClick={(e) => {
              e.preventDefault()
              setOpenSideBar(true)
            }}
            className='md:hidden p-1'
          >
            <Menu className='size-5' />
          </button>

          {/* Logo remains clickable but won't open sidebar */}
          <Link href="/" className="flex gap-3 items-center">
            <Image
              src="/spotify.png"
              width={36}
              height={36}
              className="size-7 md:size-9 drop-shadow-lg animate-spin-slow cursor-pointer"
              alt="Spotify logo"
            />
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-green-400 via-green-300 to-green-500 bg-clip-text text-transparent tracking-wide select-none">
              Spotify
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-5">
          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "border-green-400 text-green-400 max-md:hidden hover:!text-green-400 transition-all"
              )}
            >
              <LayoutDashboardIcon className="size-5 mr-2 animate-pulse" />
              <span className="font-semibold">Admin Dashboard</span>
            </Link>
          )}

          {!session && !session?.user && <SignInAuthButton />}

          {session && session.user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="w-10 h-10 cursor-pointer border-2 border-green-400 hover:scale-105 hover:shadow-lg transition-all duration-200 select-none">
                  <AvatarImage
                    src={session?.user?.imageUrl || session?.user?.image}
                    alt={session?.user?.fullName || 'User avatar'}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-green-100 text-green-800 font-medium">
                    {session?.user?.fullName
                      ? session?.user?.fullName
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
                      src={session?.user.imageUrl || session?.user.image}
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

      </div>
    </>
  )
}

export default TopNavbar