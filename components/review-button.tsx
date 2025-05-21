'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import getCodeReview from '@/lib/getCodeReview';
import { toast } from 'sonner';

interface ReviewButtonProps {
  selectedFile: string;
  fileContent: string;
  setReview: (review: string) => void;
  isDisabled?: boolean;
  onReviewComplete?: () => void;
}

export function ReviewButton({
  selectedFile,
  fileContent,
  setReview,
  isDisabled = false,
  onReviewComplete,
}: ReviewButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleReview = async () => {
    if (!selectedFile || isDisabled) return;

    setIsLoading(true);
    try {
      const res = await getCodeReview(fileContent);
      setReview(res);
      onReviewComplete?.();
    } catch (error) {
      console.error('Error creating review:', error);
      toast.error('Error generating review. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleReview}
      disabled={isLoading || isDisabled}
      className='cursor-pointer'
    >
      {isLoading ? (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          Reviewing...
        </>
      ) : (
        'Review File'
      )}
    </Button>
  );
}
