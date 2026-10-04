# Geliştirme öncelikleri ve GitHub düzeni

## Mevcut durum

Yerel prototip oynanabilir; üretim yayını henüz hazır değildir. Kullanıcının arayüz kararları: kısa bütçe etiketi, oda kodu kopyalama, oyuncu sayısı uyarısı, maç öncesi ürün puanlarının gizlenmesi, teklif taslağını değiştiren artı/eksi düğmeleri, kartlı temel tercih sırası, faza göre bakiye, oda sahibinde ayrı hazır düğmesi olmaması.

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

Bu işlem mevcut çalışma sırasında yapılır; sohbet dışında kendiliğinden dosya izleme veya zamanlanmış görev oluşturulmaz. Yeni çalışma oturumlarında bu dosya çalışma tercihini kaydeder. GitHub yüklemesi oyun sitesinin otomatik yayınlanması anlamına gelmez.

## İlk depo kurulumu için eksikler

GitHub depo adresi veya yeni deponun sahibi/adı/görünürlüğü; yerel Git commit kimliği; push için yetkili bağlantı. Bu bilgiler olmadan gönderim tamamlanmış sayılmaz.
