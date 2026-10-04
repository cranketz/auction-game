# Auction Game — Tam Proje Planı ve Uygulama Raporu

Tarih: 4 Ekim 2026  
Dil: Türkçe  
Durum: Geliştirme öncesi plan; uygulama henüz yapılmadı.  
Geçici ürün adı: Auction Game

## 1. Raporun amacı ve kararların durumu

Bu rapor, kullanıcıyla yapılan karar görüşmelerini oynanabilir bir çevrim içi oyun için ürün, kural, teknik geliştirme, test, maliyet ve yayın planına dönüştürür. Önceki sohbetin erişilebilen kullanıcı mesajlarındaki iki oyunculu, 20 TL bütçeli kahvaltı fikri başlangıç noktasıdır; bu görüşmede onaylanan yeni kurallar onun yerini alır.

**Onaylı:** Kullanıcının açıkça kabul ettiği karar.  
**Önerilen başlangıç:** Eksik operasyonel ayrıntıları tamamlayan uygulama önerisi; kullanıcı onayı olarak yorumlanmamalı.  
**Test parametresi:** İlk sürümde uygulanacak ama denge ve kullanım testleriyle değişebilecek değer.

Amaç, her ayrıntının sonsuza kadar değişmeyeceğini iddia etmek değil; kararların, risklerin ve değişiklik koşullarının açık olduğu uygulanabilir bir plan oluşturmaktır.

## 2. Ürün özeti

2–6 oyuncu, tarayıcı üzerinden aynı odada ürün satın alır ve satın alımların ardından kendi kombinasyonunu oluşturur. Üç başlangıç teması vardır: kahvaltı, bilgisayar toplama ve çorba. Temel ihtiyaçlar gizli tekliflerle dağıtılır; ekstra ürünler canlı açık artırmayla satılır. Temel ve ekstra alışverişi ayrı bütçeler kullanır. Sonuç, temaya özel puanlama ile belirlenir.

Oyun telefon ve bilgisayarda çalışır. İlk sürüm Türkçedir, hesap gerektirmez ve ücretsizdir. Hem arkadaşlarla özel oda hem yabancılarla herkese açık oda vardır. Önce 5 oda/30 eşzamanlı oyuncu kapalı test hedeflenir; açık yayın kapasitesi ölçümle belirlenir.

### İlk sürüm kapsamı

- Takma adla giriş, misafir oturumu ve aynı tarayıcıdan yeniden bağlanma.
- Açık/özel oda, kod, davet bağlantısı, oda listesi ve hızlı katıl.
- Lobi, hazır olma, oda ayarları ve oda sahibinin başlatması.
- Gizli temel ürün teklifleri, tercih sıraları ve otomatik dağıtım.
- Açık ekstra teklifleri, özel tutar girişi ve süre uzatma.
- Oyuncunun kendi kombinasyonunu hazırlaması.
- Üç tema, ürün kataloğu, tema kuralları ve ayrıntılı sonuçlar.
- Hazır ifadeler, sesleri kapatma, tekrar maç.
- Sunucunun yönettiği oyun, hata takibi ve sınırlı işletim araçları.

### İlk sürüm dışında

Hesaplar, kalıcı kişisel profil, küresel sıralama, arkadaş sistemi, serbest yazılı sohbet, sesli sohbet, takas, ürün iadesi, bot rakipler, gerçek para, reklam, mağaza, turnuva ve ek diller. Bunlar kullanıcı tarafından ayrıca istenirse değerlendirilir. Çorbanın dışındaki yeni yemek temaları sonraki içerik genişlemesidir.

## 3. Onaylanmış kararlar

| Konu | Karar |
|---|---|
| Oyuncular | 2–6 kişi |
| Erişim | Tarayıcı; telefon ve bilgisayar |
| Giriş | Hesapsız, takma ad |
| Dil | Türkçe |
| Temalar | Kahvaltı, bilgisayar, çorba |
| Oda | Açık veya özel; oda sahibi seçer |
| Katılım | Oda listesi, hızlı katıl, kod veya bağlantı |
| Başlatma | En az 2 kişi, herkes hazır, oda sahibi başlatır |
| Ayarlar | Teklif süresi 8/12/20 saniye, bütçe 50/100/150 |
| Cüzdan | Seçilen tutar kadar temel ve aynı tutar kadar ekstra para; aktarım yok |
| Temel ürünler | Her temel grupta oyuncu sayısı kadar ürün |
| Temel açık artırma | Gizli teklif ve ürün tercih sırası |
| Temel ödeme | Her oyuncu kendi teklifini öder; deneme modeli |
| Temel eşitlik | Görünür öncelik sırası; eşitliği kazanan sona geçer |
| Ekstralar | Oyuncu başına 2 ürün; sırayla açık artırma |
| Ürün belirsizliği | Katalog görünür; maçın seçilen ürünleri ve gelecekteki sırası gizli |
| Tekrar ürün | Aynı ürün tekrar gelebilir; her satış tek adet |
| Açık teklif | +1/+5/+10 ve özel toplam tutar; minimum artış 1 |
| Süre uzatma | Her geçerli teklifte ilk 3 kez +3 saniye, sonra +1 saniye |
| Görünürlük | Kalan bütçeler ve satın alınan ürünler görünür |
| Kombinasyon | Satın alım sonrası oyuncu kendisi kurar; tek sonuç |
| Hazırlama | Başlangıç değeri 60 saniye; testle değişebilir |
| Kalan para | Puan vermez; puan eşitliğini bozar |
| Bağlantı | Maç devam eder, otomatik teklif verilmez, yeniden katılım mümkündür |
| Oda sahibi | Ayrılırsa yönetim devredilir |
| Geç katılım | Devam eden maça oyuncu alınmaz |
| Sosyal | Hazır ifadeler; maç öncesi oyuncu çıkarma |
| Görsel | Renkli masa oyunu havası, resimli kartlar, kapatılabilir ses |
| Sonuç | Ürünler, kombinasyonlar, puan dökümü ve sıralama herkese görünür |
| Yayın | Küçük kapalı test, sonra herkese açık; düşük maliyet |

Önceki oyuncu başına 4 ürün kuralı kaldırılmıştır. İlk üç açık teklife 3 saniye eklenmesi yalnızca son saniyede değil, her geçerli teklifte uygulanır. Çorbanın gizli uyumları genel görünür puanlama kuralının istisnasıdır. Temel ürünler o grubun teklif ekranında birlikte açılır; gelecekteki temel grupların seçilmiş ürünleri açılmaz.

## 4. Baştan sona oyuncu yolculuğu

1. Ana sayfada takma adını yazar; kısa oyun açıklamasını görür.
2. Oda kurar, açık oda seçer, hızlı katılır veya davet bağlantısını açar.
3. Lobide temayı, bütçeyi, süreyi ve oyuncuları görür.
4. Katalogdan temanın ürünleri ve bilinen kurallarını inceleyebilir.
5. Herkes hazır olur; oda sahibi başlatır. Oyuncu listesi sabitlenir.
6. Eşitlik öncelik sırası açıklanır; iki cüzdan ayrı ayrı oluşturulur.
7. İlk temel grubun ürünleri açılır. Her oyuncu gizli teklifini ve tercih sırasını verir.
8. Süre dolunca teklifler açılır, seçim sırası hesaplanır, ürünler otomatik dağıtılır ve ödeme yapılır.
9. Diğer temel gruplar aynı akışla tamamlanır.
10. Ekstra ürünler tek tek açılır. En yüksek açık teklif ürünün sahibi olur.
11. Satın alımlar bitince 60 saniyelik kombinasyon hazırlama ekranı açılır.
12. Oyuncu aldığı ürünlerden bir kombinasyon seçer ve bitirir.
13. Herkes bitirdiğinde veya süre dolduğunda sunucu sonuçları hesaplar.
14. Herkes sıralamayı ve neden o puanı aldığını inceler.
15. Aynı odada yeniden maç veya lobiden ayrılma seçilir.

Önerilen başlangıç: Ayar değişikliği tüm hazır durumlarını kaldırır. Yeni oyuncu geldiğinde yeni oyuncu hazır değildir. Maç başlamadan hemen önce bağlı oyuncu sayısı yeniden doğrulanır. Hızlı katıl yalnızca açık, başlamamış, dolmamış odalara yönlendirir; uygun oda yoksa oda kurma seçeneği gösterir.

## 5. Temel ürün gizli teklif modeli

### 5.1 Teklifin anlamı

Oyuncu ürüne tek tek fiyat vermez; o gruptaki ürünlerden seçim yapma önceliği için bir tutar verir. En yüksek teklif önce seçer. Herkes bir ürün aldığı için herkes kendi teklifini öder. Sıfır teklif veren oyuncu kalan ürünlerden ücretsiz alır.

Tercih sırası, aynı anda gönderilen tam ürün sıralamasıdır. İşlemci grubunda A/B/C ürünleri varsa bir oyuncu C>A>B, diğeri C>B>A verebilir. İlk oyuncu C'yi aldıktan sonra diğerine kalanlar arasındaki ilk tercihi verilir. Fiziksel kopyalar ayrı kimlik taşır; aynı model iki kez geldiyse iki karttır.

Teklif 0 ile temel cüzdanın kalan tutarı arasında tam sayı olmalıdır. Süre dolana kadar değiştirilebilir. Sunucunun kabul ettiği son geçerli teklif kullanılır. Temel teklifler uzatma yapmaz. Süre dolduktan sonra gelen paket reddedilir; istemcinin gönderme zamanı kanıt sayılmaz.

### 5.2 Eşitlik ve öncelik

Maç başında sunucu rastgele bir oyuncu sırası oluşturur. Her grupta dağıtım sırası önce teklif miktarına göre azalan, eşit tutarlarda o grubun başlangıcındaki öncelik sırasına göre belirlenir.

Önerilen kesin algoritma: Öncelik sırası grup çözülürken değiştirilmez. Her eşit teklif kümesinde sonuncu dışındaki oyuncular eşitlik sayesinde daha önce seçmiştir. Bu oyuncular dağıtım bittikten sonra seçim sıraları korunarak öncelik kuyruğunun sonuna taşınır. Diğerleri göreli sıralarını korur. Böylece üç veya daha fazla kişinin eşitliği de tek anlamlı biçimde çözülür.

Örnek: Öncelik A>B>C>D; A/B/C 10, D 5 teklif verir. Dağıtım A>B>C>D olur. Eşitlik avantajı alan A ve B sona taşınır; yeni öncelik C>D>A>B olur. Bu çoklu eşitlik ayrıntısı uygulama önerisidir; önceki kabulü değiştirmeden genelleştirir ve testte doğrulanacaktır.

### 5.3 Zaman aşımı ve eksik giriş

Önerilen başlangıç: Teklif gönderilmemişse 0 kabul edilir. Tercih verilmemişse oyuncuya grupta önceden gösterilen sunucu kaynaklı kart sırası kullanılır. Bu sıralama puana göre otomatik en iyi seçim yapmaz. Geçerli teklif kaydedilmiş fakat bağlantı kopmuşsa kayıtlı teklif ve tercih korunur. Görünür uyarı oyuncuya varsayılan davranışı açıklar.

### 5.4 Denge riski

Ücretsiz kalan ürün almak bazen para harcamaktan daha iyi olabilir. Puanları birbirine yakın kartlar bu modeli anlamsızlaştırabilir; aşırı güçlü tek kart ise bütün bütçeyi tek gruba harcamayı zorunlu kılabilir. İlk prototipte teklif dağılımı, 0 teklif oranı ve harcama başına puan ölçülecek.

Karşılaştırılacak alternatifler: sıra önceliği için mevcut kendi teklifini ödeme; temel ürünlere düşük taban bedel; yalnızca tercih çatışmasında ödeme. Alternatiflerin hiçbiri şu an onaylı kural değildir. Kullanıcı mevcut modelin değiştirilebileceğini özellikle belirtmiştir.

## 6. Ekstra ürün canlı açık artırması

Ekstra bütçe temel aşamadan etkilenmez. Maçın başında envanterdeki tüm ürünler değil katalog gösterilir; ekstra ürünün kimliği kendi açık artırması başlarken açılır. Temel gruplar bittikten sonra toplam 2N ekstra satış yapılır.

Başlangıç fiyatı 1, minimum artış 1 oyun parasıdır. Özel alana artış değil toplam teklif tutarı yazılır. +5 düğmesi mevcut en yüksek teklifin üzerine 5 ekler. İlk teklif için mevcut fiyat referansı 0'dır. Tüm tutarlar tam sayıdır.

İlk üç geçerli teklif son tarihe 3'er saniye, dördüncü ve sonrası 1'er saniye ekler. Reddedilen, yinelenen veya bütçeyi aşan komut süreyi değiştirmez. Sunucu tek bir teklif sayacı tutar ve yeni üründe sıfırlar.

Önerilen başlangıç: Kendi en yüksek teklifini artırmak engellenir; başka biri artırana kadar lider oyuncu tekrar teklif veremez. Bu, gereksiz süre uzatmasını azaltır. Satış kapanmadan ödeme yapılmaz; yalnızca kazanan kendi teklifini öder. Teklif verilmeyen ürün kimseye verilmeden geçilir. Ödeme ve ürün verme tek işlem olarak uygulanır.

Aynı anda gelen teklifler sunucuda oda içi sırayla işlenir. İkinci teklif artık yeni en yüksek tekliften büyük değilse reddedilir; oyuncuya güncel fiyat gösterilir. İnternet gecikmesi hiçbir oyuncuya mutlak eşitlik sağlayamaz; sonuçların tutarlı olması sunucu sırası ve tek son tarihle sağlanır.

Eski 20 saniyelik toplam üst sınır kaldırılmıştır. Kullanıcının onayladığı uzatma modelinde sabit üst sınır yoktur. Bütçe sonludur ve teklif artışı en az 1 olduğu için satış yine sonludur; ancak kısa maç hedefi garanti değildir.

## 7. Tema yapıları

### 7.1 Kahvaltı

Temel gruplar: ekmek, peynir, yumurta, içecek. Her grupta N kart vardır. Ekstralar: zeytin, sebze, reçel, bal, şarküteri ve temaya uygun diğer ürünler. Son menü en fazla 8 satın alınmış kart içerir. Aynı ürünün tekrarından kombinasyon bonusu doğmaz.

Önerilen puan taslağı: Her farklı kullanılan ürün 4–12 taban puan; her temel grubun bulunması +5; dört temel grup tamamlanırsa +15; en fazla dört ek ürün grubu için +3 çeşitlilik; katalogda açıklanan eşleşmeler +4–8. Aynı modelin ikinci kopyası 0 taban ve 0 eşleşme puanı getirir. Her eşleşme yalnızca bir kez sayılır. Bu değerler onaylı sayılar değil, denge testinin başlangıcıdır.

Örnek eşleşmeler: ekmek+peynir, yumurta+sebze, ekmek+bal. Bonus kart üzerinde açıklanır. Sağlık veya beslenme doğruluğu iddiası yerine oyun etiketleri kullanılır.

### 7.2 Bilgisayar

Temel gruplar: işlemci, anakart, RAM, depolama, güç kaynağı, kasa. Ekstralar: ekran kartı, soğutma, monitör ve çevre birimleri. Gerçek model ve markalar yerine kurgusal ürünler vardır. Her temel yuvaya bir kart seçilir; kullanılmayan kart puan vermez.

Önerilen uyumluluk şeması: CPU/anakart için A veya B soket; anakart/RAM için bellek sınıfı; kasa/anakart için küçük/büyük form; güç kaynağı için kapasite; CPU/GPU için güç ihtiyacı. Depolamada ilk sürümde ortak bağlantı kullanılarak aşırı karmaşıklık önlenir. Ekran kartı bulunmasa da temel görüntü çıkışı hazır kabul edilir; ekran kartı performans bonusudur.

Önerilen puan taslağı: Parça başına 5–20 katkı; uyumlu CPU+anakart+RAM +15; altı temel parça ve tüm temel uyumlar sağlanırsa +25; uygun ekstralar 3–15. Uyumsuz parça kendi çalışma katkısını vermez; bağımsız uyumlu parçalar kısmi puan alabilir. Yetersiz güç, sistemin tamlık bonusunu engeller. Hesap ekranı hangi katkının neden devre dışı kaldığını açıklar. Teknik gerçekçilikten önce tutarlı ve anlaşılır oyun kuralları hedeflenir.

Rastgele havuz oluşturucu en az N adet ayrık tamamlanabilir temel sistem varlığını denetler. Ancak oyuncular çapraz seçim yaparsa kendi sistemleri uyumsuz kalabilir; satın alım başarısı garanti edilmez. Garanti yalnızca havuzun üretim aşamasına aittir.

### 7.3 Çorba

Temel gruplar: sebze, protein/bakliyat, sıvı/taban. Ekstralar: yağ, baharat, kıvam artırıcı, garnitür. Önceden seçilecek tarif yoktur. Oyuncu en fazla 6 kartla kendi çorbasını kurar; en az bir sıvı/taban ve bir ana malzeme gerekir. Sebze veya protein/bakliyat ana malzeme sayılır. Her temel kartı kullanmak zorunlu değildir.

Malzemelerin açıklamaları tat, doku ve yoğunluk ipuçları verir. Sabit ikili ve bazı üçlü uyumlar vardır; kesin değerleri satın alım ve hazırlama aşamasında görünmez. Sonuçta kullanılan kombinasyonun olumlu/olumsuz uyumları herkese açıklanır. Tüm gizli tablo yayımlanmaz. Oyuncular zamanla sonuçlardan öğrenebilir.

Önerilen puan taslağı: Malzeme başına 3–10 görünür temel katkı; ikili uyum −6 ile +8; üçlü uyum −8 ile +12; geçerli sıvı ve ana malzeme yapısı +10. Aynı kopyalar uyumu çoğaltmaz. Negatif toplam varsa gösterilen sonuç 0'a sabitlenir ve ham hesap açıklanır. Geçersiz çorba 0 alır. Bu sayılar test parametresidir.

Hazırlarken yalnızca yapısal geçerlilik gösterilir; gizli puan veya uyumu dolaylı açığa çıkaracak “en iyi seçim” önerisi verilmez. Gizli puanlama verisi istemci paketine, katalog API'sine veya hata mesajlarına konmaz.

## 8. İçerik üretim planı

Önerilen ilk katalog: kahvaltıda 12 temel model + 12 ekstra; bilgisayarda 18 temel model + 12 ekstra; çorbada 12 temel model + 12 ekstra. Toplam 78 model. Kopyalar model sayısından ayrıdır; N=6 olsa da model havuzundan tekrar kart üretilebilir.

Her ürünün alanları: kimlik, tema, temel/ekstra grubu, Türkçe ad, açıklama, görsel, görünür katkı, oyun etiketleri, uyumluluk bilgisi, aktiflik ve içerik sürümü. Gizli çorba ilişkileri ayrı sunucu dosyasında tutulur.

Başlangıçta lisansı uygun basit çizimler veya proje için hazırlanan özgün kart görselleri kullanılır. Görsel üretim aracı zorunlu değildir; görsel ve lisans kaynağı kayıt altına alınır. Görseller aynı oran ve stil kullanır, küçük ekranda okunur. Her ürün adı ve kural Türkçe yazım açısından kontrol edilir.

İçerik kabul koşulları: Her grupta yeterli alternatif, bilgisayarda doğrulanabilir uyum, çorbada hem olumlu hem olumsuz öğrenilebilir ilişkiler, kahvaltıda tek baskın kombinasyon bulunmaması. Yeni yemek temasında aynı motor kullanılır ama temel gruplar, hazırlama sınırları ve puanlama ayrı tanımlanır.

## 9. Maç süresi hesabı

N oyuncu, G temel grup, S başlangıç saniyesi olsun. Temel aşama yaklaşık G×S sürer; dağıtım ekranları buna eklenir. Ekstra aşama 2N×S + teklif uzatmalarıdır. Hazırlama başlangıçta 60 saniyedir. Her satış/grup sonucu için önerilen 3 saniyelik geçiş eklenir.

| Tema / oyuncu | 12 saniyelik ayarda, uzatmasız yaklaşık süre |
|---|---:|
| Kahvaltı / 2 | 180 saniye, 3 dakika |
| Kahvaltı / 6 | 300 saniye, 5 dakika |
| Bilgisayar / 2 | 210 saniye, 3,5 dakika |
| Bilgisayar / 6 | 330 saniye, 5,5 dakika |
| Çorba / 2 | 165 saniye, 2,75 dakika |
| Çorba / 6 | 285 saniye, 4,75 dakika |

Hesap: (G+2N)×(S+3)+60. Lobi ve sonuç inceleme hariçtir. Her ekstra satışta 5 teklif varsa 11 saniye daha eklenir. Altı kişilik maçta bu yaklaşık 132 saniyedir. Bu durumda 12 saniyelik ayar çoğunlukla hedefe yaklaşır; 20 saniye ayarı veya yoğun teklif daha uzun sürer. Ölçüm yapılmadan kesin 5–8 dakika sözü verilmez.

## 10. Kombinasyon ve sonuçlar

60 saniye sonunda sunucuda kayıtlı son geçerli seçim kullanılır. Satın alınmamış kart seçilemez; aynı kart iki yuvada kullanılamaz. Seçimler her değişiklikte sunucuya kaydedilir. Çorba gizli puanı önceden dönmez. Oyuncu bitirdiğinde seçim kilitlenir; herkes bağlı veya değil tamamlamışsa erken sonuç gösterilir.

Önerilen başlangıç: Hiç seçim yapmayan oyuncuya otomatik en iyi kombinasyon yapılmaz; boş kombinasyon 0 puan alır. Bağlantısı kesilenin önceden kaydedilmiş seçimi korunur. Bitirdikten sonra geri alma yoktur; bu düğmeye basmadan önce açık uyarı verilir.

Sıralama önce puan, eşitse kalan para ile belirlenir. İki cüzdan bulunduğu için kalan para tanımı önerilen olarak temel+ekstra toplamıdır. Bu da eşitse beraberliktir. Eşitlik öncelik kuyruğu final sıralamasında kullanılmaz. Sonuçta cüzdanlar ayrı da gösterilir.

Sonuç dökümü: kullanılan kartlar, kullanılmayan kartlar, taban katkılar, bonuslar, kaybedilen uyumlar, toplam, kalan bütçe ve sıralama. Çorbada kullanılan gizli ilişkiler bu aşamada açılır. Kalıcı küresel maç geçmişi ilk sürüm kapsamı değildir.

## 11. Oda, bağlantı ve kötüye kullanım

Önerilen varsayılanlar: Takma ad 2–20 karakter; odada aynı görünen ad engellenir; HTML çalıştırılmaz. Oda kodu tahmin edilmesi zor, karışan karakterleri içermeyen 6–8 karakterdir. Özel oda liste API'sinde görünmez. Davet kodu giriş anahtarıdır, oyuncu kimliği veya yönetim yetkisi değildir.

Misafir kimliği sunucunun verdiği rastgele gizli oturumla tanınır. Aynı adla giriş bir oyuncunun yerine geçirmez. Yeniden katılım aynı oturumla çalışır; tarayıcı verisi silinirse kurtarma ilk sürümde garanti edilmez. Tek oyuncu için bir aktif bağlantı; ikinci sekmede anlaşılır uyarı önerilir.

Lobide bağlantısı kesilen oyuncu için önerilen 60 saniye bekleme, sonra çıkarma. Maçta ayrılanın envanteri ve bütçesi korunur; temel grupta kaydı yoksa 0 teklif ve varsayılan tercih uygulanır, ekstrada teklif verilmez. Maç sırasında oyuncu sayısı ve ürün miktarı değişmez.

Oda sahibi ayrılınca en eski bağlı oyuncuya yetki geçer. Maçta yönetici kimseyi çıkaramaz. Maç başlamadan çıkarılan oturum o odaya tekrar giremez; bunun hesap/IP tabanlı kalıcı yasak olmadığı açıklanır. Tüm oyuncular ayrılırsa oda 5 dakika sonra kapanır. Sonuç odası 15 dakika hareketsizlikte temizlenir. Bunlar test edilebilir işletim parametreleridir.

Hazır ifadeler için önerilen hız sınırı 2 saniyede 1 mesaj. Katılım, oda oluşturma ve teklif komutları ayrı hız sınırları kullanır; normal oyuncunun son saniye tekliflerini engellemeyecek biçimde ölçülür. Açık odalarda uygunsuz isimleri bildirme ve işletmecinin odayı kapatma yolu bulunur. Serbest sohbet olmadığı için metin yüzeyi küçüktür, fakat isimler yine denetlenmelidir.

## 12. Ekranlar ve erişilebilirlik

1. Ana ekran: takma ad, oda kur, hızlı katıl, oda listesi, davetle katıl, kurallar.
2. Oda listesi: tema, oyuncu sayısı, süre, bütçe, durum; boş ve başlamamış odalar öncelikli. Filtreler tema ve boş yer.
3. Lobi: görünürlük, tema, süre, bütçe; hazır durumları, oda kodu ve bağlantı kopyalama.
4. Katalog: tüm ürünler; temaya göre filtre, açık kurallar ve çorba ipuçları.
5. Temel teklif: aynı gruptaki kartlar, tercih numaraları, gizli tutar, kalan temel bütçe, sayaç, kabul durumu.
6. Dağıtım: açılan teklifler, seçim sırası, ürünler, ödeme ve yeni eşitlik önceliği.
7. Ekstra satış: büyük ürün kartı, fiyat, lider, sayaç, uzatma bildirimi, teklif düğmeleri ve özel tutar.
8. Hazırlama: alınan ürünler, yuvalar veya seçim alanı, geçerlilik uyarıları, kalan süre ve bitir.
9. Sonuç: sıralama, kişi bazında ayrıntı, çorba uyumları ve yeniden oyna.
10. Sistem durumları: dolu oda, bulunamayan oda, maç başladı, yeniden bağlanıyor, sunucu bekleniyor.

Telefonlarda teklif alanı ve sayaç kaydırma gerektirmeden görünür. Sürükleme dışında dokunup seçme ve yukarı/aşağı tercih düğmeleri vardır. Renk tek bilgi taşıyıcısı değildir; uyumluluk metin/ikonla da belirtilir. Klavye kullanımı, odak görünürlüğü, okunur kontrast, azaltılmış hareket ve ses kapatma desteklenir. Ses başlatmak için tarayıcının kullanıcı etkileşimi gereksinimi dikkate alınır. Sayaç ekran okuyucuda her saniye anons edilmez.

## 13. Teknik mimari önerisi

Bu bir mevcut teknoloji kurulumu raporu değil, geliştirmede uygulanacak mimari önerisidir.

İstemci: React + TypeScript, Vite ile statik paket. Sunucu: Node.js + TypeScript, HTTP API ve Socket.IO ile gerçek zamanlı bağlantı. Oyun mantığı saf TypeScript modülleridir; tema kuralları ortak motorun üzerinde ayrı modüller olur. Çorba gizli verileri yalnızca sunucuya dahil edilir.

Önerilen depo yapısı:

```
apps/web/                 ekranlar ve istemci
apps/server/              API, soket, oturum ve oda yönetimi
packages/protocol/        istemciye güvenle paylaşılabilen mesaj tipleri
packages/game-engine/     oyun kuralları; sunucu tarafından çalıştırılır
content/public/           açık katalog verisi
content/private/          gizli çorba ilişkileri
tests/                    motor, bağlantı ve uçtan uca testler
docs/                     kurallar, yayın ve işletim kılavuzları
```

Tek sunucu süreci ilk 5 oda/30 kişi hedefi için başlangıç tasarımıdır; kapasite iddiası yük testiyle doğrulanır. Oda komutları sırayla yürütülür. Teklif, ödeme, ürün verme ve sıra değişimi atomik uygulanır. Oda başına durum sürümü vardır; eski sürümdeki komutlar tekrar değerlendirilir veya reddedilir.

Sunucu zamanın ve bütün bütçelerin otoritesidir. İstemci sayaçları serverNow ve deadline bilgisinden hesaplanır. Timer çalıştığında geç kalmış olsa bile deadline sonrası teklifler reddedilir. Aynı komutun yeniden gönderilmesi iki ödeme yapmaz; commandId ile yinelenen işleme engeli vardır.

WebSocket her oda için herkese açık durum, kişiye özel teklif/tercih bilgisi ve sonuç gönderir. Gizli teklifler grup kapanmadan rakiplere veya genel oda kaydına çıkmaz. HTTP API katalog, oda listesi ve oturum işlemlerini karşılar. Açık ve gizli veri tipleri ayrıdır.

### Durum makinesi

LOBBY → STARTING → BASIC_REVEAL → BASIC_BIDDING → BASIC_RESOLVE → sonraki temel grup → EXTRA_REVEAL → EXTRA_BIDDING → EXTRA_RESOLVE → sonraki ekstra → BUILDING → RESULTS → LOBBY.

RECOVERING geçici durumu ve CANCELLED hata sonu bulunur. Her durumda kabul edilen komutlar açıkça tanımlanır; hazırlama ekranında teklif komutu işlenmez. Oyun sürümü ve katalog sürümü maç başında sabitlenir; içerik güncellemesi devam eden maçı değiştirmez.

### API ve olay sözleşmeleri

HTTP: createGuest, listRooms, createRoom, joinRoom, getPublicCatalog. Soket istemci komutları: setReady, updateSettings, startMatch, submitBasicBid, placeExtraBid, updateBuild, finishBuild, sendReaction, leaveRoom. Sunucu olayları: roomSnapshot, privatePlayerState, commandAccepted/Rejected, basicResolved, auctionUpdated, phaseChanged, matchResult, reconnectRequired.

Her komut şema, oturum, oda üyeliği, faz, deadline, bütçe ve sahiplik açısından kontrol edilir. Dahili hata mesajları oyuncuya yığın izi veya gizli veri döndürmez.

## 14. Veri ve sunucu kurtarma

Model varlıkları: GuestSession, Room, RoomMember, Match, MatchPlayer, ProductModel, ProductInstance, BasicRound, BasicBid, Allocation, ExtraAuction, BuildSubmission, ScoreBreakdown ve MatchEvent.

Match alanları: tema, N, ayarlar, iki başlangıç bütçesi, katalog/kural sürümü, sunucudaki rastgele tohum, faz, deadline, eşitlik kuyruğu ve durum sürümü. Tohum maç sırasında istemciye verilmez. ProductInstance modelin tek satılabilir kopyasıdır. Bid kaydı son teklif ve tercihlerden oluşur; değişiklik geçmişi operasyonel gereksinime göre sınırlı tutulur.

Yerel prototipte bellek yeterlidir; sunucu kapanınca maç kaybı açıkça belirtilir. Herkese açık yayın öncesinde PostgreSQL üzerinde kritik olaylar ve faz sonlarında snapshot saklanır. Teklif kabulü ancak gerekli kayıt başarılıysa onaylanır. Redis ilk kapasite için zorunlu değildir.

Sunucu yeniden başladığında kaydedilen durum kurtarılır. Önerilen politika: Yeni komutlar RECOVERING sırasında engellenir; aktif deadline 30 saniyelik toparlanma aralığıyla yeniden kurulur ve herkese bildirilir. Veri tutarsızsa maç açık hata mesajıyla iptal edilir; yanlış sonuç üretilmez. Bu davranış bağlantı testleriyle doğrulanmalıdır.

Operasyonel öneri: Kimlik belirten oturum verisi hareketsizlikten sonra 7 gün; ayrıntılı maç olayları 14 gün; kimliksiz denge özetleri 90 gün tutulur. Bu süreler ürün gereksinimi ve yayın öncesi gizlilik değerlendirmesiyle kesinleşir. Gereksiz kişisel veri, e-posta, yaş veya konum toplanmaz. Günlüklere oturum sırrı ve gizli canlı teklifler yazılmaz.

## 15. Düşük maliyetli barındırma

4 Ekim 2026 tarihinde resmi kaynaklar kontrol edildi. Net bir ücretli paket fiyatı kaynakta doğrulanamadığı için aşağıdaki ücretli rakamlar sağlayıcı teklifi değil bütçe planlamasıdır.

### Kapalı test önerisi

Statik istemci ve tek Node.js sunucusu; uygun ücretsiz hizmetlerle aylık barındırma 0 USD hedeflenebilir. Özel alan adı zorunlu değildir. Render ücretsiz web servisleri 15 dakika gelen trafik olmazsa uykuya geçer; yeniden açılma gecikmesi vardır. Gelen WebSocket mesajları aktifliği sürdürebilir. Bu nedenle ilk oyuncuya bekleme durumu gösterilmeli ve planlı test öncesi servis kontrol edilmelidir. Kaynaklar: [Render ücretsiz hizmetler](https://render.com/docs/free), [WebSocket değişikliği](https://render.com/changelog/free-web-services-now-remain-active-while-receiving-websocket-messages).

Kalıcı veri gerekirse ücretsiz PostgreSQL seçeneği değerlendirilebilir. Supabase ücretsiz projeleri yedi günlük düşük aktivitede duraklatabilir; veritabanı bağımlılığı eklenmeden önce bu koşul hesaba katılır. [Supabase duraklatma belgesi](https://supabase.com/docs/guides/platform/free-project-pausing).

### Herkese açık yayın önerisi

Statik istemci ücretsiz kalabilir; sürekli çalışan küçük Node.js hizmeti ve kalıcı veritabanı gerekir. Planlama zarfı başlangıçta aylık yaklaşık 5–15 USD sunucu, 0–10 USD veritabanı; toplam 5–25 USD olabilir. Bunlar doğrulanmış tarife veya garanti değildir. Satın almadan önce [Render fiyatlandırması](https://render.com/pricing) ve seçilecek sağlayıcının güncel toplamı yeniden kontrol edilir. Vergi, kur, trafik aşımı ve alan adı ayrıca değerlendirilir.

Alan adı için sağlayıcı ve uzantı seçilmeden kesin bedel verilmez; ilk testte hizmetin alt alan adı kullanılır. TRY karşılığı güncel kur doğrulanmadan hesaplanmaz. Oyunun çalışması için ücretli yapay zekâ çağrısı gerekmez; puanlama deterministiktir.

Maliyet kontrolü: otomatik ücretli kapasite artışı başlangıçta kapalı; günlük kaynak ölçümü; kotanın %70 ve %90 seviyelerinde işletmeciye uyarı; kota riski varsa yeni oda açma sınırı. Devam eden maçı maliyet için sessizce kesmek yerine katılım sınırı uygulanır. Ücretli işlemden önce somut paket ve toplam kullanıcıya sunulur.

## 16. Güvenlik, doğruluk ve işletim

Sunucuda miktar tam sayılığı, bütçe, sahiplik ve faz doğrulanır. İstemcinin fiyat veya puan hesaplaması sonuç kaynağı olamaz. Gizli veri yalnızca yetkili kişiye veya doğru kapanış aşamasında gönderilir. HTTPS/WSS kullanılır; oturum anahtarı URL'ye konmaz. CORS/origin izinleri kontrollüdür. Paket boyutları ve gönderim sıklıkları sınırlanır.

Takma ad ve hazır ifadeler düz metin olarak işlenir. İstemciye gizli ortam değişkeni konmaz. Veritabanı kimlik bilgileri sağlayıcının secret yönetiminde tutulur. Üretim ortamına debug endpoint açılmaz. Yönetim araçları ayrı yetki gerektirir.

İzlenecek göstergeler: aktif oda ve oyuncu sayısı, komut gecikmesi, hatalı teklif oranı, yeniden bağlanma oranı, maç bitirme oranı, faz süreleri, bellek/CPU ve veritabanı hataları. Anonim oyuncu deneyimi ölçümleri, açık bir gizlilik açıklamasına uygun tutulur.

Tek sunucudan çok sunucuya geçiş ancak ölçüm gerektirirse yapılır. Oda sahipliği, merkezi durum ve soket yönlendirme planlanmadan yatay kopya açılmaz; aksi halde çift satış oluşabilir.

## 17. Test planı ve yayın kabul kriterleri

### Kural testleri

Eşit teklif kuyruğunun 2–6 kişiyle bütün kümeleri; teklif değiştirme; 0 teklif; eksik tercih; aynı model kopyaları; bütçe tükenmesi; dağıtımda herkesin tek ürün alması; negatif bütçenin imkânsızlığı; çift ödeme engeli; 3/3/3/1 saniye uzatması; satılmayan ürün; sahiplik; puan ve final beraberliği.

Rastgele içerik için en az 1.000 tohumla bilgisayar havuzlarının tamamlanabilirliği ve bütün grupların adetleri doğrulanır. Aynı tohum ve komut dizisi aynı sonucu vermelidir. Gizli çorba tablosu istemci çıktısında bulunmamalıdır.

### Uçtan uca ve bağlantı testleri

2, 3 ve 6 kişiyle tüm temalar; lobi değişikliği; hızlı katıl yarışları; dolu oda; özel odanın listelenmemesi; deadline sınırı; 100–500 ms gecikme; kopma ve dönüş; ikinci sekme; oda sahibinin ayrılması; sunucu restartı; herkesin ayrılması; sonuçtan yeni maç.

### Cihaz ve kullanılabilirlik

Android Chrome, iOS Safari ve masaüstü Chrome/Edge/Firefox üzerinde temel akış. En az 360 px genişlik, dokunmatik ve klavye kullanımı. Özel teklif girişinde mobil klavye sayacı ve onay düğmesini gizlememeli. Ses izinleri, kapatma ve azaltılmış hareket doğrulanır.

### Yük hedefleri — ölçülecek başlangıç kriterleri

5 oda/30 eşzamanlı oyuncuyla 30 dakikalık test ve en az 20 tamamlanan maç. Bütçe/envanter tutarsızlığı 0; çift işlem 0; süreç çökmesi 0. Sunucu içi komut işleme p95 hedefi 100 ms altında; toplam oyuncu gecikmesi ağdan etkilenir. İki kat yük ayrıca denenir ama ölçülmeden 60 kişilik kapasite ilan edilmez.

### Oyun dengesi

En az 30 deneme maçı, tema başına en az 10; oyuncu sayısı ve bütçe/süre ayarları dağıtılır. İstatistikler küçük örneklemde kesin kanıt sayılmaz. İkinci turda en az 100 maç hedeflenir.

İzlenecekler: 0 teklif verme sıklığı, temel bütçe harcaması, tercih sırasının sonuçla ilişkisi, yüksek teklif verenlerin kazanç oranı, eşitlik avantajları, baskın ürünler, kullanılmayan ekstralar, bitirme süresi ve tekrar oynama isteği. Her denge değişikliği sürümlenir, yalnızca yeni maçlara uygulanır.

Yayın kapısı: Kritik açık 0; üç temada başarılı tam maç; yeniden bağlanma ve restart davranışı doğrulanmış; yedek geri yükleme denenmiş; maliyet sınırı belirlenmiş; kurallar ile ekranların tutarlı olduğu kontrol edilmiş; kullanıcı örnek maçı deneyip yayın paketini görebiliyor.

## 18. Geliştirme yol haritası

Süreler odaklı geliştirme için kaba iş günü tahminidir; takvim taahhüdü değildir. İçerik ve denge geri bildirimleri süreyi değiştirebilir.

| Aşama | İşler | Çıkış ölçütü | Tahmin |
|---|---|---|---:|
| 0 | Planı sürümleme, şemalar, kural örnekleri, taslak ekranlar | Açık karar listesi ve uygulanabilir sözleşmeler | 1–2 gün |
| 1 | Saf oyun motoru, bütçe, temel dağıtım, eşitlik, ekstra timer | Kritik motor testleri geçiyor | 3–5 gün |
| 2 | Misafir, oda, soket, bağlantı yönetimi | 2 gerçek tarayıcı uçtan uca maç oynuyor | 3–5 gün |
| 3 | Mobil ekranlar, tercih, teklif, hazırlama, sonuç | Klavye ve telefonla tüm akış tamam | 4–6 gün |
| 4 | Üç tema içerikleri, puanlar, gizli uyumlar, kartlar | Temalar doğrulanmış ve katalog tutarlı | 4–7 gün |
| 5 | Açık oda listesi, hızlı katıl, ifadeler, sesler | Açık/özel katılım güvenilir | 2–3 gün |
| 6 | Kalıcılık, restart, güvenlik, log ve yük | Yayın kabul kriterleri karşılanıyor | 3–5 gün |
| 7 | Kapalı test, geri bildirim, denge turu | En az 30 maç ve sorun raporu | 3–7 gün |
| 8 | Yayın ayarları, yedek, maliyet, son kontrol | Yayın paketi ve geri dönüş yolu hazır | 1–2 gün |

Toplam başlangıç tahmini 24–42 odaklı iş günü. Yapay zekâ destekli geliştirmeyle daha kısa olabilir; bunu garanti saymayız. Küçük prototip daha erken oynanabilir; kapsamın tamamlanması ayrı kilometre taşıdır.

Bağımlılık sırası: Motor → gerçek çok oyunculu dikey dilim → arayüz ve temalar → açık oda özellikleri → kalıcılık/güvenlik → kapalı test → yayın. Önce yalnızca kahvaltıyla uçtan uca akış geliştirmek teknik bir ara adım olabilir; yayımlanacak ilk sürüm yine üç temayı içerir.

## 19. İş paketleri ve teslimatlar

- P01: Karar günlüğü, örnek maçlar ve sürümlü kural kitabı.
- P02: Ürün şeması, açık/gizli içerik ayrımı ve içerik doğrulayıcı.
- P03: Teklif/dağıtım/bütçe motoru ve anlamlı kural testleri.
- P04: Oturum, oda üyeliği, hazır durumu ve yönetim devri.
- P05: Gerçek zamanlı protokol, komut kimliği ve sunucu sayaçları.
- P06: Lobi, katalog ve gizli teklif tercih arayüzü.
- P07: Açık teklif ekranı, özel tutar, ses ve uzatma bildirimleri.
- P08: Tema hazırlama ekranları ve puan motorları.
- P09: Sonuç açıklamaları, eşitlik ve tekrar maç.
- P10: Oda listesi, hızlı katıl, özel oda koruması ve hazır ifadeler.
- P11: Kalıcı kayıt, snapshot ve restart kurtarma.
- P12: Yük, bağlantı, cihaz ve gizli veri testleri.
- P13: Kapalı test raporu, puan değişiklikleri ve süre kararı.
- P14: Yayın, izleme, yedek, geri dönüş ve işletim kılavuzu.

Her iş paketinde çıktı, test kanıtı ve açık sorunlar kaydedilir. İşi bitmiş saymak yalnızca kod yazılması değildir; ilgili kullanıcı akışı çalışmalıdır.

## 20. Yayın, bakım ve geri dönüş

Yerel → test → üretim ortamları ayrılır. Sürekli kontrol süreci tip kontrolü, motor testleri, içerik doğrulama ve paket oluşturmayı çalıştırır. Test verisi üretim verisinden ayrı tutulur. Ortam ayarlarının örneği secrets içermeden depoda bulunur.

Kapalı test erişimi davet/kodla yürütülür; açık oda ekranı test grubu içinde yine denenir. 5 oda sınırı sunucuda uygulanır. Açık yayında önce aynı sınırla başlanabilir; doluysa kullanıcıya kapasite durumu gösterilir. Yük sonuçlarına göre artırılır.

Yeni sürümde yeni maç başlatılması kısa süre durdurulur, mevcut maçlar bitirilir, sürüm yayımlanır, sağlık kontrolü yapılır. Acil sürümde oyunculara bakım mesajı verilir. Geri dönüşte önceki uygulama ve uyumlu içerik sürümü birlikte kullanılır. Veritabanı değişiklikleri mümkün olduğunca geriye uyumlu yapılır.

Günlük veritabanı yedeği; en az 7 yedek tutma başlangıç hedefi. İlk restore yayın öncesi denenir; ardından aylık tekrarlanır. Planlı yedek olmadan uzun süreli verinin korunacağı söylenmez.

İlk hafta günlük hata ve denge kontrolü; sonraki haftalarda haftalık bakım. Öncelik sırası: veri/bütçe hatası → oyunu engelleyen hata → bağlantı sorunu → denge → görsel iyileştirme → yeni içerik. Yeni tema önce küçük içerik testi, sonra sınırlı oyuncu testi alır.

## 21. Risk kaydı

| Risk | Etki | Önlem / karar koşulu |
|---|---|---|
| 0 teklif çok güçlü | Temel açık artırma anlamsızlaşır | Kontrollü oyun testleri, alternatif ödeme modeli |
| Her teklif süreyi uzatır | Kısa maç hedefi aşılır | Ölçüm; kullanıcı kabulüyle sonraki süre değişikliği |
| Eşitlik sırası stratejisi | Sürekli 0 teklif tercih edilebilir | Öncelik avantajı ve puan ilişkisini ölç |
| Uyumsuz bilgisayar | Yeni oyuncu cezalandırılmış hisseder | Kart üstünde uyum, kısmi puan, sonuç açıklaması |
| Çorba fazla gizli | Sonuç rastgele algılanır | İpuçları, sabit ilişkiler, maç sonunda açıklama |
| Gizli bilgi sızar | Adil oyun bozulur | Sunucuya özel içerik ve paket denetimi |
| Ücretsiz servis uyur | İlk katılım gecikir | Bekleme ekranı; yayında sürekli servis seçeneği |
| Sunucu yeniden başlar | Maç kaybolur | Kalıcı olay/snapshot ve kurtarma testi |
| Misafir kötüye kullanımı | Açık odalarda rahatsızlık | Hız sınırı, isim kontrolü, bildirim ve oda yönetimi |
| Beklenmeyen ücret | Düşük maliyet hedefi bozulur | Kota, uyarı, oda sınırı ve paket kontrolü |

## 22. Açık ayrıntılar ve önerilen başlangıçlar

Yeni soru turuyla tüm planı durdurmak yerine şu ayrıntılar öneri olarak görünür bırakılmıştır: nihai ad ve alan adı; tam ürün adları/görselleri; puanların sayısal dengesi; çoklu eşitlik kuyruğu algoritması; final eşitliğinde iki cüzdanın toplamı; liderin kendi teklifini artırmaması; tercihsiz oyuncunun kart sırası; hazırlamada boş seçimin 0 olması; bağlantı/oda temizleme süreleri; veri saklama süreleri; nihai barındırma sağlayıcısı.

Bu ayrıntılar kodlamada uygulanacak başlangıç seçenekleri olarak değerlendirilebilir; kullanıcı tarafından onaylanmış gibi gösterilmez. Özellikle gizli teklif ödeme modeli ve 60 saniyelik hazırlama süresi testle değişebilir. Gizli çorba ilişkilerinin öğrenilebilirliği içerik testine tabidir.

## 23. Tamamlanma tanımı

Proje ilk sürüm olarak tamamlanmış sayılır: Üç temada 2–6 oyuncu telefon ve bilgisayardan tam maç oynayabiliyor; açık ve özel odalar çalışıyor; gizli/açık teklifler ve iki cüzdan doğru; herkes kendi kombinasyonunu kuruyor; sonuçlar anlaşılır; bağlantı ve sunucu kurtarma politikasının test kanıtı var; gizli bilgiler erken sızmıyor; 30 oyuncu yük hedefi doğrulanmış; yayın maliyeti ve kota kontrolü belli; yayın ve geri dönüş kılavuzu hazır.

Bu rapor planlama teslimatıdır. Oyun geliştirilmiş, yük testi yapılmış veya yayına alınmış değildir. Sonraki uygulama adımı, sürümlü kurallar ve motor testleriyle ilk oynanabilir dikey dilimi oluşturmaktır.
