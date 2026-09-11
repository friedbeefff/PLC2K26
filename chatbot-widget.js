(function() {
  const styles = `
    #plc-chat-widget { position: fixed; bottom: 24px; right: 24px; z-index: 9999; font-family: 'Segoe UI', sans-serif; }
    #plc-chat-bubble { width: 60px; height: 60px; background: linear-gradient(135deg, #e63946, #ff6b6b); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 8px 30px rgba(230, 57, 70, 0.6), 0 0 0 4px rgba(30, 30, 47, 0.8); transition: transform 0.3s; }
    #plc-chat-bubble:hover { transform: scale(1.1); }
    #plc-chat-bubble svg { width: 28px; height: 28px; fill: white; }
    #plc-chat-popup { position: fixed; bottom: 100px; right: 24px; width: 380px; height: 550px; background: #1e1e2f; border-radius: 20px; box-shadow: 0 25px 80px rgba(0, 0, 0, 0.8), 0 0 0 2px rgba(255, 255, 255, 0.1), 0 0 60px rgba(230, 57, 70, 0.3); display: none; flex-direction: column; overflow: hidden; border: 1px solid #444; z-index: 10000; animation: slideUp 0.3s ease; }
    #plc-chat-popup.active { display: flex; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    #plc-chat-header { background: linear-gradient(135deg, #e63946, #ff6b6b); padding: 16px 20px; display: flex; align-items: center; gap: 12px; position: relative; }
    #plc-chat-header .bot-avatar { width: 42px; height: 42px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; }
    #plc-chat-header .bot-info h2 { color: white; font-size: 16px; font-weight: 700; margin: 0; }
    #plc-chat-header .bot-info p { color: rgba(255,255,255,0.8); font-size: 11px; margin: 0; }
    #plc-close-btn { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); background: none; border: none; color: white; font-size: 24px; cursor: pointer; opacity: 0.8; }
    #plc-close-btn:hover { opacity: 1; }
    #plc-chat-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
    #plc-chat-messages .message { max-width: 85%; padding: 10px 14px; border-radius: 16px; font-size: 13px; line-height: 1.5; animation: fadeIn 0.3s ease; white-space: pre-wrap; }
    #plc-chat-messages .message.bot { background: #2d2d44; color: #e0e0e0; align-self: flex-start; border-bottom-left-radius: 4px; }
    #plc-chat-messages .message.user { background: linear-gradient(135deg, #e63946, #ff6b6b); color: white; align-self: flex-end; border-bottom-right-radius: 4px; }
    #plc-chat-messages .message a { color: #ff6b6b; }
    #plc-quick-replies { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 8px; }
    #plc-quick-replies .quick-reply { background: #2d2d44; color: #e0e0e0; border: 1px solid #444; padding: 6px 12px; border-radius: 16px; font-size: 11px; cursor: pointer; transition: all 0.2s; }
    #plc-quick-replies .quick-reply:hover { background: #e63946; border-color: #e63946; color: white; }
    #plc-chat-input { display: flex; padding: 12px 16px; background: #16162a; gap: 8px; border-top: 1px solid #333; }
    #plc-chat-input input { flex: 1; background: #2d2d44; border: 1px solid #444; border-radius: 20px; padding: 10px 16px; color: white; font-size: 16px; outline: none; }
    #plc-chat-input input:focus { border-color: #e63946; }
    #plc-chat-input button { background: linear-gradient(135deg, #e63946, #ff6b6b); border: none; border-radius: 50%; width: 38px; height: 38px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    #plc-chat-input button svg { width: 16px; height: 16px; fill: white; }
    #plc-typing { display: none; align-self: flex-start; background: #2d2d44; padding: 10px 14px; border-radius: 16px; border-bottom-left-radius: 4px; }
    #plc-typing span { display: inline-block; width: 6px; height: 6px; background: #888; border-radius: 50%; margin: 0 2px; animation: typing 1.4s infinite; }
    #plc-typing span:nth-child(2) { animation-delay: 0.2s; }
    #plc-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typing { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-8px); } }
    #plc-chat-messages::-webkit-scrollbar { width: 4px; }
    #plc-chat-messages::-webkit-scrollbar-thumb { background: #444; border-radius: 2px; }
    @media (max-width: 480px) { #plc-chat-popup { width: calc(100% - 32px); right: 16px; bottom: 90px; height: 60vh; } }
  `;

  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  const widget = document.createElement('div');
  widget.id = 'plc-chat-widget';
  widget.innerHTML = `
    <div id="plc-chat-bubble">
      <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
    </div>
    <div id="plc-chat-popup">
      <div id="plc-chat-header">
        <div class="bot-avatar">🍄</div>
        <div class="bot-info">
          <h2>PLC 2K26 AI Assistant</h2>
          <p>AMICCO - Find Your Wonder</p>
        </div>
        <button id="plc-close-btn">×</button>
      </div>
      <div id="plc-chat-messages">
        <div class="message bot">Halo! 👋 Saya asisten virtual <strong>PLC 2K26 - AMICCO</strong>. Tanya apa saja seputar event ini ya! 🍄</div>
      </div>
      <div id="plc-quick-replies">
        <button class="quick-reply" data-text="Jadwal event">📅 Jadwal</button>
        <button class="quick-reply" data-text="Daftar lomba">⭐ Lomba</button>
        <button class="quick-reply" data-text="Cara daftar">📝 Daftar</button>
        <button class="quick-reply" data-text="Hadiah pemenang">🏆 Hadiah</button>
        <button class="quick-reply" data-text="Contact person">📞 CP</button>
      </div>
      <div id="plc-chat-input">
        <input type="text" id="plc-user-input" placeholder="Tanyakan sesuatu tentang PLC 2K26..." />
        <button id="plc-send-btn"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>
      </div>
    </div>
  `;
  document.body.appendChild(widget);

  // ===== RIWAYAT CHAT (disimpan di browser) =====
  let chatHistory = [];
  const MAX_HISTORY = 6; // Simpan maksimal 6 pesan (3 pasang)

  // ===== FUNGSI PANGGIL API =====
  async function askGemini(userMessage) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          history: chatHistory
        })
      });
      
      if (!response.ok) {
        throw new Error('API error: ' + response.status);
      }
      
      const data = await response.json();
      return data.reply || 'Maaf, saya tidak bisa jawab itu.';
    } catch (error) {
      console.error('Error:', error);
      return getKeywordResponse(userMessage);
    }
  }

  // ===== FALLBACK KEYWORD MATCHING =====
  function getKeywordResponse(input) {
    const lowerInput = input.toLowerCase();
    
    const kb = [
      { keywords: ['jadwal', 'kapan', 'tanggal', 'timeline'], answer: '📅 Timeline PLC 2K26:\n• Gelombang 1: 19 Aug - 6 Sept 2026\n• Gelombang 2: 7 Sept - 25 Sept 2026\n• Technical Meeting: 28 Sept 2026\n• Hari Lomba: 1-2 Oktober 2026\n• Puncak Acara: 3 Oktober 2026' },
      { keywords: ['lomba', 'kompetisi', 'cabang'], answer: '⭐ Ada 6 lomba:\n1. 🏀 Basket 3x3\n2. ✍️ Cerpen\n3. 📚 English Olympiad\n4. 💃 Kpop Dance\n5. 🗣️ Spelling Bee\n6. 🎭 Cosplay Competition' },
      { keywords: ['daftar', 'registrasi', 'pendaftaran'], answer: '📝 Daftar di: https://forms.gle/izn1sfLVHSm1QRWy7\n\nPendaftaran dibuka sampai 25 September 2026!' },
      { keywords: ['hadiah', 'prize', 'juara'], answer: '🏆 Total hadiah 10 juta++ dengan piala & sertifikat untuk semua juara!' },
      { keywords: ['contact', 'cp', 'kontak', 'wa'], answer: '📞 Contact Person:\n+62 899-6801-450' },
      { keywords: ['tempat', 'lokasi', 'dimana'], answer: '📍 SMAK Penabur Bandar Lampung' },
      { keywords: ['biaya', 'harga', 'bayar'], answer: '💰 Biaya mulai Rp60.000 - Rp260.000 tergantung lomba & gelombang.' }
    ];
    
    let bestMatch = null, bestScore = 0;
    for (const item of kb) {
      let score = 0;
      for (const kw of item.keywords) {
        if (lowerInput.includes(kw)) score++;
      }
      if (score > bestScore) { bestScore = score; bestMatch = item; }
    }
    
    if (bestMatch) return bestMatch.answer;
    return 'Maaf, saya tidak bisa jawab itu. Coba tanya seputar jadwal, lomba, atau pendaftaran ya! 🍄';
  }

  function addMessage(text, isUser) {
    const msgs = document.getElementById('plc-chat-messages');
    const div = document.createElement('div');
    div.className = 'message ' + (isUser ? 'user' : 'bot');
    div.innerHTML = isUser ? text : text.replace(/\n/g, '<br>');
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    const msgs = document.getElementById('plc-chat-messages');
    const div = document.createElement('div');
    div.id = 'plc-typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    div.style.display = 'block';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTyping() {
    const t = document.getElementById('plc-typing');
    if (t) t.remove();
  }

  // ===== FUNGSI KIRIM PESAN (CUMA SATU!) =====
  async function sendMessage() {
    const input = document.getElementById('plc-user-input');
    const text = input.value.trim();
    if (!text) return;
    
    addMessage(text, true);
    input.value = '';
    showTyping();
    
    const response = await askGemini(text);
    hideTyping();
    addMessage(response, false);
    
    // ===== SIMPAN KE RIWAYAT =====
    chatHistory.push({ role: 'user', content: text });
    chatHistory.push({ role: 'assistant', content: response });
    
    // Potong riwayat kalau lebih dari MAX_HISTORY
    if (chatHistory.length > MAX_HISTORY) {
      chatHistory = chatHistory.slice(-MAX_HISTORY);
    }
  }

  // ===== EVENT LISTENERS =====
  document.getElementById('plc-chat-bubble').addEventListener('click', () => {
    document.getElementById('plc-chat-popup').classList.toggle('active');
  });

  document.getElementById('plc-close-btn').addEventListener('click', () => {
    document.getElementById('plc-chat-popup').classList.remove('active');
  });

  document.getElementById('plc-send-btn').addEventListener('click', sendMessage);

  document.getElementById('plc-user-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  document.querySelectorAll('.quick-reply').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('plc-user-input').value = btn.dataset.text;
      sendMessage();
    });
  });

  // Tombol AI di navbar (kalau ada)
  const aiToggleBtn = document.getElementById('aiToggleBtn');
  if (aiToggleBtn) {
    aiToggleBtn.addEventListener('click', () => {
      document.getElementById('plc-chat-popup').classList.toggle('active');
    });
  }
})();
