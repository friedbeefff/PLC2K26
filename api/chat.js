export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { message, history } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });
  
  // ===== CEK KEYWORD SPESIAL DULU (sebelum ke Groq) =====
  const specialResponse = checkSpecialKeywords(message);
  if (specialResponse) {
    return res.status(200).json({ reply: specialResponse });
  }
  
  const API_KEY = process.env.GROQ_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: 'API key not configured' });
  
  const URL = 'https://api.groq.com/openai/v1/chat/completions';
  const MODEL = 'openai/gpt-oss-20b';
  
  const SYSTEM_PROMPT = `Kamu adalah "AMICCO Bot" — asisten virtual resmi untuk event PLC 2K26 - AMICCO (tema Mario & Wreck-It Ralph).

IDENTITAS KAMU (WAJIB DIINGAT):
- Nama kamu: AMICCO Bot (atau Asisten PLC 2K26)
- Kamu BUKAN ChatGPT, BUKAN Gemini, BUKAN Claude, BUKAN AI lain.
- Kalau ditanya "kamu siapa?" → jawab: "Aku AMICCO Bot, asisten virtual PLC 2K26! 🍄"
- JANGAN pernah nyebut diri sebagai ChatGPT, Gemini, Claude, atau AI lain.
- JANGAN pernah nyebut OpenAI, Google, Anthropic, atau perusahaan AI lain.

GAYA BICARA:
- Ramah, santai, pakai bahasa Indonesia.
- Singkat, gak bertele-tele.
- Pakai emoji seperlunya (max 2-3 per pesan).

ATURAN MENJAWAB:
1. Pahami MAKSUD pertanyaan, bukan cuma kata kunci.
2. "contact person"/"CP"/"nomor" → kasih NOMOR WA/IG, JANGAN link form.
3. "cara daftar" → kasih LINK FORM.
4. "lomba hari 1" → Basket SMA, Basket SMP, English Olympiad, Kpop Dance.
5. "lomba hari 2" → Basket SMA, Basket SMP, Spelling Bee, Cosplay.
6. Di luar topik PLC 2K26 → tolak sopan, arahin balik ke topik event.

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

  let recentHistory = [];
  if (Array.isArray(history) && history.length > 0) {
    recentHistory = history.slice(-6);
  }

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
        max_tokens: 500
      })
    });
    
    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return res.status(200).json({ 
        reply: data.choices[0].message.content,
        usage: data.usage
      });
    }
    
    return res.status(500).json({ error: 'No response from Groq', details: data });
  } catch (error) {
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}

// ===== HARDCODED RESPONSES (easter egg & info spesifik) =====
const SPECIAL_KEYWORDS = [
  {
    keywords: ['siapa yang buat', 'yang bikin', 'developer', 'pembuat', 'creator', 'yg buat', 'buat web', 'bikin web'],
    response: 'Web dan AI ini dibuat oleh salah satu siswa SMAK BPK Penabur Bandar Lampung, lho! 😎'
  },
  {
    keywords: ['plc itu apa', 'apa itu plc', 'plc tuh apa', 'apasih itu plc', 'apasih plc', 'what is plc', 'plc apa', 'kenapa nama nya plc', 'definisi plc', 'penabur laser competition', 'plc adalah'],
    response: 'PLC (Penabur Laser Competition) adalah event tahunan dari SMAK BPK Penabur Bandar Lampung. PLC merupakan singkatan dari PENABUR LASER(Language, Art, Sports, and Entrepreneur) COMPETITION. Acara ini jadi wadah buat siswa-siswi berbakat dan sudah berlangsung bertahun-tahun dan selalu rame! 🔥'
  }
];

function checkSpecialKeywords(message) {
  const lower = message.toLowerCase();
  for (const item of SPECIAL_KEYWORDS) {
    for (const kw of item.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        return item.response;
      }
    }
  }
  return null;
}
