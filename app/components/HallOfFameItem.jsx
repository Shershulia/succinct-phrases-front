'use client';

import { useState, useRef, useEffect } from "react";
import ModalFrame from "./ModalFrame";

export default function HallOfFameItem({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="bg-yellow-100 hover:bg-yellow-200 transition border-2 border-yellow-300 rounded-lg p-4 mb-3 w-full shadow-sm cursor-pointer"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src={`https://unavatar.io/x/${item.author_id}`}
              alt={item.author_id}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="text-yellow-800 font-semibold text-sm">{item.author_id}</div>
            <div className="text-yellow-600 text-xs">
              {new Date(item.won_at).toLocaleDateString()}
            </div>
          </div>
          <div className="text-yellow-700 font-bold text-lg">{item.amount}</div>
        </div>
        <div className="text-yellow-900 text-base line-clamp-2">“{item.text}”</div>
      </div>

      {open && (
        <ModalFrame item={item} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
