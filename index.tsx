/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {GoogleGenAI} from '@google/genai';
import {useState} from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!prompt.trim() || loading) {
      return;
    }
    setLoading(true);
    setResponse('');

    try {
      const ai = new GoogleGenAI({apiKey: AIzaSyCXfRaQnx3PDVT7j6r9rOaLo-RxYdr0kwc});
      const stream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      let text = '';
      for await (const chunk of stream) {
        text += chunk.text;
        setResponse(text);
      }
    } catch (error) {
      console.error(error);
      setResponse('An error occurred while generating the response. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setPrompt('');
    setResponse('');
  }

  return (
    <div className="app-container">
      <h1>🌟CHATBOT🌟</h1>
      <p>An userfriendly website for the prompt engineering</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter prompt"
          disabled={loading}
          aria-label="Prompt input"
          autoFocus
        />
        <button type="submit" disabled={loading} aria-busy={loading}>
          {loading ? 'Generating...' : 'Generate'}
        </button>
        <button
          type="button"
          className="clear-button"
          onClick={handleClear}
          disabled={loading || (!prompt && !response)}
          aria-label="Clear input and response"
        >
          Clear
        </button>
      </form>

      <div className="response-container" aria-live="polite">
        {response && <pre>{response}</pre>}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
