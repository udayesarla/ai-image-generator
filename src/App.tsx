import React, { useState } from 'react';
import OpenAI from 'openai';
import { Sparkles, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateImage = async () => {
    if (!prompt) return;

    setLoading(true);
    setError('');
    
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      if (!apiKey || apiKey === 'your-api-key-here') {
        throw new Error('Please set your OpenAI API key in the .env file');
      }

      const openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true
      });

      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      });

      setImage(response.data[0].url || '');
    } catch (err: any) {
      let errorMessage = 'Failed to generate image. Please try again.';
      
      if (err.error?.code === 'invalid_api_key') {
        errorMessage = 'Invalid API key. Please check your OpenAI API key in the .env file.';
      } else if (err.error?.code === 'billing_hard_limit_reached') {
        errorMessage = 'OpenAI billing limit reached. Please check your OpenAI account billing status.';
      } else if (err.message.includes('API key')) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Sparkles className="w-8 h-8 text-yellow-400" />
          <h1 className="text-3xl font-bold">AI Image Generator</h1>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-xl mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              className="flex-1 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            />
            <button
              onClick={generateImage}
              disabled={loading || !prompt}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg flex items-center gap-2 transition"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <ImageIcon className="w-5 h-5" />
                  Generate
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-red-400 text-sm">{error}</div>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
          {image ? (
            <img
              src={image}
              alt="Generated image"
              className="w-full h-auto rounded-lg"
            />
          ) : (
            <div className="aspect-square flex items-center justify-center border-2 border-dashed border-gray-700 rounded-lg">
              <div className="text-center text-gray-500">
                <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                <p>Your generated image will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;