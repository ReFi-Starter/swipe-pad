import { useState } from 'react'

export default function SelfProtocolVerify() {
  const [isVerified, setIsVerified] = useState(false)
  
  const handleVerify = () => {
    // Integration with Self Protocol would go here
    setIsVerified(true)
  }
  
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-bold mb-2">Identity Verification</h2>
      {isVerified ? (
        <div className="text-green-600">
          <p>✅ Verified with Self Protocol</p>
        </div>
      ) : (
        <div>
          <p className="mb-2">Verify your identity to unlock rewards</p>
          <button 
            onClick={handleVerify}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Verify with Self Protocol
          </button>
        </div>
      )}
    </div>
  )
}
