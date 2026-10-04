# Auction Game — yerel prototip

Node.js 22 veya üzeri ile ek paket kurulmadan çalışır.

```
node --test
node server.js
```

Tarayıcıda http://127.0.0.1:3000 açın. İkinci oyuncu için farklı bir tarayıcı profili veya gizli pencere kullanın (aynı profildeki sekmeler aynı misafir oturumudur). İlk oyuncu oda kurar, diğeri açık listeden veya kodla katılır. İkisi de hazır olur, oda sahibi başlatır.

Bu sürüm motor ve yerel çok oyunculu dikey dilimdir. Üretim yayını değildir. Sunucu yalnızca yerel arayüze bağlıdır. Oda ve oturumlar bellekte tutulur, restartta silinir. Temel ödeme/eşitlik, iki cüzdan, gizli teklifler, açık teklifler, süre uzatma ve elle kombinasyon hazırdır.

Geçici puanlama: Farklı ürünlerin temel puanları ve tamamlanan temel set için +15. Çorbada taban ve ana malzeme yoksa 0. Bilgisayarın gerçek uyumluluk kuralları ve çorbanın gizli uyumları henüz yoktur. Kartlar metin tabanlıdır. Kalıcılık, bağlantı/yönetim devri, oda temizliği, hız sınırları, hazır ifadeler, ses, katalog ekranı ve gerçek görseller sonraki aşamalardır. Bu eksikler tamamlanmadan internete açmayın.

Planın tamamı PROJE_PLANI.md dosyasında. İlk prototip bilinçli olarak bağımlılıksız JavaScript ve SSE/HTTP kullanıyor; rapordaki TypeScript/React/Socket.IO mimarisi sonraki yapılandırma aşamasında değerlendirilecek. SSE sunucudan canlı güncelleme, HTTP ise komut iletimi sağlar.
