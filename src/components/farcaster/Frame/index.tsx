import { useState } from 'react'

export default function FarcasterFrame() {
  const [count, setCount] = useState(0)
  
  return (
    <div className="p-4 border rounded-lg">
      <h1 className="text-xl font-bold mb-4">SwipePad for Farcaster</h1>
      <p className="mb-4">Swipe right to donate to climate projects!</p>
      <button 
        className="bg-celo-green text-white px-4 py-2 rounded"
        onClick={() => setCount(count + 1)}
      >
        Swipe Right ({count})
      </button>
    </div>
  )
}
