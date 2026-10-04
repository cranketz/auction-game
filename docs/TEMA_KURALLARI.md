# Bilgisayar ve çorba · içerik sürümü 2

Bu uygulama plandaki başlangıç taslaklarını oynanabilir hale getirir. Puan değerleri denge testi başlangıcıdır; oyuncu denemeleriyle değiştirilebilir. Gerçek donanım veya yemek bilimi iddiası yoktur.

## Bilgisayar

30 kurgusal model: 18 temel, 12 ekstra. CPU/anakart A veya B soket; anakart/RAM D4 veya D5 sınıfı; anakart küçük/büyük boy; kasa küçük veya her iki boyu kabul eder. Depolama ortak bağlantı kullanır. İşlemcide temel görüntü çıkışı hazırdır.

Oyun başlangıcında N uyumlu altı parçalı set oluşturulur. Her temel grubun N kartı bu setlerden gelir. Kart kopyalarının model kimliği aynı olabilir ama satın alınan kartların kimlikleri ayrıdır. Oyuncular farklı setlerden parçaları seçerse uyum bozulabilir. Ekstraların gelecekteki seçimi gizlidir.

Güç ihtiyacı: 50 W sistem tabanı + seçilen CPU + seçilen GPU. Çekirdek çalışması için CPU/anakart soketi, RAM sınıfı, kasa boyu ve güç yeterli olmalıdır. Tam çekirdek +15; altı temel parçanın çalışması +25. Anakart/RAM/depolama kısmi katkıları, kasa ve güç kaynağı kendi katkıları korunabilir. Ekran, klavye ve GPU çalışan çekirdeğe ihtiyaç duyar. Soğutucu ayrıca CPU watt değerini karşılamalıdır; temel soğutma mevcut kabul edilir, ekstra soğutucu bonus getirir.

Hazırlarken eksik yuvalar, uyumsuz soket/RAM/kasa, yetersiz güç ve soğutma gösterilir; puanlar gösterilmez. Aynı grup için yeni kart seçmek önceki kartı değiştirir. Sonuçta her parçanın katkısı ve çalışmama nedeni açılır.

## Çorba

24 malzeme: 12 temel, 12 ekstra. Sıvı/taban ve en az bir sebze veya protein/bakliyat gerekir; en fazla 6 kart seçilir. Bütün temel grupları kullanmak gerekmez. Önceden tarif seçimi yoktur.

Farklı malzemelerin katkısı 3–8; geçerli yapı +10. İkili ilişkiler −6…+8, üçlü ilişkiler −8…+12. Aynı modelin tekrar kopyası taban veya ilişki katkısını artırmaz. Negatif ham toplam 0'a sabitlenir. Geçersiz yapı 0 alır; ham hesap sonuçta açıklanır.

Tat/doku ipuçları görünür. Hazırlamada yalnızca yapısal geçerlilik açıklanır; uyum önerisi veya gizli puan hesaplanmaz. İlişki tabloları src/soup.js içinde sunucuda kalır. Sonuç sadece oyuncunun kullandığı malzemeler arasındaki ilişkileri açar; tam tabloyu göndermez.

## Sürüm ve doğrulama

Yeni maçlar içerik sürümü 2 kullanır. Yayın öncesi başlamış eski bilgisayar/çorba maçları önceki puanlamayla tamamlanır. Ürün puanları tüm temalarda sonuç öncesi API yanıtlarından da çıkarılır. Bilgisayar havuzları 1000 rastgele üretimde ve 2–6 oyuncuda doğrulanır; yeni temalarda 2 ve 6 oyunculu tam motor akışı test edilir. Canlı kontrol: node scripts/verify-live.mjs https://oyun.redodesign.art bilgisayar veya corba.
