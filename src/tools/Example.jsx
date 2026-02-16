import { useState } from 'react'

export default function Example() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Example Tool</h1>
        <button
          onClick={() => setCount(c => c + 1)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
        >
          Count: {count}
        </button>
      </div>
    </div>
  )
}
