'use client';

import { useState, useEffect } from "react";
import LoginModal from "@/app/components/LoginModal";
import AddPhrase from "@/app/components/AddPhrase";
import PhraseList from "@/app/components/PhraseList";
import toast from 'react-hot-toast';
import GameStatus from "@/app/components/GameStatus";
import ClickerWithParticles from "@/app/components/ClickerWithParticles";
import LastWinner from "@/app/components/LastWinner";
import Header from "@/app/components/HeaderComponent";
import Win95Window from "@/app/components/Win95Window";
import CloudCanvas from "@/app/components/CloudCanvas";
export default function Home() {
  const [username, setUsername] = useState(null);
  const [socket, setSocket] = useState(null);
  const [balance, setBalance] = useState(0);
  const [lastWinner, setLastWinner] = useState(null);
  const [entries, setEntries] = useState([]);

  // Load username from localStorage if exists
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('username');
      if (stored) {
        setUsername(stored);
      }
    }
  }, []);

  // Create WebSocket connection
  useEffect(() => {
    if (!username) return;

    const ws = new WebSocket("wss://succphrasesbackend-production.up.railway.app/ws");
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onerror = () => {
      toast.error("WebSocket connection failed");
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, [username]);

  const handleModalSubmit = (name) => {
    setUsername(name);
    if (typeof window !== 'undefined') {
      localStorage.setItem('username', name);
    }
  };

  const handleWinnerUpdate = (winner) => {
    setLastWinner(winner);
  };

  return (
      <div className="flex flex-col items-center min-h-screen p-8">
        <CloudCanvas />

        <Header balance={balance} />
        {!username && <LoginModal onSubmit={handleModalSubmit} />}
        {username && socket && (
          <div className="flex w-full items-start gap-16 p-4">
            <div className="flex flex-col items-center justify-center gap-8 flex-1">
              <Win95Window title="last_winner.exe" icon="" width={600}>
                <LastWinner winner={lastWinner} />
              </Win95Window>
              <Win95Window title="add_phrase.exe" icon="" width={600}>
                <AddPhrase username={username} socket={socket} balance={balance} setBalance={setBalance} entries={entries} setEntries={setEntries} />
              </Win95Window>
              <div className="flex flex-col items-center justify-center flex-1">
                <Win95Window title="clicker.exe" icon="" width={600}>
                  <p style={{ fontFamily: 'var(--font-my)' }} className="text-pink-800 text-[50px] z-20 text-center">CRACK ME</p>
                  <ClickerWithParticles onBalanceChange={setBalance} initial={balance} />
                </Win95Window>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-8 flex-1">
              <GameStatus socket={socket} onWinnerUpdate={handleWinnerUpdate} />
              <Win95Window title="phrase_list.exe" icon="" width={"100%"}>
                <PhraseList socket={socket} entries={entries} setEntries={setEntries} />
              </Win95Window>
            </div>
          </div>
        )}
      </div>
  );
}
