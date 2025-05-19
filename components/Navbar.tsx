'use client';

import React from 'react';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import Link from 'next/link';

export const Navbar = () => {
  return (
    <header className='bg-white shadow-sm sticky top-0 z-50 px-10 lg:px-28'>
      <div className='mx-auto py-4 flex items-center justify-between'>
        {/* Logo / Brand */}
        <Link href='/' className='flex items-center space-x-2'>
          <span className='text-3xl font-bold'>Github Review</span>
        </Link>

        {/* Navigation / Auth */}
        <nav className='flex items-center space-x-4'>
          <SignedOut>
            <SignInButton mode='modal'>
              <button className='px-4 py-2 rounded-md text-sm font-medium text-white bg-black hover:bg-gray-800 transition'>
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode='modal'>
              <button className='px-4 py-2 rounded-md text-sm font-medium text-black border border-gray-300 hover:bg-gray-100 transition'>
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
};
