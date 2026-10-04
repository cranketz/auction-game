# Açık artırma kuralları · 4 Ekim 2026

## Oyun akışı

1. Oda sahibi tema, bütçe (50 / 100 / 150) ve görünürlük seçer. Süre seçimi kaldırılmıştır; her alışveriş turu 90 saniye başlar.
2. Gizli teklif, tercih sıralama, otomatik temel dağıtım ve ayrı temel/ekstra bakiyeleri yeni maçlarda yoktur. Seçilen bütçe oyuncunun tek bakiyesidir.
3. Bütün ürünler karışık sırayla, birer birer açık artırmaya çıkar. Önceki içerik miktarı korunur: oyuncu sayısı × (temanın ana ürün türü sayısı + 2). Kahvaltıda kişi başına 6, bilgisayarda 8, çorbada 5 ürün satışa çıkar. Model havuzlarından rastgele örneklenir; bütün katalog modelleri her maçta görünmez. Bilgisayar havuzunda oyuncu sayısı kadar kurulabilir sistemin parçaları bulunur; bu parçaların kime gideceği açık artırmada belirlenir.
4. “N TL teklif ver (+1)” mevcut teklifin 1 TL üstünü onay istemeden gönderir. Tutar sunucuda güncel fiyattan hesaplanır. Aynı anda iki farklı oyuncu basarsa teklifler kaybolmadan sırasıyla artar. Ayrı açılır alanda özel tutar yazılabilir. +1/+5/+10 ve eksi taslak düğmeleri kaldırılmıştır.
5. En yüksek teklif sahibi kendini yükseltemez. Oyuncu bakiyesini aşamaz. Geçerli tekliflerde önceki uzatma kuralı devam eder: ilk üç teklif +3'er, sonraki teklifler +1'er saniye. Geçersiz teklif süreyi uzatmaz.
6. “Pas geç” yalnızca o üründen çekilmektir; bu üründe tekrar teklif verilemez. Yeni üründe pas durumu sıfırlanır. Son teklif sahibi de pas geçebilir; bu, verilmiş teklifini iptal etmez.
7. Her oyuncu, son teklif sahibi dahil, pas geçtiğinde süre beklenmeden ürün son teklif sahibine verilir ve yeni tur açılır. Hiç teklif yoksa ürün satılmaz. Süre bitince de son teklif sahibine verilir; teklif yoksa atlanır. Bağlantısı kesilen oyuncunun pası otomatik varsayılmaz; 90 saniyelik son tarih ilerlemeyi sağlar.
8. Bakiye yalnızca satış sonuçlandığında düşer; ürün bir kez eklenir. Üst oyuncu kartlarında bakiye, son alınan ürün, pas/önde olma bilgisi ve tüm alımların açılabilir listesi görünür. Dar ekranda altı oyuncu üç sütunda gösterilir.
9. Satışlar bitince oyuncu aldıklarıyla kombinasyonunu kurar. Hazırlama 90 saniyedir; önceki 8/6/10 ürün limitleri ve bilgisayar yuva kuralları devam eder. Sonuç puanlaması değişmez; eşitlikte tek bakiye karşılaştırılır.

## Sunucu ve sürüm davranışı

- Yeni maçlar `auctionVersion: 1` taşır ve `auction → build → results` akışını kullanır. Gizli puanlar, gelecekteki ürün sırası ve bot planları istemciye gönderilmez.
- Teklif/pas istekleri geçerli ürün kimliğini taşır. Önceki turdan geç gelen tıklama yeni ürüne uygulanamaz. Pas, satış, bakiye ve tur değişimi aynı atomik oda işleminde saklanır. Eşzamanlı paslar ürünü bir kez dağıtır.
- Botlar da normal tek bütçe, açık teklif ve pas kurallarını kullanır; gizli puanları veya gelecekteki ürün sırasını görmezler. En yüksek teklif sahibi bot, diğer herkes pas geçtiğinde pasıyla turu kapatır.
- Güncelleme öncesinden devam eden maçlar kendi motorlarıyla tamamlanır. Mevcut lobiden başlatılan veya sonuçtan tekrar açılan yeni maçlar yeni kuralları kullanır. Eski kayıtlar silinmez.
- Misafir oturumu, özel/açık odalar, oda kodu kopyalama, bağlantı geri dönüşü, yönetim devri ve botlu pratik korunur. Yeni servis veya ücretli yapay zekâ çağrısı eklenmemiştir.

## Doğrulama

- 55 otomatik test geçti. Yeni testler: bütün ürün türleri, tek bakiye, +1/özel teklif, pasın bağlayıcılığı, son teklif sahibinin pası, teklif gelmeden atlama, süre dolumu, tekrar dağıtım engeli, eşzamanlı +1/pas ve kalan tek bakiye ile sonuç.
- Beş ayrı altışar oyunculu oda tam açık artırma maçını bitirdi. Üç temada 1 ve 3 botlu maçlar tamamlandı; eski kayıtların devamı ayrıca test edildi.
- Gerçek HTTP istekleriyle iki oyunculu tam bilgisayar maçı; gerçek süreli botlu kahvaltı pratiği, tekrar maç ve çıkış geçti.
- Tarayıcıda 320/360 px mobil ve 1440 px masaüstü, hızlı teklif, özel tutar, son pasla satış, 98 → 97 TL bakiye, yeni ürün ve üst alışveriş geçmişi denetlendi. Yatay sayfa taşması görülmedi.
- Katalogdaki eski alışveriş aşaması filtresi ve Temel/Ekstra etiketleri kaldırıldı; ürün türü ve arama korunur.

Yerel görsel durum aracı: `scripts/verify-ui-server.mjs`. Gerçek HTTP akışı: `node scripts/verify-live.mjs <adres> [tema]`. Gerçek oyuncu denemeleri önceki kullanıcı isteğiyle ertelidir.
