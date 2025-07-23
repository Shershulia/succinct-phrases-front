// components/Header.tsx
'use client';


export default function Header({ balance }) {
  return (
    <div className="w-full flex justify-between items-center px-8 py-4 bg-pink-100 border-b border-pink-300 shadow-sm rounded-xl">
      <h1 className="text-3xl font-bold text-pink-700" style={{ fontFamily: 'var(--font-ivory)' }}>Succinct Phrases 1.5</h1>
      <p className="text-lg font-medium text-pink-800">
        Your Balance: <span className="font-bold">{balance}</span>
      </p>
    </div>
  );
}
