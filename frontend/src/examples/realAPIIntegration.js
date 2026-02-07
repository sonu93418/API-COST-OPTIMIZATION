/**
 * REAL API TRACKING INTEGRATION EXAMPLES
 * 
 * This file shows how to integrate real API tracking into your application code.
 * Replace the seeded data with actual API calls from your application.
 */

import { trackAPICall, logAPICall } from '../services/apiLogService';

// =====================================================
// EXAMPLE 1: OpenAI Integration
// =====================================================
export const callOpenAI = async (prompt) => {
  const result = await trackAPICall(
    'OpenAI',                           // Provider name
    '/v1/chat/completions',             // Endpoint
    'POST',                              // HTTP method
    'GPT-4',                             // Feature/Model name
    async () => {
      // Your actual OpenAI API call
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }]
        })
      });
      
      return await response.json();
    }
  );
  
  // The function automatically logs:
  // - Input tokens (from result.usage.prompt_tokens)
  // - Output tokens (from result.usage.completion_tokens)
  // - Response time (automatically calculated)
  // - Status (success/failed)
  // - Cost (automatically calculated based on pricing rules)
  
  return result;
};

// =====================================================
// EXAMPLE 2: Anthropic Claude Integration
// =====================================================
export const callClaude = async (message) => {
  const result = await trackAPICall(
    'Anthropic',
    '/v1/messages',
    'POST',
    'Claude-3.5-Sonnet',
    async () => {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          messages: [{ role: 'user', content: message }]
        })
      });
      
      return await response.json();
    }
  );
  
  return result;
};

// =====================================================
// EXAMPLE 3: Google Gemini Integration
// =====================================================
export const callGemini = async (text) => {
  const result = await trackAPICall(
    'Google',
    '/v1/models/gemini-pro:generateContent',
    'POST',
    'Gemini-Pro',
    async () => {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.REACT_APP_GOOGLE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text }] }]
          })
        }
      );
      
      return await response.json();
    }
  );
  
  return result;
};

// =====================================================
// EXAMPLE 4: Hugging Face Integration
// =====================================================
export const callHuggingFace = async (inputs) => {
  const result = await trackAPICall(
    'Hugging Face',
    '/models/bert-base-uncased',
    'POST',
    'BERT-Base-Uncased',
    async () => {
      const response = await fetch(
        'https://api-inference.huggingface.co/models/bert-base-uncased',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ inputs })
        }
      );
      
      return await response.json();
    }
  );
  
  return result;
};

// =====================================================
// EXAMPLE 5: Custom API Without Token Usage
// =====================================================
export const callCustomAPI = async (data) => {
  // For APIs that don't return token usage, log manually
  const startTime = Date.now();
  
  try {
    const response = await fetch('https://your-api.com/endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    const responseTime = Date.now() - startTime;
    
    // Manual logging
    await logAPICall({
      providerName: 'Custom API',
      endpoint: '/endpoint',
      method: 'POST',
      featureName: 'Custom Feature',
      requestCount: 1,
      inputTokens: 0,      // Set to 0 if not applicable
      outputTokens: 0,     // Set to 0 if not applicable
      responseTime,
      status: response.ok ? 'success' : 'failed',
      errorMessage: response.ok ? null : result.error
    });
    
    return result;
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    // Log failed request
    await logAPICall({
      providerName: 'Custom API',
      endpoint: '/endpoint',
      method: 'POST',
      featureName: 'Custom Feature',
      requestCount: 1,
      inputTokens: 0,
      outputTokens: 0,
      responseTime,
      status: 'failed',
      errorMessage: error.message
    });
    
    throw error;
  }
};

// =====================================================
// EXAMPLE 6: React Component Using Real API
// =====================================================
export const ChatComponent = () => {
  const [message, setMessage] = React.useState('');
  const [response, setResponse] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSend = async () => {
    setLoading(true);
    
    try {
      // This will automatically log the API call
      const result = await callOpenAI(message);
      setResponse(result.choices[0].message.content);
      
      // The API call is already logged! 
      // You can now see it in the "API Logs" page with:
      // - Exact timestamp
      // - Token usage
      // - Response time
      // - Calculated cost
      
    } catch (error) {
      console.error('Error:', error);
      // Failed calls are also logged automatically
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={handleSend} disabled={loading}>
        {loading ? 'Sending...' : 'Send'}
      </button>
      {response && <div>{response}</div>}
    </div>
  );
};

// =====================================================
// EXAMPLE 7: Batch Processing Multiple API Calls
// =====================================================
export const processBatch = async (items) => {
  const promises = items.map(item => 
    trackAPICall(
      'OpenAI',
      '/v1/embeddings',
      'POST',
      'text-embedding-ada-002',
      async () => {
        const response = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'text-embedding-ada-002',
            input: item.text
          })
        });
        
        return await response.json();
      }
    )
  );
  
  const results = await Promise.all(promises);
  
  // All API calls are logged individually!
  // You'll see each one in the API Logs page
  
  return results;
};

// =====================================================
// HOW TO USE IN YOUR APPLICATION
// =====================================================

/*
STEP 1: Install the tracking in your existing code
------------------------------------------------------
Replace your existing API calls like this:

// BEFORE:
const response = await openai.chat.completions.create({...});

// AFTER:
const response = await callOpenAI(prompt);


STEP 2: View real data
------------------------------------------------------
1. Make actual API calls in your application
2. Go to "Test Logger" page to manually log test calls
3. Go to "API Logs" page to see all logged calls
4. Turn on "Live Monitor" to see calls appear in real-time


STEP 3: Monitor costs in real-time
------------------------------------------------------
- Dashboard shows total costs and trends
- Alerts notify you when costs exceed thresholds
- Budgets help you control spending
- Optimization page suggests cost-saving opportunities


STEP 4: Stop using seeded data
------------------------------------------------------
Once you have real API calls logging, you can:
1. Go to "API Logs" page
2. Click "Clear All Logs" button (if implemented)
3. Or manually delete seeded data from MongoDB

Now you only have REAL data from your actual application!
*/
