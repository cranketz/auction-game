# Baştan sona arayüz incelemesi

4 Ekim 2026 · Auction Game

Girişten maç sonucuna kadar bütün ekranlar; yerleşim, metinler, mobil kullanım, klavye odağı, yüklenme ve hata durumları birlikte incelendi. Önceki kararlar korundu: kısa bütçe etiketi, oda kodu kopyalama, kurucuda hazır düğmesi olmaması, aşamaya göre tek bakiye, maç bitmeden puanların gizlenmesi ve özel tutarla teklif verme.

## Ekranlara göre değişiklikler

| Alan | Bulgu | Uygulanan iyileştirme |
| --- | --- | --- |
| Giriş | Oyun fikri ve takma ad girişi birbirine karışıyordu. | Kısa tanıtım ve giriş kartı ayrıldı. Oyuncu sayısı, üç tema ve hesap gerektirmediği açıklandı. Ad sınırı görünür; Enter ile giriş yapılır. Geçersiz girişte odak düzeltilecek alanda kalır. |
| Ana ekran | Oda kurma, davet ve açık odalar yeterince ayrışmıyordu. | Kurma ve davet kartları ayrıldı. Açık masalarda oyuncu sayısı, süre, bütçe, doluluk ve maç durumu gösterilir. Yükleme, boş liste ve hata metinleri eklendi. |
| Oda ayarları | Küçük ekranda seçenek metinleri kesilebiliyordu. | 320 px genişlikte süre ve görünürlük tam satıra geçer. “Bütçe” etiketi korunur; ayrı bakiyeler kısa açıklamada anlatılır. |
| Lobi | Hazırlık ve bağlantı bilgisi yeterince açık değildi. | Hazır oyuncu sayısı, tek oyuncu uyarısı, çevrimiçi durumu ve yönetim devri açıklanır. Kurucuda başlatma ve ayrılma eylemleri bulunur. |
| Oda kodu | Paylaşım geri bildirimi yetersizdi. | Kod ayrı, okunabilir alanda; kopyalama düğmesi ve başarı bildirimi var. Başarısızlıkta elle kopyalama açıklanır. |
| Maç ilerlemesi | Oyuncu sıradaki aşamayı kolayca kaçırabiliyordu. | Dört aşamalı ilerleme ve kalan tur bilgisi korunarak görsel hiyerarşi düzenlendi. |
| Oyuncu bilgisi | Sabit alt alan küçük ekranda kontrolleri örtüyordu. | Kişisel bilgi eylem alanının önüne taşındı. Masaüstünde üstte yapışkan, mobilde normal akışta. Yalnızca mevcut alışverişin bakiyesi gösterilir. |
| Temel seçim | Sıra, ürün bilgisi ve teklif durumu yeterince ayrışmıyordu. | Numaralı tercih kartları, yerel çizimler, ipuçları ve yukarı/aşağı düğmeleri. İlk tercih belirgin. Kaydedilmiş ve değişmiş teklif durumları ayrı metinlerle gösterilir. |
| Ekstra açık artırma | Geçersiz tutar kolayca gönderilebiliyordu. | Ürün, lider ve fiyat ayrıldı. Toplam teklif etiketi, asgari teklif yardımı, −10/−5/−1/+1/+5/+10 ve özel tutar birlikte çalışır. Boş, kesirli, düşük ve bütçeyi aşan tutarlar gönderilemez. Kendi liderliğinde yeni teklif kapalıdır. |
| İşlem bekleme | Tekrar basma ve yeniden çizimde odak kaybı mümkündü. | Bekleyen işlem sırasında kontroller kapatılır. Kaydetme durumu görünür. Düğme/input/ürün odağı yeniden çizimde korunur. |
| Kombinasyon | Sınır ve seçilmiş ürün ayrımı yeterince açık değildi. | Tema sınırı ve seçili adet görünür. Kartlarda “Seç”/“Seçildi”; tabak/kasa/kazan alanında çıkarma eylemi. Bilgisayarda aynı yuvaya yeni parça seçilince önceki değiştirilir. |
| Seçim sınırı | Fazla seçim ancak sunucu hatasından anlaşılabiliyordu. | Kahvaltı 8, çorba 6, bilgisayar 10 sınırı istemcide de uygulanır. Sunucu doğrulaması korunur. Sınırda önce ürün çıkarma açıklaması gösterilir. |
| Kombinasyonu bitirme | Kilitlenmiş seçimlerde çıkarma çağrısı kalabiliyordu. | Kilitli durumda seçim kontrolleri kapalı; “Seçimin kilitlendi” ve diğer oyuncuları bekleme açıklaması var. |
| Sonuç | Kişisel sonuç uzun ayrıntıların altında kalabiliyordu. | Kazananlar ve kendi sıralaman önce gelir. Kompakt tabloda kendi satırın belirgin. Kendi puan dökümün açık; diğerleri isteğe bağlı açılır. Seçilen ürünler ayrıntıya taşındı. |
| Eşit sonuç | Para karşılaştırmasının etkisi belirsizdi. | Paylaşılan birincilikte bütün birinciler gösterilir. Eşit puanda geride kalan oyuncuya sıralamanın kalan parayla belirlendiği açıklanır. |
| Tekrar oyun | Devam yolu belirsizdi. | Kurucuda aynı odada yeniden oyun; bütün oyuncularda ayrılma. Ayarların korunması ve yeniden hazır olma açıklanır. |
| Katalog | Arama ve temel/ekstra ayrımı sınırlıydı. | Tema, grup, aşama filtreleri; ad/grup/ipucunda Türkçe arama. Sonuç adedi, temizleme, boş sonuç, hata ve yeniden deneme eklendi. |
| Bağlantı | Kesintide gönderme ve geri dönüş belirsizdi. | Kesinti bildirimi, manuel yeniden deneme, kesintide kapalı oyun gönderimleri. Aynı turdaki taslak ve açılmış ayrıntılar korunur. |
| Oturum sonu | Bozuk yerel kayıt arayüzü bozabilir; eski kesinti bildirimi kalabilirdi. | Bozuk kayıt güvenle temizlenir. Süresi biten oturum girişe döner ve yeniden katılma açıklaması gösterir. |

## Görsel sistem ve erişilebilirlik

- Krem arka plan, orman yeşili eylemler ve sıcak vurgu renkleriyle ortak renk/boşluk sistemi. Kart, düğme, alan ve yardımcı metinler tutarlılaştırıldı.
- Düğmelerde en az 44 px dokunma yüksekliği. Küçük ekranda alanlar ve uzun oyuncu adları taşmadan sarılır.
- Klavye odağı görünür. Seçili kart odak işaretini örtmez. Ekran veya tur değişince odak başlığa taşınır; katalogda yazarken oyun güncellemesi odağı çalmaz.
- Açılmış oyuncu/envanter/puan ayrıntıları aynı ekrandaki güncellemelerde kapanmaz.
- Alan etiketleri, açıklama bağlantıları, kartların basılı durumu ve sıralama düğmelerinin ürün adıyla erişilebilir adları düzenlendi. Sonuç tablosunda başlık kapsamları ve açıklama başlığı var.
- Kaydetme, kopyalama, hata ve bağlantı bilgileri canlı durum alanlarına yazılır. Her sayaç güncellemesinde aynı durum metni yeniden anons edilmez.
- Azaltılmış hareket tercihi desteklenir. Dekoratif SVG'ler erişilebilirlik ağacından çıkarılır; ürün adı metin olarak bulunur.
- Bilgisayarda işlemci, anakart, RAM, disk, güç kaynağı, kasa, ekran kartı, monitör, klavye ve soğutucu farklı çizimlerle gösterilir. Çorbada malzeme türleri ve çeşitli ürün şekilleri ayrıştırıldı. Dış görsel servisi veya yeni paket eklenmedi.

## Doğrulama

`node --test` ile 39 test geçti. Teklif doğrulaması, tercih değişikliği, tema seçim sınırları, bilgisayar yuvası değiştirme, eşit sıralama, SVG üretimi ve kilitli hazırlama alanı kontrolleri eklendi/genişletildi. Mevcut gizli puan, servis, kalıcılık ve 5 oda × 6 oyuncu testleri de geçer.

Tarayıcıda gerçek yerel HTTP/API akışı kullanıldı. Üretim veritabanına dokunmadan, bellek deposunda kontrollü 2 ve 6 oyunculu durumlar oluşturuldu.

| Kontrol | Sonuç |
| --- | --- |
| Giriş ve oda ekranı; 320/360 px | Yatay taşma yok; Enter ve oda ayarları çalışıyor. |
| 6 oyunculu temel tur | Teklif kaydı, sıralama, değişiklik mesajı, kesirli tutar engeli ve odak koruma doğrulandı. |
| Ekstra tur | Artı/eksi taslağı değiştiriyor; Enter gönderiyor; kendi liderliğinde yeniden teklif engelleniyor. |
| Bilgisayar hazırlama | Parça seçimi API'ye kaydoluyor; yuvalar ve 10 ürün sınırı görünür; bitirince kilitleniyor. |
| Çorba hazırlama | 6 seçim kaydoluyor; 7. seçim gönderilmeden açıklamayla engelleniyor. |
| Kahvaltı hazırlama | Tabak/seçim yerleşimi ve 8 ürün sınırı incelendi. |
| 6 oyunculu eşitlik sonucu; 320/768/1440 px | Ortak kazananlar, kişisel sıralama, açık ayrıntı ve tablo doğrulandı; yatay taşma yok. |
| Katalog | Tema/aşama/arama birlikte çalışıyor; boş sonuç ve temizleme odağı doğrulandı. |
| Katalog 503 hatası | Hata ve yeniden deneme görünür; servis dönünce 32 kahvaltı ürünü yükleniyor. |
| Durum API'si 503 hatası | Oda ve 17 para taslağı korunuyor; gönderim kapanıyor. Yeniden denemede aynı taslakla gönderim açılıyor. |
| Oturum kaybı | Girişe güvenli dönüş; eski yeniden bağlantı bildirimi temizleniyor. |

Tekrar denetim için `node scripts/verify-ui-server.mjs` çalıştırılır. Tarayıcıda `http://127.0.0.1:3122` üzerinden giriş yapılır. Yalnızca bu yerel sunucuda `POST /__ui_fixture` ile tema/aşama/oyuncu durumu, `POST /__ui_fault` ile izin verilen API rotalarında hata/gecikme oluşturulabilir. Örnek: `{"theme":"corba","phase":"build","count":6}`. Oyuncu sayısı 2 veya 6 olabilir. Araç üretim rotalarında bulunmaz; veritabanı veya Vercel ortamı algılarsa çalışmayı reddeder.

## Kapsam sınırları

Ekonomi, gizli uyum tabloları, rastgele dağıtım ve puanlama değiştirilmedi. Görsel kontroller tarayıcıdaki ekran boyutlarında yapıldı; fiziksel iOS/Android cihaz ve gerçek ekran okuyucu oturumu henüz denenmedi. Daha önce ertelenen gerçek oyuncu denemeleri yapılmadı. Yerel senaryolar teknik işleyişi doğrular; oyun dengesi, üretim gecikmesi veya yüksek trafik kapasitesi ölçümü değildir.
