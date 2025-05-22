import { MarkdownRenderer } from './markdown-renderer';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { BotMessageSquare } from 'lucide-react';

export function CodeReview({ review }: { review: string }) {
  return (
    <Card className='border-2 hover:border-neutral-400 lg:col-span-4'>
      <CardHeader>
        <CardTitle className='text-xl'>🤖 Code Review</CardTitle>
      </CardHeader>
      <CardContent className='flex-1'>
        <ScrollArea className='h-[500px]'>
          {review ? (
            <MarkdownRenderer content={review} />
          ) : (
            <div className='h-full flex flex-col gap-8 md:gap-20 items-center justify-center text-muted-foreground'>
              <p>Click &quot;Review File&quot; to analyze this file</p>
              <BotMessageSquare
                className='animate-bounce text-muted-foreground'
                size={80}
                color='currentColor'
              />
            </div>
          )}
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
