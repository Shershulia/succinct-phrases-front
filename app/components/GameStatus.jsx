import { useEffect, useRef, useState } from "react";

export default function GameStatus({ socket, onWinnerUpdate }) {
  const [countdown, setCountdown] = useState(0);
  const [entries, setEntries] = useState([]);
  const [winner, setWinner] = useState(null);
  const [internalWinner, setInternalWinner] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [showRoller, setShowRoller] = useState(false);
  const [centeredWinnerIndex, setCenteredWinnerIndex] = useState(null);
  const [activeWinnerIndex, setActiveWinnerIndex] = useState(null);
  const rollerRef = useRef(null);
  const rollerContainerRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "start_timer") {
        setCountdown(data.seconds);
        setWinner(null);
        setInternalWinner(null);
        setShowRoller(false);
        setEntries([]);
        setCenteredWinnerIndex(null);
        setActiveWinnerIndex(null);
      }

      if (data.type === "new_entry") {
        setEntries((prev) => [...prev, data.entry]);
      }

      if (data.type === "winner") {
        setWinner(data.winner);
        setCountdown(0);
        setShowRoller(true);

        setTimeout(() => startRolling(data.entries, data.winner), 300);
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket]);

  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const startRolling = (allEntries, winner) => {
    if (!rollerRef.current || !rollerContainerRef.current) return;
    setRolling(true);

    // Динамический расчет ширины карточки с учетом margin
    const firstItem = rollerRef.current?.children[0];
    const itemWidth = firstItem
      ? firstItem.offsetWidth +
        parseFloat(getComputedStyle(firstItem).marginLeft) +
        parseFloat(getComputedStyle(firstItem).marginRight)
      : 108;

    const repeatCount = 25;
    const extended = [];
    for (let i = 0; i < repeatCount; i++) {
      extended.push(...allEntries);
    }
    setEntries(extended);

    requestAnimationFrame(() => {
      const centerVisualIndex = Math.floor(extended.length / 2);

      let winnerIndex = extended.findIndex((entry, index) =>
        index >= centerVisualIndex &&
        entry.author_id === winner.author_id &&
        entry.text === winner.text &&
        entry.amount === winner.amount
      );

      if (winnerIndex === -1) {
        winnerIndex = centerVisualIndex;
      }

      setCenteredWinnerIndex(winnerIndex);

      const containerWidth = rollerContainerRef.current.offsetWidth;
      const totalOffset = itemWidth * winnerIndex - (containerWidth / 2) + (itemWidth / 2);

      setTimeout(() => {
        if (rollerRef.current) {
          rollerRef.current.style.transition = "transform 5s cubic-bezier(0.25, 1, 0.5, 1)";
          rollerRef.current.style.transform = `translateX(-${totalOffset}px)`;
        }
      }, 100);

      setTimeout(() => {
        setInternalWinner(winner);
        setActiveWinnerIndex(winnerIndex);
      }, 5000);

      setTimeout(() => {
        setRolling(false);
        setShowRoller(false);
        if (onWinnerUpdate) {
          onWinnerUpdate(winner);
        }
      }, 7000);
    });
  };

  if (countdown <= 0 && !showRoller && !internalWinner) {
    return null;
  }

  return (
    <div className="w-full p-4 bg-pink-50 border-2 border-pink-200 rounded-lg shadow overflow-hidden relative">
      <h2 className="text-lg font-bold text-pink-800 mb-4">Rolling Game</h2>

      {countdown > 0 && (
        <div className="text-pink-800 text-xl font-mono mb-4">
          Drawing in: <span className="font-bold">{countdown}s</span>
        </div>
      )}

      {showRoller && (
        <div
          ref={rollerContainerRef}
          className="relative w-full max-w-[800px] mx-auto overflow-hidden border border-pink-300 bg-white rounded h-[120px]"
        >
          {/* Галочка */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[55%] z-20">
            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px] border-b-green-600" />
          </div>
          {/* Прокручиваемая лента */}
          <div
            ref={rollerRef}
            className="flex items-center h-full transition-transform duration-500 ease-in-out"
            style={{ willChange: "transform", minWidth: "max-content" }}
          >
            {entries.map((entry, i) => (
              <div
                key={i + entry.id}
                className={`shrink-0 flex flex-col items-center justify-center w-[100px] h-[100px] mx-1 border rounded text-center shadow-sm ${
                  i === activeWinnerIndex
                    ? "bg-green-200 border-green-500"
                    : "bg-pink-100"
                }`}
              >
                <img
                  src={`https://unavatar.io/x/${entry.author_id}`}
                  alt={entry.author_id}
                  className="w-12 h-12 rounded-full mb-1"
                />
                <div className="text-xs font-semibold truncate w-[90px]">{entry.author_id}</div>
                <div className="text-[11px] italic truncate w-[90px]">"{entry.text}"</div>
                <div className="text-[10px] text-pink-600 overflow-hidden">@{entry.author_id  }</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {internalWinner && !rolling && (
        <div className="mt-6 p-4 border-2 border-green-400 bg-green-50 rounded transition-all duration-500">
          <h3 className="text-green-800 font-bold text-lg">Last Winner:</h3>
          <div className="text-green-900 font-semibold mt-2">{internalWinner.author_id}</div>
          <div className="text-green-700 italic mt-1">"{internalWinner.text}"</div>
          <div className="text-green-600 mt-1">Bet: {internalWinner.amount}</div>
        </div>
      )}
    </div>
  );
}
