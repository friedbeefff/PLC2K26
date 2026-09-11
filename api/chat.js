export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { message, history } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });
  
  const API_KEY = process.env.GROQ_API_KEY;
  
  if (!API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }
  
  const URL = 'https://api.groq.com/openai/v1/chat/completions';
  const MODEL = 'openai/gpt-oss-20b';
  
  // ===== SYSTEM PROMPT (dipangkas biar hemat token) =====
  const SYSTEM_PROMPT = `Kamu asisten virtual PLC 2K26 - AMICCO (tema Mario & Wreck-It Ralph). Jawab singkat, santai, bahasa Indonesia, pakai emoji seperlunya.

ATURAN:
1. Pahami MAKSUD, bukan cuma kata kunci.
2. "contact person"/"CP"/"nomor" → kasih NOMOR WA/IG, JANGAN link form.
3. "cara daftar" → kasih LINK FORM.
4. "lomba hari 1" → Basket SMA, Basket SMP, English Olympiad, Kpop Dance.
5. "lomba hari 2" → Basket SMA, Basket SMP, Spelling Bee, Cosplay.
6. Di luar topik PLC 2K26 → tolak sopan.

INFO:
- Tanggal: 1-3 Okt 2026, SMAK Penabur Bandar Lampung
- Daftar: 19 Aug - 25 Sept 2026
- TM: 28 Sept 2026
- Puncak: 3 Okt 2026 (Pengumuman + Pentas Seni)
- Form: https://forms.gle/izn1sfLVHSm1QRWy7
- CP Umum: +62 899-6801-450 (WA), IG @official_posh
- CP Basket: Immanuel 0812-8232-0345 (SMA), Gracia 0895-0241-5525 (SMP)
- CP Cerpen: Patricia 0815-3233-0038 (SMA), Jocelyn 0878-7823-0338 (SMP)
- CP English/Spelling: Kenji 0815-9510-337
- CP Kpop: Darlene 0878-9057-4950`;

  // ===== SLIDING WINDOW: Ambil 3 pasang percakapan terakhir =====
  let recentHistory = [];
  if (Array.isArray(history) && history.length > 0) {
    // Ambil maksimal 6 pesan terakhir (3 pasang user+bot)
    recentHistory = history.slice(-6);
  }

  // ===== SUSUN MESSAGES =====
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...recentHistory,
    { role: 'user', content: message }
  ];

  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 500 // Batasi panjang jawaban biar hemat token
      })
    });
    
    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return res.status(200).json({ 
        reply: data.choices[0].message.content,
        usage: data.usage // Buat pantau token terpakai
      });
    }
    
    return res.status(500).json({ error: 'No response from Groq', details: data });
  } catch (error) {
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}
