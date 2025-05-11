import { ReviewClient } from '@/components/review-client';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ owner?: string; repo?: string; path?: string }>;
}) {
  const params = await searchParams;
  const { path = '', owner = 'vercel', repo = 'next.js' } = params || {};

  return (
    <div className='hero-container py-10'>
      <div className='flex flex-col gap-4'>
        <header>
          <h2 className='text-3xl font-bold'>Github Review</h2>
        </header>
        <div>
          <h3 className='text-2xl font-semibold mb-2'>
            Code Review for {owner}/{repo}
          </h3>
          <p className='text-gray-700'>
            Hey! Your helper for examining code in GitHub repositories is me,
            Code Review AI. I can explain the code to you, make suggestions for
            enhancements, and optimize performance.
          </p>
        </div>
      </div>
      <ReviewClient owner={owner} repo={repo} path={path} />
    </div>
  );
}
