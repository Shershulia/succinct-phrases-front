import { useEffect } from "react";

export default function PhraseList({ socket, entries, setEntries }) {

    useEffect(() => {
        if (!socket) return;

        const handleMessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "new_entry") {
                setEntries(prev => [...prev, data.entry]);
            }

            if (data.type === "winner") {
                setEntries([]);
            }
        };

        socket.addEventListener("message", handleMessage);
        return () => socket.removeEventListener("message", handleMessage);
    }, [socket]);

    if (entries.length === 0) {
        return <div className="text-pink-700 font-sans mt-4">No current bets yet.</div>;
    }

    // Сортировка по убыванию amount
    const sortedEntries = [...entries].sort((a, b) => b.amount - a.amount);

    return (
        <div className="w-full mt-6">
            <h2 className="text-lg font-bold mb-3 text-pink-800">Current Bets:</h2>
            <ul className="space-y-3">
                {sortedEntries.map((entry, index) => (
                    <li
                        key={entry.id || index}
                        className="bg-pink-50 border-2 border-pink-200 p-3 rounded-lg shadow-sm flex items-center gap-3"
                    >
                        <img src={`https://unavatar.io/x/${entry.author_id}`} alt="User Avatar" className="w-10 h-10 rounded-full" />
                        <div className="flex flex-col items-center justify-center">
                            <div className="text-pink-900 font-semibold">{entry.author_id}</div>
                            <div className="text-pink-700 italic mt-1">"{entry.text}"</div>
                            <div className="text-pink-600 mt-1">Bet: {entry.amount}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
