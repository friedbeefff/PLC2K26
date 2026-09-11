export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });
  
  const API_KEY = process.env.GROQ_API_KEY;
  
  if (!API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }
  
  // Groq pakai endpoint OpenAI-compatible
  const URL = 'https://api.groq.com/openai/v1/chat/completions';
  
  // Pilih model. Llama 3.1 8B paling tinggi limit hariannya (14.400/hari).
  const MODEL = 'llama-3.1-8b-instant'; 
  
  const SYSTEM_PROMPT = `Kamu adalah asisten virtual ramah untuk event PLC 2K26 - AMICCO (tema Mario & Wreck-It Ralph).
Jawab dengan singkat, santai, pakai bahasa Indonesia, dan emoji seperlunya.

ATURAN PENTING:
1. PAHAMI MAKSUD pertanyaan, bukan cuma kata kuncinya.
2. Kalau ditanya "contact person" / "CP" / "nomor" → kasih NOMOR WA/IG, JANGAN kasih link form.
3. Kalau ditanya "cara daftar" → baru kasih LINK FORM.
4. Kalau ditanya "lomba hari 1" → jawab HANYA lomba hari 1 (Basket SMA, Basket SMP, English Olympiad, Kpop Dance).
5. Kalau ditanya "lomba hari 2" → jawab HANYA lomba hari 2 (Basket SMA, Basket SMP, Spelling Bee, Cosplay).
6. Kalau ditanya di luar topik PLC 2K26 → tolak dengan sopan.

INFO EVENT:
- Tanggal: 1-3 Oktober 2026
- Tempat: SMAK Penabur Bandar Lampung
- Pendaftaran: 19 Aug - 25 Sept 2026 (Early Bird & Late Bird)
- Technical Meeting: 28 September 2026
- Hari 1 (1 Okt): Basket 3x3 SMA, Basket 3x3 SMP, English Olympiad, Kpop Dance
- Hari 2 (2 Okt): Basket 3x3 SMA, Basket 3x3 SMP, Spelling Bee, Cosplay
- Puncak (3 Okt): Pengumuman + Pentas Seni
- Form daftar: https://forms.gle/izn1sfLVHSm1QRWy7
- Contact Person Umum: +62 899-6801-450 (WA), IG @official_posh
- CP Basket: Immanuel (SMA) 0812-8232-0345, Gracia (SMP) 0895-0241-5525
- CP Cerpen: Patricia (SMA) 0815-3233-0038, Jocelyn (SMP) 0878-7823-0338
- CP English Olympiad & Spelling Bee: Kenji 0815-9510-337
- CP Kpop Dance: Darlene 0878-9057-4950

Jawab HANYA seputar PLC 2K26.`;

  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}` // Groq pakai Authorization Bearer
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message }
        ],
        temperature: 0.7
      })
    });
    
    const data = await response.json();
    
    // Cek struktur response Groq
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return res.status(200).json({ reply: data.choices[0].message.content });
    }
    
    return res.status(500).json({ error: 'No response from Groq', details: data });
  } catch (error) {
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}
