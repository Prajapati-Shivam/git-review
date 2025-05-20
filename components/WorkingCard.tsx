import { Link, File, Bot } from 'lucide-react';
const steps = [
  {
    step: 1,
    title: 'Enter a link',
    description:
      'Enter the proper URL of public Github repository in the input box.',
    logo: Link,
  },
  {
    step: 2,
    title: 'Select a file',
    description:
      'Browse through the repository and select a file you want to review.',
    logo: File,
  },
  {
    step: 3,
    title: 'Get a review',
    description:
      'Get a detailed review of your code by clicking the review button.',
    logo: Bot,
  },
];
const WorkingCard = () => {
  return (
    <div className='flex flex-col items-center justify-center px-10 lg:px-28 mt-28 sm:mt-8 pb-20 h-[calc(100vh-5rem)]'>
      <h2 className='text-3xl font-bold sm:text-5xl my-4'>How it works</h2>
      <div className='grid grid-cols-1 gap-5 my-8 sm:grid-cols-3'>
        {steps.map((step) => (
          <div
            key={step.step}
            className='flex p-4 gap-5 bg-white border-2 border-primary rounded-lg shadow-md
            transition duration-300 ease-in-out transform hover:bg-primary hover:text-white group relative overflow-hidden'
          >
            <div className='flex flex-col gap-2'>
              <h3 className='text-2xl font-semibold '>{step.title}</h3>
              <p className='text-gray-800 group-hover:text-gray-200'>
                {step.description}
              </p>
            </div>
            <step.logo className='size-24 text-primary transition-transform duration-300 group-hover:-rotate-12 group-hover:text-white' />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkingCard;
