import { useState } from 'react'

export default function MiniPayContainer() {
  const [amount, setAmount] = useState(1)
  
  return (
    <div className="p-4 border rounded-lg">
      <h1 className="text-xl font-bold mb-4">SwipePad for MiniPay</h1>
      <p className="mb-4">Donate to climate projects with USDT!</p>
      <div className="mb-4">
        <label className="block mb-2">Donation Amount (USDT)</label>
        <input 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(Number(e.target.value))}
          className="border rounded px-2 py-1 w-full"
          min="1"
        />
      </div>
      <button className="bg-celo-gold text-white px-4 py-2 rounded w-full">
        Donate ${amount} USDT
      </button>
    </div>
  )
}
