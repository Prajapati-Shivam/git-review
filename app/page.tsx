'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { motion } from 'motion/react';
import WorkingCard from '@/components/WorkingCard';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useRouter();
  const { isSignedIn } = useUser();
  const handleSubmit = (event: React.FormEvent) => {
    setIsLoading(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const url = formData.get('url') as string;
    if (!url) {
      toast.error('Please enter a GitHub repository URL');
      setIsLoading(false);
      return;
    }

    const urlPattern = /^(https?:\/\/)?(www\.)?github\.com\/[^\/]+\/[^\/]+$/;
    if (!urlPattern.test(url.replace(/\/$/, ''))) {
      // Remove trailing slash for validation
      toast.error('Please enter a valid GitHub repository URL');
      setIsLoading(false);
      return;
    }

    if (!isSignedIn) {
      toast.error('Please sign in to continue');
      setIsLoading(false);
      return;
    }

    const repoName = url.replace(/\/$/, '').split('github.com/')[1];
    const [owner, repo] = repoName.split('/');
    setTimeout(() => {
      navigate.push(`/review?owner=${owner}&repo=${repo}`);
    }, 100);
  };

  return (
    <>
      <AuroraBackground>
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: 'easeInOut',
          }}
          className='relative flex flex-col gap-4 items-center justify-center'
        >
          <main className='hero-container'>
            <div className='flex flex-col items-center sm:justify-center h-[calc(100vh-10rem)] w-full gap-4 sm:gap-8'>
              <div className='bg-opacity-50 bg-gradient-to-b from-neutral-500 to-neutral-900 bg-clip-text text-center text-4xl font-bold text-transparent md:text-7xl'>
                Code Review AI Agent
              </div>
              <div className='font-extralight text-base text-center md:text-2xl dark:text-neutral-200 py-4'>
                Get started with code reviews in seconds. <br />
                Just enter your GitHub repository URL and let the AI do the
                rest.
              </div>
              <form
                onSubmit={handleSubmit}
                className='flex flex-col items-center gap-4 w-full'
              >
                <div className='relative w-full max-w-xl'>
                  <Input
                    placeholder='Enter public GitHub repo URL'
                    id='url'
                    name='url'
                    className='w-full pr-36 py-7 border text-base md:text-xl border-black outline-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:text-white dark:border-neutral-600 dark:focus:ring-blue-500'
                    style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Button
                    type='submit'
                    size='lg'
                    className='absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 cursor-pointer'
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Loading...
                      </>
                    ) : (
                      'Get Started'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </main>
        </motion.div>
      </AuroraBackground>
      <WorkingCard />
      <Footer />
    </>
  );
}
