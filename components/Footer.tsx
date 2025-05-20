import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className='mt-16 bg-white px-10 lg:px-28 flex itemscenter justify-center w-full border py-5'>
        <div className='text-md text-center sm:text-start'>
          Made with ❤️ by{' '}
          <Link
            href='https://github.com/Prajapati-Shivam'
            target='_blank'
            rel='noreferrer'
            className='text-primary hover:text-gray-800 mr-4'
          >
            Shivam Prajapati
          </Link>
          <span>&copy; {new Date().getFullYear()} Github Review.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
