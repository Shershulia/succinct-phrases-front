import { useEffect, useRef } from "react";

export default function ModalFrame({ item, onClose }) {
  const ref = useRef(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const shareToTwitter = () => {
    const text = `🏆 Hall of Fame Winner! 🏆\n\n"${item.text}"\n\n @${item.author_id}\n ${new Date(item.won_at).toLocaleDateString()}\n\n#SuccinctPhrases #HallOfFame`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div
        ref={ref}
        className="relative bg-center bg-no-repeat bg-contain z-[70]"
        style={{
          backgroundImage: "url('/frame.png')",
          backgroundSize: "100% 100%",
          width: "min(90vw, 500px)",
          height: "min(90vw, 500px)",
          maxWidth: "500px",
          maxHeight: "500px",
        }}
      >
        <div 
          className="absolute bg-yellow-50 bg-opacity-80 z-[60] rounded-xs overflow-auto"
          style={{
            left: "12%",
            right: "12%",
            top: "10%",
            bottom: "10%",
            padding: "clamp(1rem, 3vw, 2rem)",
          }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
            <div 
              className="rounded-xs overflow-hidden"
              style={{
                width: "clamp(60px, 15vw, 120px)",
                height: "clamp(60px, 15vw, 120px)",
                minWidth: "60px",
                minHeight: "60px",
              }}
            >
              <img
                src={`https://unavatar.io/x/${item.author_id}`}
                alt={item.author_id}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-center">
              <div className="text-yellow-800 font-semibold text-lg sm:text-xl">{item.author_id}</div>
              <div className="text-yellow-600 text-base sm:text-lg">
                {new Date(item.won_at).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div 
            className="text-yellow-900 leading-relaxed text-center italic mb-4"
            style={{
              fontSize: "clamp(1rem, 4vw, 1.5rem)",
            }}
          >
            {item.text}
          </div>
          
          <div className="text-center">
            <button
              onClick={shareToTwitter}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 mx-auto text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
