(function() {
  const styles = `
    #plc-chat-widget { position: fixed; bottom: 24px; right: 24px; z-index: 9999; font-family: 'Segoe UI', sans-serif; }
    #plc-chat-bubble { width: 60px; height: 60px; background: linear-gradient(135deg, #e63946, #ff6b6b); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 20px rgba(230,57,70,0.4); transition: transform 0.3s; }
    #plc-chat-bubble:hover { transform: scale(1.1); }
    #plc-chat-bubble svg { width: 28px; height: 28px; fill: white; }
    #plc-chat-popup { position: fixed; bottom: 100px; right: 24px; width: 380px; height: 550px; background: #1e1e2f; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.4); display: none; flex-direction: column; overflow: hidden; border: 1px solid #333; z-index: 10000; animation: slideUp 0.3s ease; }
    #plc-chat-popup.active { display: flex; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    #plc-chat-header { background: linear-gradient(135deg, #e63946, #ff6b6b); padding: 16px 20px; display: flex; align-items: center; gap: 12px; position: relative; }
    #plc-chat-header .bot-avatar { width: 42px; height: 42px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; }
    #plc-chat-header .bot-info h2 { color: white; font-size: 16px; font-weight: 700; margin: 0; }
    #plc-chat-header .bot-info p { color: rgba(255,255,255,0.8); font-size: 11px; margin: 0; }
    #plc-close-btn { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); background: none; border: none; color: white; font-size: 24px; cursor: pointer; opacity: 0.8; }
    #plc-close-btn:hover { opacity: 1; }
    #plc-chat-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
    #plc-chat-messages .message { max-width: 85%; padding: 10px 14px; border-radius: 16px; font-size: 13px; line-height: 1.5; animation: fadeIn 0.3s ease; }
    #plc-chat-messages .message.bot { background: #2d2d44; color: #e0e0e0; align-self: flex-start; border-bottom-left-radius: 4px; }
    #plc-chat-messages .message.user { background: linear-gradient(135deg, #e63946, #ff6b6b); color: white; align-self: flex-end; border-bottom-right-radius: 4px; }
    #plc-chat-messages .message a { color: #ff6b6b; }
    #plc-quick-replies { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 8px; }
    #plc-quick-replies .quick-reply { background: #2d2d44; color: #e0e0e0; border: 1px solid #444; padding: 6px 12px; border-radius: 16px; font-size: 11px; cursor: pointer; transition: all 0.2s; }
    #plc-quick-replies .quick-reply:hover { background: #e63946; border-color: #e63946; color: white; }
    #plc-chat-input { display: flex; padding: 12px 16px; background: #16162a; gap: 8px; border-top: 1px solid #333; }
    #plc-chat-input input { flex: 1; background: #2d2d44; border: 1px solid #444; border-radius: 20px; padding: 10px 16px; color: white; font-size: 13px; outline: none; }
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
          <h2>PLC 2K26 Bot</h2>
          <p>AMICCO - Find Your Wonder</p>
        </div>
        <button id="plc-close-btn">×</button>
      </div>
      <div id="plc-chat-messages">
        <div class="message bot">Halo! 👋 Saya asisten virtual <strong>PLC 2K26 - AMICCO</strong>. Saya bisa membantu menjawab pertanyaan seputar event PLC 2K26!<br><br>Tanya saja tentang jadwal, lomba, pendaftaran, atau informasi lainnya. 🍄</div>
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

  const knowledgeBase = [
    { keywords: ["tentang","apa itu","apa","amicco","plc","event","theme","tema","mario","wreck-it ralph","penabur"], answer: "<strong>PLC 2K26 - AMICCO</strong> 🍄<br><br>AMICCO adalah tema event PLC2K26 yang merupakan kolaborasi antara dunia <strong>Mario</strong> dan <strong>Wreck-It Ralph</strong>! Event ini diselenggarakan oleh <strong>SMAK Penabur Bandar Lampung (BPK Penabur)</strong>.<br><br>Temukan keajaiban dalam PLC2K26 dan ikuti keseruan lombanya!! ⭐" },
    { keywords: ["jadwal","tanggal","hari","kapan","waktu","schedule","timeline","gelombang","pendaftaran","technical meeting","tm","pensi","pentas seni"], answer: "<strong>📅 Timeline PLC 2K26</strong><br><br><strong>📋 PENDAFTARAN:</strong><br>• Gelombang 1 (Early Bird): 19 Aug - 6 Sept 2026<br>• Gelombang 2 (Late Bird): 7 Sept - 25 Sept 2026<br><br><strong>✍️ LOMBA ONLINE (Cerpen):</strong><br>• 19 Aug - 25 Sept 2026<br>• Technical Meeting: 19 Sept 2026<br>• Close registration: 21 Sept 2026<br><br><strong>📌 TECHNICAL MEETING:</strong><br>• 28 September 2026<br><br><strong>⚡ ACARA LOMBA:</strong><br>• Hari 1 (1 Okt): Basket 3x3 SMA, Basket 3x3 SMP, English Olympiad, Kpop Dance<br>• Hari 2 (2 Okt): Basket 3x3 SMA, Basket 3x3 SMP, Spelling Bee, Cosplay Competition<br><br><strong>🌟 PUNCAK ACARA:</strong><br>• Hari 3 (3 Okt): Pengumuman Pemenang, Penutupan & Pentas Seni 🎊" },
{ keywords: ["lomba","kompetisi","cabang","competition","perlombaan","apa saja","daftar lomba"], answer: "<strong>⭐ Daftar Lomba PLC 2K26</strong><br><br>1. 🏀 <strong>Basket 3x3</strong> (SMP & SMA/SMK)<br>2. ✍️ <strong>Menulis Cerita Pendek</strong> (SMP & SMA/SMK)<br>3. 📚 <strong>English Olympiad</strong> (SMP)<br>4. 💃 <strong>Kpop Dance</strong> (SMP & SMA/SMK)<br>5. 🗣️ <strong>Spelling Bee</strong> (SMP)<br>6. 🎭 <strong>Cosplay Competition</strong> (SMP, SMA, SMK)<br><br>Mau tahu detail atau aturan lomba tertentu?" },
    { keywords: ["basket","basketball","3x3","olahraga","lapangan"], answer: "<strong>🏀 Basket 3x3 Putra</strong><br><br><strong>Tingkat:</strong> SMP & SMA/SMK<br><strong>Tempat:</strong> Lapangan SMAK Penabur Bandar Lampung<br><strong>Hari:</strong> 1 & 2 Oktober 2026<br><br><strong>Biaya:</strong><br>• SMP Early Bird: Rp200.000 | Late Bird: Rp210.000<br>• SMA/SMK Early Bird: Rp250.000 | Late Bird: Rp260.000<br><br><strong>Syarat:</strong><br>• Pelajar se-Provinsi Lampung<br>• Max 3 tim per sekolah<br>• Format: 3 pemain inti + 1 cadangan<br>• Wajib jersey<br><br><strong>Hadiah SMA:</strong><br>🥇 Rp1.200.000 + piala + sertifikat<br>🥈 Rp1.000.000 + piala + sertifikat<br>🥉 Rp800.000 + piala + sertifikat<br><br><strong>Hadiah SMP:</strong><br>🥇 Rp900.000 + piala + sertifikat<br>🥈 Rp700.000 + piala + sertifikat<br>🥉 Rp500.000 + piala + sertifikat<br><br><strong>CP:</strong> Immanuel (SMA/K) 0812-8232-0345 | Gracia (SMP) 0895-0241-5525" },
    { keywords: ["cerpen","cerita pendek","menulis","naskah","karya tulis","sastra"], answer: "<strong>✍️ Menulis Cerita Pendek</strong><br><br><strong>Tingkat:</strong> SMP & SMA/SMK<br><strong>Pelaksanaan:</strong> ONLINE<br><br><strong>Biaya:</strong><br>• Early Bird: Rp60.000<br>• Late Bird: Rp65.000<br><br><strong>Tema:</strong> \"Satu Perjalanan, Seribu Kenangan\"<br><br><strong>Ketentuan:</strong><br>• 1000-1500 kata<br>• Font: Arial 16 (judul), Times New Roman 12 (isi)<br>• Spasi 1.5, margin 3, kertas A4<br>• Orisinil, belum dipublikasikan<br>• <strong>DILARANG menggunakan AI</strong><br>• Tidak boleh mengandung SARA & pornografi<br><br><strong>Timeline:</strong><br>• Technical Meeting: 19 Sept 2026<br>• Close registration: 21 Sept 2026<br>• Pengumpulan: maks 25 Sept 2026 pukul 23:59<br><br><strong>Hadiah SMA:</strong> 🥇 Rp400.000 | 🥈 Rp350.000 | 🥉 Rp300.000<br><strong>Hadiah SMP:</strong> 🥇 Rp350.000 | 🥈 Rp300.000 | 🥉 Rp250.000<br><br><strong>CP:</strong> Patricia (SMA/K) 0815-3233-0038 | Jocelyn (SMP) 0878-7823-0338" },
    { keywords: ["english","olympiad","bahasa inggris","grammar","vocabulary"], answer: "<strong>📚 English Olympiad</strong><br><br><strong>Tingkat:</strong> SMP saja<br><strong>Tempat:</strong> Ruang kelas SMAK Penabur Bandar Lampung<br><strong>Hari:</strong> 1 Oktober 2026<br><br><strong>Biaya:</strong> Early Bird: Rp70.000 | Late Bird: Rp80.000<br><br><strong>Teknis:</strong> 50 soal pilihan ganda, 75 menit<br>Materi: Reading Comprehension, Vocabulary, Grammar, Error Recognition<br><br><strong>Penilaian:</strong> Benar +4, Salah -1, Kosong 0<br><br><strong>Larangan:</strong> Dilarang bawa ponsel/smartwatch, dilarang correction tape<br><br><strong>Hadiah:</strong> 🥇 Rp500.000 | 🥈 Rp400.000 | 🥉 Rp350.000<br><br><strong>CP:</strong> Kenji 0815-9510-337" },
    { keywords: ["kpop","dance","tari","menari","koreografi","choreo"], answer: "<strong>💃 Kpop Dance</strong><br><br><strong>Tingkat:</strong> SMP & SMA/SMK<br><strong>Tempat:</strong> Aula SMAK Penabur Bandar Lampung<br><strong>Hari:</strong> 1 Oktober 2026<br><br><strong>Biaya:</strong> Early Bird: Rp150.000 | Late Bird: Rp160.000<br><br><strong>Syarat:</strong> Tim 4-8 orang, max 5 tim/sekolah, dari club/sanggar TIDAK boleh<br>Durasi maks 5 min, lagu disediakan sendiri (MP3)<br><br><strong>Kriteria:</strong> Penampilan 20%, Teknik 45%, Ketepatan Waktu 15%, Ekspresi 20%<br><br><strong>Hadiah:</strong> 🥇 Rp1.000.000 | 🥈 Rp800.000 | 🥉 Rp600.000<br><br><strong>CP:</strong> Darlene 0878-9057-4950" },
{ keywords: ["spelling","ejaan","spell","huruf"], answer: "<strong>🗣️ Spelling Bee</strong><br><br><strong>Tingkat:</strong> SMP saja<br><strong>Tempat:</strong> Ruang kelas SMAK Penabur Bandar Lampung<br><strong>Hari:</strong> 2 Oktober 2026<br><br><strong>Biaya:</strong> Early Bird: Rp70.000 | Late Bird: Rp80.000<br><br><strong>4 Babak:</strong> Preliminary (30 kata, 25 min), Quarter-final (20 kata, 15 min), Semifinal (sistem bel), Final (sistem bel)<br><br><strong>Ketentuan:</strong> Silabus 200-300 kata, US spelling, dilarang bawa ponsel<br><br><strong>Penilaian:</strong> Benar +100, Salah -50<br><br><strong>Hadiah:</strong> 🥇 Rp500.000 | 🥈 Rp400.000 | 🥉 Rp350.000<br><br><strong>CP:</strong> Kenji 0815-9510-337" },
    { keywords: ["cosplay","kostum","anime","manga","karakter","game","coswalk"], answer: "<strong>🎭 Cosplay Competition</strong><br><br><strong>Tingkat:</strong> SMP, SMA, & SMK<br><strong>Tempat:</strong> Aula SMAK Penabur Bandar Lampung<br><strong>Hari:</strong> 2 Oktober 2026<br><br><strong>Biaya:</strong> Early Bird: Rp70.000 | Late Bird: Rp80.000<br><br><strong>Tema:</strong> Karakter bebas (game, anime, manga, series, modifikasi)<br><br><strong>Ketentuan:</strong> Individu, min 1 min max 3 min, backsound sendiri, max 1 pendamping<br>Karakter sopan, tidak vulgar/SARA, <strong>OC TIDAK diperbolehkan</strong>" },
    { keywords: ["daftar","pendaftaran","registrasi","form","cara daftar","cara mendaftar","link daftar"], answer: "<strong>📝 Cara Daftar PLC 2K26</strong><br><br>1. Klik link pendaftaran:<br>🔗 <a href=\"https://forms.gle/izn1sfLVHSm1QRWy7\" target=\"_blank\">Form Pendaftaran</a><br><br>2. Isi formulir, pilih gelombang (Early Bird atau Late Bird)<br>3. Bayar biaya pendaftaran<br>4. Upload bukti pembayaran<br>5. Tunggu konfirmasi panitia<br><br><strong>Biaya:</strong><br>• Basket SMP: Rp200rb/Rp210rb | SMA: Rp250rb/Rp260rb<br>• Cerpen: Rp60rb/Rp65rb | English Olympiad: Rp70rb/Rp80rb<br>• Kpop Dance: Rp150rb/Rp160rb | Spelling Bee: Rp70rb/Rp80rb<br>• Cosplay: Rp70rb/Rp80rb" },
    { keywords: ["hadiah","prize","juara","pemenang","piala","sertifikat","uang"], answer: "<strong>🏆 Hadiah Pemenang PLC 2K26</strong><br><br><strong>🏀 Basket 3x3 SMA:</strong> 🥇 Rp1.200.000 | 🥈 Rp1.000.000 | 🥉 Rp800.000<br><strong>🏀 Basket 3x3 SMP:</strong> 🥇 Rp900.000 | 🥈 Rp700.000 | 🥉 Rp500.000<br><strong>✍️ Cerpen SMA:</strong> 🥇 Rp400.000 | 🥈 Rp350.000 | 🥉 Rp300.000<br><strong>✍️ Cerpen SMP:</strong> 🥇 Rp350.000 | 🥈 Rp300.000 | 🥉 Rp250.000<br><strong>📚 English Olympiad:</strong> 🥇 Rp500.000 | 🥈 Rp400.000 | 🥉 Rp350.000<br><strong>💃 Kpop Dance:</strong> 🥇 Rp1.000.000 | 🥈 Rp800.000 | 🥉 Rp600.000<br><strong>🗣️ Spelling Bee:</strong> 🥇 Rp500.000 | 🥈 Rp400.000 | 🥉 Rp350.000<br><br>Semua termasuk piala + sertifikat! 🎉" },
    { keywords: ["contact","kontak","cp","whatsapp","nomer","nomor","telepon","tanya","panitia"], answer: "<strong>📞 Contact Person PLC 2K26</strong><br><br><strong>Basket 3x3:</strong> Immanuel (SMA) 0812-8232-0345 | Gracia (SMP) 0895-0241-5525<br><strong>Cerpen:</strong> Patricia (SMA) 0815-3233-0038 | Jocelyn (SMP) 0878-7823-0338<br><strong>English Olympiad:</strong> Kenji 0815-9510-337<br><strong>Kpop Dance:</strong> Darlene 0878-9057-4950<br><strong>Spelling Bee:</strong> Kenji 0815-9510-337" },
    { keywords: ["tempat","lokasi","venue","alamat","dimana","aula","lapangan","sekolah"], answer: "<strong>📍 Tempat Pelaksanaan</strong><br><br><strong>SMAK Penabur Bandar Lampung</strong> (BPK Penabur)<br><br>• 🏀 Basket 3x3: Lapangan<br>• 📚 English Olympiad: Ruang kelas<br>• 💃 Kpop Dance: Aula<br>• 🗣️ Spelling Bee: Ruang kelas<br>• 🎭 Cosplay Competition: Aula<br>• ✍️ Cerpen: ONLINE" },
{ keywords: ["pensi","pentas seni","penutup","puncak acara","hari 3","hari ketiga","3 okt","performance","pertunjukan","kelas"], answer: "<strong>🌟 Puncak Acara - Hari 3 (3 Oktober 2026)</strong><br><br>• 📢 Pengumuman Pemenang semua lomba<br>• 🎊 Penutupan resmi PLC 2K26<br>• 🎤 <strong>Pentas Seni</strong> - Pertunjukan dari setiap kelas!<br><br>Jangan sampai terlewatkan! 🎉🏆" },
    { keywords: ["syarat","ketentuan","aturan","rules","wajib"], answer: "<strong>📋 Syarat & Ketentuan Umum</strong><br><br>1. Pelajar se-Provinsi Lampung<br>2. Wajib penuhi persyaratan pendaftaran<br>3. Wajib hadir saat registrasi ulang<br>4. Mengundurkan diri = biaya tidak dikembalikan<br>5. Wajib ikuti Technical Meeting<br>6. Kecurangan = diskualifikasi tanpa refund<br>7. Keputusan panitia bersifat mutlak" },
    { keywords: ["biaya","harga","bayar","pembayaran","tarif","fee"], answer: "<strong>💰 Biaya Pendaftaran PLC 2K26</strong><br><br><strong>Early Bird (19 Aug - 6 Sept):</strong><br>• Basket SMP: Rp200.000 | SMA/SMK: Rp250.000<br>• Cerpen: Rp60.000 | English Olympiad: Rp70.000<br>• Kpop Dance: Rp150.000 | Spelling Bee: Rp70.000<br>• Cosplay: Rp70.000<br><br><strong>Late Bird (7 Sept - 25 Sept):</strong><br>• Basket SMP: Rp210.000 | SMA/SMK: Rp260.000<br>• Cerpen: Rp65.000 | English Olympiad: Rp80.000<br>• Kpop Dance: Rp160.000 | Spelling Bee: Rp80.000<br>• Cosplay: Rp80.000<br><br>💡 Daftar Early Bird lebih murah!" },
    { keywords: ["technical meeting","tm","pengarahan","grup","peraturan"], answer: "<strong>📌 Technical Meeting PLC 2K26</strong><br><br><strong>Tanggal:</strong> 28 September 2026<br><strong>Kecuali Cerpen:</strong> 19 September 2026<br><br><strong>Yang dibahas:</strong> Pengarahan lomba, pembagian grup, penjelasan peraturan, pengambilan nomor urut<br><br><strong>WAJIB hadir!</strong> Bagi yang tidak hadir dianggap setuju.<br><br>CP: Kenji 0815-9510-337" },
    { keywords: ["merch","merchandise","kaos","jual","beli"], answer: "<strong>🛍️ Merchandise PLC 2K26</strong><br><br>Cek info merchandise di website resmi:<br>🔗 <a href=\"https://plc-2k26.vercel.app/\" target=\"_blank\">plc-2k26.vercel.app</a><br><br>Atau hubungi panitia! 🛒" },
    { keywords: ["sponsor","sponsorship","kerja sama","partner"], answer: "<strong>🤝 Sponsor PLC 2K26</strong><br><br>Untuk info sponsorship, hubungi panitia melalui:<br>📧 Email / DM Instagram resmi PLC<br>📞 Contact Person di website<br><br>🔗 <a href=\"https://plc-2k26.vercel.app/\" target=\"_blank\">plc-2k26.vercel.app</a>" }
  ];

  const offTopicResponses = [
    "Maaf, saya hanya bisa menjawab pertanyaan seputar <strong>event PLC 2K26 - AMICCO</strong>. 🍄\n\nTanyakan saja tentang jadwal, lomba, pendaftaran, atau info lainnya ya!",
    "Saya khusus membantu informasi <strong>PLC 2K26</strong> saja. ⭐\n\nCoba tanya tentang lomba, jadwal, atau cara daftar!",
    "Wah, itu di luar tugas saya! 😅\n\nSaya di sini untuk membantu kamu soal <strong>PLC 2K26 - AMICCO</strong>. Mau tahu apa tentang event ini?",
    "Hmm, saya tidak bisa jawab itu. 🤔\n\nTapi saya bisa bantu kamu soal <strong>PLC 2K26</strong>! Coba tanya tentang lomba, jadwal, atau hadiah ya!"
  ];

  function findBestResponse(input) {
    const lowerInput = input.toLowerCase();
    let bestMatch = null, bestScore = 0;
    for (const item of knowledgeBase) {
      let score = 0;
      for (const keyword of item.keywords) {
        if (lowerInput.includes(keyword)) score++;
      }
      if (score > bestScore) { bestScore = score; bestMatch = item; }
    }
    return bestScore >= 1 ? bestMatch.answer : offTopicResponses[Math.floor(Math.random() * offTopicResponses.length)];
  }

  function addMessage(text, isUser) {
    const msgs = document.getElementById('plc-chat-messages');
    const div = document.createElement('div');
    div.className = 'message ' + (isUser ? 'user' : 'bot');
    div.innerHTML = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    const msgs = document.getElementById('plc-chat-messages');
const div = document.createElement('div');
    div.id = 'plc-typing';
    div.className = 'typing-indicator';
    div.innerHTML = '<span></span><span></span><span></span>';
    div.style.display = 'block';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTyping() {
    const t = document.getElementById('plc-typing');
    if (t) t.remove();
  }

  function sendMessage() {
    const input = document.getElementById('plc-user-input');
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, true);
    input.value = '';
    showTyping();
    setTimeout(() => {
      hideTyping();
      addMessage(findBestResponse(text), false);
    }, 600 + Math.random() * 500);
  }

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
})();
