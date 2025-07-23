import { useState, useEffect } from "react";

export default function AddPhrase({ username, socket, balance, setBalance, entries }) {
    const [input, setInput] = useState("");
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasBetThisRound, setHasBetThisRound] = useState(false);

    useEffect(() => {
        if (!socket) return;

        const handleMessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "error") {
                console.error(data.message);
                setError(data.message);
            }

            if (data.type === "new_entry") {
                setSuccess("Your bet was placed successfully!");
                setInput("");
                setAmount("");
            }
        };

        socket.addEventListener("message", handleMessage);
        return () => socket.removeEventListener("message", handleMessage);
    }, [socket]);

    useEffect(() => {
        const hasBet = entries.some(entry => entry.author_id === username);
        setHasBetThisRound(hasBet);
    }, [entries]);

    const handleSubmit = () => {
        setError("");
        setSuccess("");
        setLoading(true);

        const amountNum = Number(amount);

        if (
            !input.trim() ||
            !amount ||
            isNaN(amountNum) ||
            amountNum <= 0 ||
            !Number.isInteger(amountNum)
        ) {
            setError("Please enter a phrase and a valid *whole number* amount.");
            setLoading(false);
            return;
        }

        if (amountNum > balance) {
            setError("Not enough balance for this bet.");
            setLoading(false);
            return;
        }

        try {
            socket.send(JSON.stringify({
                type: "place_bet",
                author_id: username,
                text: input.trim(),
                amount: amountNum,
            }));
            setBalance(prev => prev - amountNum); // вычитаем из баланса
        } catch (err) {
            setError("Failed to send bet through WebSocket.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-3 min-w-[320px] rounded-lg">
            <label className="font-sans text-[16px] mb-1 text-pink-900">Enter your phrase:</label>
            <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                maxLength={200}
                className="w-full p-2 border-2 border-pink-300 rounded bg-pink-50 text-pink-900 font-sans"
                placeholder="Type your phrase..."
            />

            <label className="font-sans text-[16px] mt-2 mb-1 text-pink-900">Bet amount:</label>
            <input
                type="number"
                value={amount}
                onChange={e => {
                    const value = e.target.value;
                    if (value === '' || (/^\d+$/.test(value) && parseInt(value) > 0)) {
                        setAmount(value);
                    }
                }}
                min={1}
                step={1}
                className="w-full p-2 border-2 border-pink-300 rounded bg-pink-50 text-pink-900 font-sans [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="e.g. 10"
            />

            <button
                className={`mt-3 w-full p-2 bg-pink-300 text-pink-900 border-2 border-pink-400 rounded font-bold font-sans text-[16px] transition-opacity duration-150 ${input.trim() && amount && !loading && !hasBetThisRound ? 'cursor-pointer opacity-100' : 'cursor-not-allowed opacity-60'}`}
                disabled={!input.trim() || !amount || loading || hasBetThisRound}
                onClick={handleSubmit}
            >
                Submit Bet
            </button>

            <div className={`mt-4 font-sans text-[14px] text-center min-h-[20px] ${error ? 'text-red-600' : success ? 'text-green-600' : 'text-gray-400'}`}>
                {error || success || hasBetThisRound ? 'You have already placed a bet this round.' : ''}
            </div>

        </div>
    );
}
