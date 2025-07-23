'use client';

import { useEffect, useState } from 'react';
import HallOfFameItem from './HallOfFameItem';
import { useRouter } from 'next/navigation';

export default function LastWinner({ winner }) {
  const [lastWinner, setLastWinner] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchLatestWinner = async () => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/hall-of-fame/latest');
      if (!res.ok) throw new Error('Failed to fetch latest winner');
      const data = await res.json();
      setLastWinner(data);
    } catch (err) {
      console.error('Error fetching latest winner:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestWinner();
  }, [winner]);


  if (loading) {
    return <div className="text-center text-sm text-gray-500">Loading last winner...</div>;
  }


  return (
    <div className="cursor-pointer w-full">
      <div className="flex flex-col items-center gap-3 w-full">
        {lastWinner ? (
          <div className="flex flex-col justify-center w-full items-center gap-3">
            <div className="text-yellow-800 font-semibold text-sm">Last winner</div>
            <HallOfFameItem item={lastWinner} />
            <div className="text-yellow-800 font-semibold text-sm" onClick={() => router.push('/hall-of-fame')}>Go to hall of fame</div>
          </div>
        ) : (
          <div className="flex flex-col justify-center w-full items-center gap-3">
            <div className="text-center text-sm text-red-500">No winner yet.</div>
            <div className="text-yellow-800 font-semibold text-sm" onClick={() => router.push('/hall-of-fame')}>Go to hall of fame</div>
          </div>
        )}
      </div>
    </div>
  );
}
