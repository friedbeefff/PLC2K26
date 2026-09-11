export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message required' });
  }
  
  const API_KEY = process.env.GEMINI_API_KEY; // ← Dibaca dari Environment Variable
  const MODEL = 'gemini-3.6-flash';
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  
  const SYSTEM_PROMPT = `Kamu adalah asisten virtual ramah untuk event PLC 2K26 - AMICCO (tema Mario & Wreck-It Ralph).
Jawab dengan singkat, santai, pakai bahasa Indonesia, dan emoji seperlunya.

INFO EVENT:
- Tanggal: 1-3 Oktober 2026
- Tempat: SMAK Penabur Bandar Lampung
- 6 lomba: Basket 3x3, Cerpen, English Olympiad, Kpop Dance, Spelling Bee, Cosplay
- Pendaftaran: 19 Aug - 25 Sept 2026
- Technical Meeting: 28 September 2026
- Puncak acara: 3 Oktober 2026
- Contact Person: +62 899-6801-450

Jawab HANYA seputar PLC 2K26.`;

  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: SYSTEM_PROMPT + '\n\nUser: ' + message }]
        }]
      })
    });
    
    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content) {
      return res.status(200).json({ 
        reply: data.candidates[0].content.parts[0].text 
      });
    }
    
    return res.status(500).json({ error: 'No response from Gemini', details: data });
  } catch (error) {
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}
