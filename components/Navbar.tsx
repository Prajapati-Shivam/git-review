'use client';

import React from 'react';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { LogIn, SearchCheck } from 'lucide-react';
import { Button } from './ui/button';

export const Navbar = () => {
  return (
    <header className='bg-white shadow-sm sticky top-0 z-50 px-6 md:px-10 lg:px-28'>
      <div className='py-4 flex items-center justify-between border-b'>
        {/* Logo / Brand */}
        <Link
          href='/'
          className='flex items-center space-x-1 text-black hover:opacity-90'
          aria-label='Go to homepage'
        >
          <SearchCheck size={28} strokeWidth={2.5} className='text-pink-600' />
          <span className='text-2xl font-bold tracking-tight'>ReviewLens</span>
        </Link>

        {/* Navigation / Auth */}
        <div className='flex items-center space-x-2'>
          <SignedOut>
            <SignInButton mode='modal'>
              <Button variant='ghost' className='flex items-center space-x-1'>
                <span className='hidden md:inline font-bold'>Sign In</span>
                <LogIn size={28} />
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};
