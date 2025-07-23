'use client'
import { useState, useEffect } from "react";

export default function LoginModal({ onSubmit }) {
    const [input, setInput] = useState("");
    const [savedUsername, setSavedUsername] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('username');
            if (saved) {
                let clean = saved.trim().toLowerCase();
                if (clean.startsWith('@')) clean = clean.slice(1);
                setSavedUsername(clean);
            }
        }
    }, []);

    const cleanName = (val) => {
        let v = val.trim().toLowerCase();
        if (v.startsWith('@')) v = v.slice(1);
        return v;
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setInput(value);
        setError("");
    };

    const handleSubmit = () => {
        if (!input.trim()) return;
        const cleaned = cleanName(input);
        
        if (savedUsername && cleaned && cleaned !== savedUsername) {
          setError(`This is not your nickname, here is your correct one: @${savedUsername}`);
          return;
        }     
        
        if (typeof window !== 'undefined') {
            localStorage.setItem('username', cleaned);
        }
        
        onSubmit(cleaned);
    };

    return (
      <div className="fixed inset-0 w-screen h-screen bg-pink-200/85 z-[9999] flex items-center justify-center">
        <div className="bg-pink-100 border-2 border-pink-400 shadow-[4px_4px_0_0_#ff69b4] px-8 pt-8 pb-2 rounded-lg font-sans text-black flex flex-col items-center justify-start w-[480px]">
          <div className="font-bold text-[20px] mb-4 text-center">
            Welcome to Succinct Phrases
          </div>
          <div className="mb-3 text-center">
            Please enter your X handle to start working:
          </div>
          <input
            className="w-full p-2 border-2 border-inset border-pink-400 rounded text-[16px] mb-4 bg-pink-50 text-black outline-none"
            value={input}
            onChange={handleChange}
            placeholder="Enter your X handle"
            onKeyDown={e => {
              if (e.key === 'Enter' && input.trim() && !error) {
                handleSubmit();
              }
            }}
            autoFocus
          />
          <button
            className={`w-full p-2 bg-pink-400 text-black border-2 border-pink-400 rounded font-bold font-sans text-[16px] mt-0 transition-opacity duration-150 ${input.trim() && !error ? 'cursor-pointer opacity-100' : 'cursor-not-allowed opacity-60'}`}
            disabled={!input.trim() || !!error}
            onClick={handleSubmit}
          >
            Enter
          </button>
          <div
            className="text-[#d72660] text-center font-sans text-[14px] w-full min-h-[22px] mt-2 transition-colors duration-200"
          >
            {error ? error : '\u00A0'}
          </div>
        </div>
      </div>
    );
}