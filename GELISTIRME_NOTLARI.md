# Geliştirme öncelikleri ve GitHub düzeni

## Mevcut durum

Küçük ölçekli ilk internet yayını Vercel auction-game projesinde hazırlandı. Maç/oturum kalıcılığı ayrı Neon Free veritabanında; kısa aralıklı HTTP durum güncellemesi ve sürüm karşılaştırmalı atomik yazma kullanılır. Hedef oyun.redodesign.art; ana site korunur. Kullanıcının arayüz kararları: kısa bütçe etiketi, oda kodu kopyalama, oyuncu sayısı uyarısı, maç öncesi ürün puanlarının gizlenmesi, teklif taslağını değiştiren artı/eksi düğmeleri, kartlı temel tercih sırası, faza göre bakiye, oda sahibinde ayrı hazır düğmesi olmaması.

## Tartışılacak geliştirmeler

1. Gerçek ürün çeşitleri: Klasik/Özel/Seçkin yerine anlamlı ürünler ve özellikler. Özellikle puanlar gizliyken oyuncu yalnızca isme bakarak karar vermek zorunda kalmamalı.
2. Gizli temel teklif dengesi: Ücretsiz kalan ürün, yüksek teklifin getirisi ve öncelik kuyruğunun etkisini karşılaştır.
3. Tema puanlamaları: Bilgisayar uyumluluğu, kahvaltı kombinasyonları, sabit gizli çorba uyumları.
4. Tur sonucu: Kim ne aldı, ne ödedi ve neden önce seçti açıklansın.
5. Hazırlama deneyimi: Bilgisayar yuvaları, kahvaltı tabağı, çorba kazanı; dokunarak yerleştirme.
6. Bağlantı güvenilirliği: Yeniden bağlanma, oturum kaybı, yönetim devri, boş oda temizliği ve kalıcılık.
7. Sonuç puan dökümü ve tekrar oyun geri bildirimi.
8. Açık yayın öncesi yük, kötüye kullanım ve maliyet sınırları.

Bu liste öneridir; kullanıcıyla konuşulmadan yeni oyun kuralı olarak uygulanmaz.

## Kullanıcının istediği GitHub çalışma düzeni

Depo bağlantısı belirlendikten sonra tamamlanan her anlamlı güncellemede ilgili kontroller çalıştırılır, değişiklikler gözden geçirilir, açıklayıcı commit oluşturulur ve aynı depoya push edilir. Hata veren veya yarım deneyler tamamlanmış güncelleme gibi gönderilmez. Push sonucu doğrulanır; son yanıtta kısa commit bilgisi verilir. Kimlik bilgileri, yerel veriler ve yedekler gönderilmez.

Bu işlem mevcut çalışma sırasında yapılır; sohbet dışında kendiliğinden dosya izleme veya zamanlanmış görev oluşturulmaz. Yeni çalışma oturumlarında bu dosya çalışma tercihini kaydeder. Vercel auction-game projesi GitHub main dalına bağlıdır. Main push sonrasında otomatik üretim yayını oluşur; GitHub kontrolleri ve canlı yayın sonucu doğrulanmalıdır.

## GitHub bağlantısı

Depo: https://github.com/cranketz/auction-game (herkese açık). Yerel main dalı origin/main dalını takip eder. Git kimliği yalnızca bu depoda cranketz ve GitHub noreply adresi olarak ayarlandı. İlk gönderim doğrulandı. Tamamlanan güncellemelerde kontrollerden sonra commit ve git push uygulanır.

## İlk internet yayını · 4 Ekim 2026

Vercel: https://vercel.com/cranketzs-projects/auction-game
Geçici canlı adres: https://auction-game-zeta.vercel.app
Veritabanı: auction-game-db, Neon Free, Frankfurt. Sırlar .env.local içinde ve Vercel Production ortamındadır; Git tarafından hariç tutulur.
DNS Cloudflare tarafından yönetilir. Vercel hedef kaydı: CNAME oyun → 3cf574130d948699.vercel-dns-017.com, DNS only. Ana domain kayıtlarına dokunulmaz.

17 test ve gerçek Neon üzerinde tam servis akışı geçti. Canlı API oturum/cookie/oda/durum/çıkış kontrolleri geçti. İki oyunculu canlı kontrol için node scripts/verify-live.mjs https://auction-game-zeta.vercel.app çalıştırılır; gerçek süreleri kullanır ve test odasını sonunda kapatır.

Yayın tamamlandı: https://oyun.redodesign.art — DNS kaydı Cloudflare'a eklendi; Vercel Valid Configuration ve HTTPS doğrulandı. Ana site HTTPS 200 döndürüyor, mevcut ana kayıtlar korundu. Canlı iki oyunculu maç baştan sona geçti; yeni hostname üzerinde giriş/oda/durum/çıkış ve sahte oturum reddi doğrulandı.

## Bağlantı dayanıklılığı · 4 Ekim 2026

Oyuncu bağlantı göstergesi, 10 saniyede bir kalıcı heartbeat, 30 saniyede çevrimdışı durumu, 45 saniyede bağlı oyuncuya oda yönetimi devri ve 2 dakikada bağlantısız lobi oyuncusu temizliği eklendi. Aktif maçın oyuncu sayısı/dağıtımı bağlantı kaybında değişmez; ürünler korunur. Geri dönen eski kurucu yönetimi otomatik geri almaz. Tarayıcı çevrimiçi olunca güncelleme bağlantısı yeniden kurulur.
22 test: yönetim devri, yeniden bağlanma, lobi temizliği, sahte oturum ve beş odada altışar oyunculu tam maç akışı. Bu test kapasite davranışını doğrular; gerçek trafik gecikmesi/yük ölçümü değildir.

## Bilgisayar ve çorba içeriği · 4 Ekim 2026

Bilgisayarda 30 kurgusal model, N ayrık uyumlu setten temel havuz, soket/RAM/kasa/güç kontrolleri ve kısmi puan açıklamaları eklendi. Çorbada 24 malzeme, sabit gizli olumlu/olumsuz ikili/üçlü ilişkiler ve geçerli sıvı+ana malzeme kontrolü hazır. Tablolar sunucuda kalır; yalnız kullanılan ilişkiler sonuçta açılır. Tüm temalarda puanlar sonuç öncesi API yanıtlarından çıkarılır. Eski maçlar eski puanlamayla biter; yeni maçlar içerik sürümü 2 kullanır. Kurallar docs/TEMA_KURALLARI.md içinde; sayılar denge testi başlangıcıdır.

Doğrulama: 29 test geçti. Canlı bilgisayar ve çorba iki oyunculu maçları sonuç ekranına kadar tamamlandı; test odaları kapatıldı. Gizli puanlar sonuç öncesi API yanıtında yok; /src/soup.js canlı sitede erişilemiyor.

## Ürün kataloğu
86 ürün için giriş gerektirmeyen, tema/grup/ad filtreli katlanabilir katalog eklendi. Yalnızca kimlik, ad, grup, ipucu ve temel/ekstra bilgileri sunulur; puanlar ve gizli ilişki tabloları sunulmaz. Katalog maç durumundan bağımsızdır. 29 test geçti; tarayıcıda bilgisayar ve anakart filtreleri kontrol edildi. Oyuncu denemeleri ertelendi, denge değerleri korunuyor.

## Maç akışı ve sonuçlar
Aşama şeridi, temel/ekstra toplamları ve kalan tur sayısı eklendi. Bağlantı kesilmesi ve yeniden bağlanma bildirimi gösterilir. Sonuçlar kişisel sıralama, paylaşılan birinciler, para eşitlik kuralı ve odadan ayrılma sunar. Yeniden oyna aynı ayarlarla lobiye döner; oyuncular tekrar hazır olur. Beş adımlı kısa rehber eklendi. 31 otomatik test geçti. Oyuncu denemeleri ertelenmeye devam ediyor.

Yerel iki oyunculu maçta temel/ekstra sayaçları, kişisel sonuç ve aynı odada yeniden lobiye dönüş doğrulandı. Hızlı seçimlerin eşzamanlı kayıt çakışmasını önlemek için kombinasyon kayıt isteği sırasında seçim ve bitirme düğmeleri geçici kilitlenir.
