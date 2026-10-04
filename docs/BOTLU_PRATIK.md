# Botlu pratik

4 Ekim 2026

Ana ekranda tema, bütçe ve süre seçilir. “Tek başına pratik yap” alanında 1, 2 veya 3 bot seçilip pratik odası kurulur. Botlar hazır gelir; kurucu maçı başlatır. Aynı odada tekrar oynanabilir veya devam eden pratikten ayrılınabilir. Ayrılmak pratik odasını kapatıp kapasiteyi serbest bırakır.

## Kurallar

- Bir insan + 1–3 bot. Normal odalardaki 2–6 kişi kuralı korunur.
- Üç tema ve mevcut bütçe, gizli temel teklif, ekstra açık artırma, süre uzatma, kombinasyon sınırı ve puanlama kuralları kullanılır.
- Mira, Atlas ve Piko adları; oyuncu kartında Bot etiketi. Botlar hesap/oturum oluşturmaz ve yönetimi devralamaz.
- Pratik odası zorunlu olarak özeldir; açık listede/hızlı katılmada bulunmaz. Kod bilinse de başka insan katılamaz.
- Pratik bilgisi oda verisinde ayrıca saklanır. Şu anda kalıcı istatistik veya liderlik tablosu yoktur; gelecekte eklenirse pratik maçları rekabetçi istatistiklerden dışlanmalıdır.

## Kararlar ve adalet

Kurallara dayalı botlar kullanılır; ücretli yapay zekâ/LLM servisi eklenmedi. Planlayıcı yalnızca açık ürün adı, grup, ipucu, fiziksel bilgisayar özellikleri, kendi envanteri/bakiyesi ve açık artırma fiyatını alır. Gizli insan teklifleri, ürün puanları, çorba ilişki tabloları ve gelecek havuzlar verilmez.

Temel tercihler görünür uyuma göre sıralanır; bütçenin kalan turlara yayılan bir bölümü teklif edilir. Ekstralarda sınırlı harcama tavanı vardır; bot kendisi liderken yeniden teklif vermez ve bütçesini aşamaz. Bilgisayarda soket, bellek, kasa ve güç; kahvaltıda yayımlanmış ipuçları değerlendirilir. Çorbada temel yapı ve çeşitlilik gözetilir; gizli ilişkilere göre puan optimizasyonu yapılmaz. Kombinasyonlar sahip olunan ürünlerle sınırlıdır, tekrarlardan kaçınır ve tema sınırına uyar.

Botlar yaklaşık 1,8–3,6 saniyelik planlı aralıklarla hareket eder. Bu sürüm tek davranış düzeyindedir; insan seviyesini taklit ettiği veya dengesi ölçüldüğü iddia edilmez.

## Teknik işleyiş

Sunucuda mevcut oda işleminin atomik sürüm kontrolü içinde çalışırlar. Plan, tur anahtarı ve işlem zamanı oda verisinde saklanır. Yeniden başlatmada farklı teklif oluşturulmaz; aynı anda gelen durum istekleri temel teklifi iki kez uygulamaz. Bot planları istemci yanıtına dahil edilmez.

Zamanlayıcı hizmeti, cron veya yeni harici paket eklenmedi. İnsan oyuncunun mevcut istekleri zamanı gelen bot işlemlerini yürütür. Tarayıcı kapalıyken ayrı bot isteği üretilmez. Sabit temel/kombinasyon planları kapanışta uygulanabilir; süresi geçmiş ekstra açık artırmasına geriye dönük teklif eklenmez. Hosting/veritabanı kullanımı devam eder; yeni bir LLM maliyeti yoktur.

Lobide insan 2 dakika bağlantısız kalırsa sahipsiz bot odası da temizlenir. Aktif pratikte aynı tarayıcıyla geri dönülebilir; genel oda zaman aşımı uygulanır. Normal insan odalarının yönetim davranışı korunur.

## Doğrulama

`node --test`: toplam 46 test. Üç temada 1/3 botla sonuç, tekrar maç ve çıkış; özel oda/katılım; kalıcılık; 20 eşzamanlı okuma; gizli veriden bağımsız karar; bütçe, seçim ve süre kontrolleri.

Gerçek süreli HTTP aracı: `node scripts/verify-practice.mjs http://127.0.0.1:3124 kahvalti 1`. Temel, ekstra, kombinasyon, sonuç ve tekrar oyunu kontrol eder; test odasını sonunda kapatır. Üretim adresi de verilebilir.

Yerelde çorba + 1 bot gerçek süreli HTTP kontrolü geçti. Tarayıcıda kahvaltı + 1 bot maç sonucu/tekrar oyun; bilgisayar + 3 bot lobi/başlatma/sayfayı yenileyerek geri dönüş; aktif maçtan çıkış ve 320 px taşma kontrolü geçti. Tarayıcı hata kaydı yok. Bunlar teknik kontrollerdir; ertelenen gerçek oyuncu denge denemeleri yapılmadı.

Zorluk seviyeleri, gerçek oyuncularla denge ölçümü ve kalıcı ilerleme bu paketin dışındadır.
