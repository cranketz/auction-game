# Mobil düzen ve süreler · 4 Ekim 2026

> Güncel alışveriş kuralı: temel/gizli dağıtım kaldırıldı; bütün ürünler tek bütçeli 90 saniyelik açık artırmadadır. +1 doğrudan teklif verir, herkesin pası turu kapatır. [Güncel kurallar](./ACIK_ARTIRMA_KURALLARI.md). Önceki aşama/süre açıklamaları tarihsel tasarımı anlatır; tema uyum ve puanlama kuralları korunur.

Kullanıcı geri bildirimi: mobil ekran kalabalık, tur süreleri kısa.

## Uygulanan düzen

- Mobil ana ekranda dört oda ayarı iki sütunda kalır. Davetle katıl, açık masalar ve botlu pratik ayrı açılır alanlardır. Masaüstünde davet/açık masalar başlangıçta açıktır.
- Yardım ve katalog oyun alanından sonra gelir. Lobi eylemleri mobilde oyuncu kartlarından önce gelir; oyuncu listesi başlangıçta kapalıdır. Hazır oyuncu sayısı lobi eyleminde görünür.
- Maçta oda kodu ve oyuncu kartları aktif turdan sonraki “Oda ve oyuncular” alanındadır. Bakiye yalnızca mevcut alışveriş aşaması için gösterilir. Mobil ilerleme göstergesi kısa tur/ürün bilgisine iner.
- Temel tercih kartlarında sıra, küçük çizim, ad ve yukarı taşıma düğmesi bulunur. Yukarı taşıma ile bütün sıralamalar yapılabilir. Masaüstünde aşağı taşıma da vardır. Mobil ürün ipuçları ayrı açılır alandadır.
- Ekstra teklif ekranında çizim/fiyat alanı küçülür. Dar telefonda altı artı/eksi düğmesi iki sıradır; dokunma alanları en az 44 piksel yüksekliğindedir. Özel tutar ve gönderme ayrı kalır.
- Mobil kombinasyon önizlemesi kapalı başlar. Ürün kartları iki sütunda ad/grup/seçilme durumunu gösterir. İpuçları isteğe bağlı açılır. Yapısal uyum uyarıları görünür kalır. Seçim sayacı ve bitirme düğmesi alt kenarda, süre başlığı üst kenarda kaydırma sırasında erişilebilir kalır.
- Sonuçta tekrar oynama/ayrılma puan ayrıntılarından önce gelir. Mobil puan dökümleri başlangıçta kapalıdır. Masaüstünde kendi dökümün açık kalır.
- DOM ve klavye sırası eylemi önce getirir. Açık ayrıntılar, tutar taslağı ve seçim odağı sunucu güncellemelerinde korunur.

## Süreler ve uyumluluk

| Ayar | Yeni maç |
|---|---|
| Oda sahibinin teklif seçimi | 20 / 30 / 45 saniye |
| Varsayılan teklif süresi | 30 saniye |
| Kombinasyon | 90 saniye |
| Geçerli teklif uzatması | İlk üç teklifte +3; sonrasında her teklifte +1 saniye |

Yeni oda API'si yalnızca yeni üç seçeneği kabul eder. Güncelleme öncesi kurulmuş 8/12 saniyelik lobiler başlatılabilir; saklanan maçların mevcut son tarihleri değiştirilmez. Yeni maç hazırlama süresi saklanır; eski kayıtta bu alan yoksa önceki 60 saniyelik hazırlama kuralı sürer. Ekonomi, gizli teklif ve puanlama değişmez.

## Doğrulama

- `node --test`: 48 test geçti. Süre seçimi, tur geçişleri, 90 saniyelik hazırlama, emekli sürelerin yeni odada reddi ve eski kayıtların devamı eklendi.
- İzole bellek sunucusunda 360 px ana ekran/altı oyunculu temel seçim; 320 px ekstra teklif, bilgisayar/çorba hazırlama ve altı oyunculu sonuç; 1440 px masaüstü sonuç kontrol edildi. Yatay taşma görülmedi.
- Tarayıcıda tercih değiştirme + gizli teklif kaydı, +10/−5 ile 5 para teklif, seçim kaydı, açık önizlemenin güncellemede korunması ve hazırlama kilitleme doğrulandı. Tarayıcı hata kaydı boştu.
- Yerel ekran kontrolü `scripts/verify-ui-server.mjs` ile yapılır. Bu araç canlı dağıtımın parçası değildir. Gerçek oyuncu denemeleri kullanıcının önceki isteğiyle ertelidir.

Bir cihaz laboratuvarı veya iOS/Android sanal klavye testi yapılmadı; denetim tarayıcı genişliğiyle yapıldı.
