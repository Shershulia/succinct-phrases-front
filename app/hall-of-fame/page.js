'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import HallOfFameItem from "@/app/components/HallOfFameItem";
import Win95Window from "@/app/components/Win95Window";
import CloudCanvas from "@/app/components/CloudCanvas"; 

export default function HallOfFamePage() {
  const [hallOfFame, setHallOfFame] = useState([]);
  const [sortBy, setSortBy] = useState('date'); 
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    axios.get(process.env.NEXT_PUBLIC_API_URL + "/hall-of-fame").then((res) => {
      setHallOfFame(res.data);
      console.log(res.data);
    });
  }, []);

  // Фильтрация по поиску
  const filteredItems = hallOfFame.filter(item =>
    item.author_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Сортировка отфильтрованных элементов
  const sortedItems = filteredItems.sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.won_at) - new Date(a.won_at);
    } else {
      return a.author_id.localeCompare(b.author_id);
    }
  });

  return (
    <div className="flex flex-col items-center min-h-screen p-8 pb-20 gap-4">
      <CloudCanvas />

      <img src="/HallOfFame.png" alt="logo" style={{ height: 48, margin: '0 auto' }} />
      <Win95Window title="sort.exe" width={"50%"}>
        <div className="flex flex-row items-center gap-4 flex-wrap ">
          <button
            onClick={() => router.push('/')}
            style={{
              background: '#ffb6d5',
              border: '2px outset #ff69b4',
              borderRadius: 4,
              fontFamily: 'MS Sans Serif',
              fontWeight: 'bold',
              color: '#d72660',
              padding: '8px 16px',
              marginRight: 16,
              cursor: 'pointer',
              boxShadow: '2px 2px 0 #ff69b4',
            }}
          >
            ← Back
          </button>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by author name..."
            style={{
              flex: 2,
              padding: 8,
              border: '2px inset #ff69b4',
              borderRadius: 2,
              fontFamily: 'MS Sans Serif',
              fontSize: 16,
              background: '#fff0f6',
              color: '#d72660',
              outline: 'none',
              minWidth: 180,
            }}
          />
          <button
            onClick={() => setSortBy('date')}
            style={{
              padding: '8px 16px',
              border: '2px outset #ff69b4',
              borderRadius: 2,
              fontFamily: 'MS Sans Serif',
              fontWeight: 'bold',
              background: sortBy === 'date' ? '#ffb6d5' : '#ffe4ef',
              color: '#d72660',
              cursor: 'pointer',
              boxShadow: '2px 2px 0 #ff69b4',
            }}
          >
            Sort by Date
          </button>
          <button
            onClick={() => setSortBy('name')}
            style={{
              padding: '8px 16px',
              border: '2px outset #ff69b4',
              borderRadius: 2,
              fontFamily: 'MS Sans Serif',
              fontWeight: 'bold',
              background: sortBy === 'name' ? '#ffb6d5' : '#ffe4ef',
              color: '#d72660',
              cursor: 'pointer',
              boxShadow: '2px 2px 0 #ff69b4',
            }}
          >
            Sort by Name
          </button>
        </div>
      </Win95Window>

      {/* Список победителей в окнах Win95Window */}
      <div className="flex flex-col items-center w-1/2">
        {sortedItems.length > 0 ? (
          sortedItems.map((item) => (
            <Win95Window
              key={`${item.won_at}_${item.author_id}`}
              title={`${item.author_id}.exe`}
              width={"100%"}
            >
              <HallOfFameItem item={item} />
            </Win95Window>
          ))
        ) : (
          <div className="text-gray-500 text-center py-8">
            {searchQuery ? `No results found for "${searchQuery}"` : 'No items found'}
          </div>
        )}
      </div>
    </div>
  );
}
