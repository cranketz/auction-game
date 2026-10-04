# Auction Game

## Yerel çalıştırma
Node.js 22 veya üzeri:

```
npm ci
node --test
node server.js
```

http://127.0.0.1:3000 adresini açın. İkinci oyuncu farklı bir tarayıcı profili kullanmalıdır. Diğer oyuncular hazır olur; oda sahibi maçı doğrudan başlatır.

## Vercel yayını
- GitHub: https://github.com/cranketz/auction-game
- Hedef: oyun.redodesign.art (ana siteden ayrı proje)
- Framework: Other; çıktı: public; API: api/[...path].js; bölge: Frankfurt.
- Vercel Marketplace üzerinden ayrı Neon Free veritabanını projeye bağlayın. DATABASE_URL sadece sunucuda kullanılmalıdır.
- GitHub main güncellemeleri Vercel proje bağlantısından otomatik yayımlanır.
- Yerelde aynı veritabanını denemek için gizli .env.local ile node --env-file=.env.local server.js çalıştırın. Ortam dosyalarını Git'e eklemeyin.

Oda, misafir oturumu ve maç durumu Postgres'te saklanır. Sürüm karşılaştırmalı atomik güncellemeler aynı anda gelen tekliflerin birbirini silmesini önler. Maç süreleri sunucuda kontrol edilir; açık istemcinin güncelleme isteği zamanı dolan turu ilerletir. Hiç kimse bağlı değilse maç sonraki istekte ilerler. İstemciler oyun sırasında yaklaşık 750 ms, lobide 2,5 saniye aralıkla durum alır. Bu ilk küçük ölçekli yayındır: en fazla 5 oda / oda başına 6 kişi. Daha büyük kullanım için oda bazlı depolama ve gerçek zamanlı yayın servisi gerekir.

Oturum cookie'si HttpOnly, SameSite=Strict ve yayında Secure'dür; 7 gün geçerlidir. Girişler IP başına 10 dakikada 20 ile sınırlıdır. 6 saattir işlem yapılmayan odalar temizlenir. Ana domain veya diğer projelerin DNS/veritabanı ayarları değiştirilmez.

Kahvaltı 16 temel, 16 ekstra model ve ikili/üçlü uyum puanlaması içerir. Puanlar yalnızca sonuçta gösterilir. Bilgisayar uyumluluğu ve çorbanın gizli uyumları henüz geçici puanlama kullanır. Bağlantısı kopan oda sahibinin otomatik devri henüz yoktur.

Plan: PROJE_PLANI.md. 17 test; servis testi eşzamanlı teklifler ve saklanıp geri yüklenen tam maç akışını kapsar. Ücretsiz planların kullanım kotaları Vercel ve Neon panelinden izlenmelidir.
