# Oyun arayüzü iyileştirmeleri

- Yerel SVG çizimleri: kahvaltı ürünleri; diğer temalar için grup çizimleri. Dış görsel servisi kullanılmaz.
- Hazırlama alanları: kahvaltı tabağı, altı temel bilgisayar yuvası ve ekstra alanı, çorba kazanı.
- Seçilen ürünler hazırlama alanında, satın alınanlar aşağıdaki kartlarda gösterilir. Dokunarak ekleme/çıkarma ve klavye düğmeleri çalışır. Sunucu kart sahipliğini ve sınırları doğrular.
- Alt bölümde sabit kişisel oyuncu bilgisi ve açılır envanter. Yalnızca aktif alışveriş aşamasının bakiyesi görünür.
- Teklif kabulü, rakibin geçmesi ve reddedilen teklifler için kontrol yanında geri bildirim.
- Son turun ürün, fiyat ve dağıtım sırası özeti. Oyunu bekletmez; yeni turda kısa süre açılır, yeniden açılabilir.
- Maç sonunda puan katkılarının karşılaştırılabilir çubukları. Kahvaltı kategorileri ayrıntılı; diğer temalarda mevcut prototip toplamı gösterilir.
- Bağlantı göstergesi: giriş bekleniyor, bağlı, yeniden bağlanıyor. Bağlantı yokken gönderme engellenir; SSE tekrar açıldığında son durum alınır.

Bilgisayar ve çorbanın ayrıntılı puan kuralları bu arayüz değişikliği kapsamında eklenmedi. Bağlantı göstergesi sunucu yeniden başlatılınca bellekteki kaybolan maçları kurtarmaz; kalıcılık ayrı aşamadır.
