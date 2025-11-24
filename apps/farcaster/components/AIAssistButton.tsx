// Cursor prompt: "Create a React component that allows users to request AI assistance"

'use client';

import { useState } from 'react';

export default function AIAssistButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/ai-assist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await res.json();
      setResponse(data.code);
    } catch (error) {
      console.error('Error requesting AI assistance:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
      >
        AI Assist
      </button>
      
      {isOpen && (
        <div className="absolute bottom-16 right-4 w-96 bg-white rounded-lg shadow-xl p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">AI Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
                Describe what you want the AI to help you with:
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="e.g., Create a donation processing function with error handling"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-md"
              >
                {isLoading ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </form>
          
          {response && (
            <div className="mt-4 p-3 bg-gray-100 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Generated Code:</h4>
              <pre className="text-xs overflow-auto bg-gray-800 text-white p-2 rounded">
                {response}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}