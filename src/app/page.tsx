'use client'; // potrebné pre interaktivitu Reactu

import { useState } from 'react';

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-100 p-4 space-y-4">
      <h2 className="text-3xl font-bold text-blue-600">Test lokálneho deployu</h2>
      <p className="text-gray-700 text-lg">
        Ak toto vidíš, Tailwind aj React fungujú!
      </p>

      <button
        onClick={() => setCount(count + 1)}
        className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Klikni ma
      </button>

      <p className="text-gray-800 text-lg">Kliknutí: {count}</p>
    </div>
  );
}
