'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function Home() {
  const navigate = useRouter();
  const { isSignedIn } = useUser();
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const url = formData.get('url') as string;
    if (!url) {
      alert('Please enter a valid URL');
      return;
    }

    const urlPattern = /^(https?:\/\/)?(www\.)?github\.com\/[^\/]+\/[^\/]+$/;
    if (!urlPattern.test(url)) {
      alert('Please enter a valid GitHub repository URL');
      return;
    }

    if (!isSignedIn) {
      alert('Please log in to start a code review.');
      return;
    }

    const repoName = url.split('github.com/')[1]; // owner/repo
    const [owner, repo] = repoName.split('/');

    navigate.push(`/review?owner=${owner}&repo=${repo}`);
  };

  return (
    <main className='hero-container'>
      <div className='flex flex-col items-center sm:justify-center h-[calc(100vh-5rem)] w-full gap-8'>
        <h1 className='text-5xl sm:text-7xl font-bold'>Code Review AI Agent</h1>

        <form
          onSubmit={handleSubmit}
          className='flex flex-col items-center gap-4'
        >
          <div className='flex flex-col sm:flex-row gap-8 items-center'>
            <Input
              placeholder='Enter public GitHub repo URL'
              id='url'
              name='url'
              className='w-auto sm:w-80'
            />
            <Button type='submit' size='lg' className='ml-2'>
              Get Started
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
