'use client';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Import the component without SSR to avoid the useSearchParams issue
const TicketsContent = dynamic(() => import('./tickets-content'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
    </div>
  ),
});

export default function TicketsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      }
    >
      <TicketsContent />
    </Suspense>
  );
}
