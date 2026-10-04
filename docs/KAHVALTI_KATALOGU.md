# Kahvaltı kataloğu ve kombinasyon taslağı

Durum: Tasarım önerisi v0.1; henüz oyun motoruna uygulanmadı.

## Tasarım amacı

Oyuncunun seçimi yalnızca en pahalı veya en yüksek puanlı ürüne dayanmasın. Ürünün değeri, diğer alışverişlerle ve rakiplerin aldığı ürünlerle değişsin. Ürün isimleri, kısa açıklamalar ve kombinasyon ipuçları görünür olsun; sayısal puanlar maç sonucuna kadar gösterilmesin. Gizli puan, rastgele puan anlamına gelmez: Aynı ürünler aynı sürümde aynı sonucu verir.

Kahvaltı uyumları anlaşılır biçimde tarif edilir; bu, çorbanın gizli ve deneyerek keşfedilen uyum sisteminden farklıdır. Buradaki puanlar oyun dengesi içindir, beslenme değerlendirmesi değildir.

## 1. Temel katalog — 16 ürün

Her grupta oyuncu sayısı kadar fiziksel kart açılır. Modeller tekrar edebilir. Her oyuncu gizli teklif/tercih sistemiyle her gruptan bir kart alır. Temel bütçe, ekstra bütçeden ayrıdır.

| Kimlik | Grup | Ürün | Oyuncuya gösterilecek ipucu |
|---|---|---|---|
| bread-simit | Ekmek | Simit | Beyaz peynir ve çayla klasik bir masa kurar. |
| bread-whole | Ekmek | Tam buğday ekmeği | Lor ve taze sebzelerle tamamlanır. |
| bread-toast | Ekmek | Tost ekmeği | Kaşar ve domatesle sıcak bir kombinasyon oluşturur. |
| bread-bazlama | Ekmek | Bazlama | Tereyağı ve balı değerlendirmek için iyi bir tabandır. |
| cheese-white | Peynir | Beyaz peynir | Simit veya domatesle uyum sağlar. |
| cheese-kasar | Peynir | Kaşar | Tost ekmeği ve domatesle değer kazanır. |
| cheese-lor | Peynir | Lor | Tam buğday ekmeği veya balla farklı yollar açar. |
| cheese-tulum | Peynir | Tulum | Ceviz ve zeytinle güçlü bir eşleşme kurar. |
| egg-boiled | Yumurta | Haşlanmış yumurta | Salatalık ve domatesle ferah bir tabak kurar. |
| egg-fried | Yumurta | Sahanda yumurta | Sucuk veya bazlamayla tamamlanır. |
| egg-omelet | Yumurta | Sade omlet | Kaşar veya biberle zenginleştirilebilir. |
| egg-scrambled | Yumurta | Çırpılmış yumurta | Domates veya tost ekmeğiyle tamamlanır. |
| drink-tea | İçecek | Çay | Simit ve beyaz peynirle klasik kahvaltıyı tamamlar. |
| drink-coffee | İçecek | Kahve | Tost veya çikolata kremasıyla eşleşir. |
| drink-milk | İçecek | Süt | Bal veya fındıkla tamamlanır. |
| drink-orange | İçecek | Portakal suyu | Haşlanmış yumurta veya taze sebzelerle eşleşir. |

## 2. Ekstra katalog — 16 ürün

Satış sayısı mevcut kurala göre oyuncu başına 2'dir. Bütün modeller katalogda görünür; hangilerinin geleceği bilinmez. Bir maçta aynı model yeniden gelebilir.

| Kimlik | Ek grup | Ürün | Oyuncuya gösterilecek ipucu |
|---|---|---|---|
| extra-black-olive | Zeytin | Siyah zeytin | Beyaz peynir veya tulumla tamamlanır. |
| extra-green-olive | Zeytin | Yeşil zeytin | Lor veya domatesle eşleşir. |
| extra-tomato | Sebze | Domates | Peynir, yumurta ve tost kombinasyonlarında esnektir. |
| extra-cucumber | Sebze | Salatalık | Haşlanmış yumurta veya beyaz peynirle tamamlanır. |
| extra-pepper | Sebze | Biber | Omlet veya çırpılmış yumurtayla eşleşir. |
| extra-honey | Tatlı | Bal | Bazlama, lor veya sütle kullanılabilir. |
| extra-strawberry | Tatlı | Çilek reçeli | Tost ekmeği veya tereyağıyla tamamlanır. |
| extra-apricot | Tatlı | Kayısı reçeli | Bazlama veya beyaz peynirle eşleşir. |
| extra-chocolate | Tatlı | Çikolata kreması | Tost ekmeği veya kahveyle tamamlanır. |
| extra-butter | Sürülebilir | Tereyağı | Bazlama, bal veya reçelle eşleşir. |
| extra-kaymak | Sürülebilir | Kaymak | Bal veya bazlamayla değer kazanır. |
| extra-sucuk | Şarküteri | Sucuk | Sahanda yumurta veya kaşarla sıcak bir tabak kurar. |
| extra-pastirma | Şarküteri | Pastırma | Omlet veya tulumla eşleşir. |
| extra-walnut | Kuruyemiş | Ceviz | Tulum veya balla tamamlanır. |
| extra-hazelnut | Kuruyemiş | Fındık | Süt veya çikolata kremasıyla eşleşir. |
| extra-tahin | Sürülebilir | Tahin-pekmez | Tam buğday ekmeği veya sütle tamamlanır. |

## 3. Sayısal puan taslağı

Başlangıçta bütün farklı temel ürünler 8, farklı ekstralar 4 taban puan getirir. Böylece başlangıçta hiçbir model sırf taban puanı yüzünden üstün değildir. Dört temel grup menüde bulunursa +12 tamlık bonusu verilir. En fazla dört farklı ekstra grubu için grup başına +2 çeşitlilik bonusu vardır.

Tek kombinasyon, en fazla 8 kart kuralı korunur. Aynı modelin ikinci fiziksel kopyası ek puan veya bonus sağlamaz. Aynı model yalnızca bir kez hesaba katılır. Farklı ürünler aynı ekstra grubuna ait olabilir; ikisi de taban puan alır fakat grup çeşitlilik bonusu yalnızca bir kez verilir.

### İkili bonuslar

Aşağıdaki çiftler +4 getirir. Bir çift menüde yalnızca bir kez sayılır. Toplam ikili bonus üst sınırı +24'tür; çok sayıda ilişki içeren tek ürünün bütün oyunu yönetmesini önlemek için bu sınır test edilecektir.

- Simit + beyaz peynir; simit + çay.
- Tam buğday ekmeği + lor; tam buğday ekmeği + tahin-pekmez.
- Tost ekmeği + kaşar; tost ekmeği + çırpılmış yumurta; tost ekmeği + kahve; tost ekmeği + çilek reçeli; tost ekmeği + çikolata kreması.
- Bazlama + tereyağı; bazlama + kaymak; bazlama + sahanda yumurta; bazlama + bal; bazlama + kayısı reçeli.
- Beyaz peynir + domates; beyaz peynir + salatalık; beyaz peynir + siyah zeytin; beyaz peynir + kayısı reçeli.
- Kaşar + sade omlet; kaşar + sucuk.
- Lor + bal; lor + yeşil zeytin.
- Tulum + ceviz; tulum + siyah zeytin; tulum + pastırma.
- Haşlanmış yumurta + salatalık; haşlanmış yumurta + domates; haşlanmış yumurta + portakal suyu.
- Sahanda yumurta + sucuk.
- Sade omlet + biber; sade omlet + pastırma.
- Çırpılmış yumurta + biber; çırpılmış yumurta + domates.
- Portakal suyu + salatalık; portakal suyu + domates.
- Kahve + çikolata kreması.
- Süt + bal; süt + fındık; süt + tahin-pekmez.
- Yeşil zeytin + domates.
- Tereyağı + bal; tereyağı + çilek reçeli.
- Kaymak + bal.
- Ceviz + bal.
- Fındık + çikolata kreması.

### Üçlü kombinasyonlar

| Kombinasyon adı | Gerekli ürünler | Bonus |
|---|---|---:|
| Klasik masa | Simit, beyaz peynir, çay | +8 |
| Tost üçlüsü | Tost ekmeği, kaşar, domates | +8 |
| Tatlı bazlama | Bazlama, tereyağı, bal | +8 |
| Ferah tabak | Haşlanmış yumurta, domates, salatalık | +8 |
| Sıcak tava | Sahanda yumurta, sucuk, bazlama | +8 |
| Ballı lor | Tam buğday ekmeği, lor, bal | +8 |
| Yoğun lezzet | Tulum, ceviz, siyah zeytin | +8 |
| Tatlı mola | Tost ekmeği, çikolata kreması, kahve | +8 |

Üçlü bonus ikili bonuslardan ayrı sayılır. Önerilen sınır: Maç sonucunda en yüksek iki üçlü bonus sayılır. İlişkiler ve bonusların varlığı katalogda anlaşılır; kesin sayılar sonuçta açıklanır. Hazırlama sırasında toplam puan tahmini gösterilmez.

## 4. Örnek sonuç hesapları

Klasik masa: Simit + beyaz peynir + haşlanmış yumurta + çay + siyah zeytin + domates. Taban 40; temel tamlık 12; iki ekstra grubu 4; altı ikili eşleşme 24; klasik masa 8. Toplam **88**.

Tatlı masa: Bazlama + lor + sade omlet + süt + bal + tereyağı. Taban 40; tamlık 12; iki ekstra grubu 4; altı ikili eşleşme 24; tatlı bazlama 8. Toplam **88**.

Rastgele masa: Simit + kaşar + haşlanmış yumurta + süt. Taban 32; tamlık 12; ikili veya üçlü bonus yok. Toplam **44**.

Bu örnekler yalnızca önerilen kuralların aritmetiğini gösterir. İki örneğin eşit puan alması bütün kataloğun dengeli olduğunun kanıtı değildir. Maç kazananı, rakibin kombinasyonu ve puan eşitliğinde kalan toplam bütçe ile belirlenir.

## 5. Gizli temel teklif deneyi

Mevcut ödeme modeli korunur; test bitmeden yeni zorunlu ücret eklenmez. Oyuncu 0 vererek ürün alabilir; harcama ilk tercihe ulaşma şansını satın alır. Aynı taban puanlı modellerde bu hak, planlanan ekstra eşleşmeler üzerinden değer kazanır.

Risk: Ekstralar henüz açılmadığı için ilk grupta para harcamanın getirisi belirsizdir. Sonraki temel gruplarda eldeki ürünleri tamamlamak daha bilinçli olabilir. Bu nedenle bütün gruplardaki harcama dağılımı ayrı ölçülür.

Karşılaştırılacak stratejiler: Her gruba 0; bütçeyi gruplara eşit dağıtma; eldeki ürüne uyumlu tercih için teklif; bütçeyi son gruba saklama. 2, 3 ve 6 oyuncuyla, 50/100/150 bütçelerin her birinde aynı ürün havuzları üzerinde stratejiler karşılaştırılır. Öncelik sıraları döndürülerek koltuk avantajı ayrıştırılır.

İlk aşama en az 30 kahvaltı maçı; belirgin bir sonuç çıkarsa daha geniş test. Ortalama puan, kazanma/paylaşılan kazanma oranı, harcanan temel para, ilk tercihe ulaşma ve oyuncu memnuniyeti kaydedilir. Test yapılmadan herhangi bir stratejinin baskın olduğu ilan edilmez.

## 6. İçerik dağıtımı ve uygulanma sırası

Önerilen başlangıç: Bir temel grupta alternatifleri teşvik etmek için mümkün olduğunca farklı modeller seçilsin. Oyuncu sayısı 4'ü aşınca tekrar kaçınılmazdır. Böyle bir dağıtım değişikliği henüz onaylı değildir; mevcut tekrar edebilir rastgele seçim başlangıçta korunabilir.

Ekstra havuzunda hem esnek hem dar eşleşmeli ürünler bulunur. Domates gibi çok ilişkili ürünler ikili bonus sınırına rağmen baskın olabilir; seçilme oranı ve kazandırdığı ek puan ölçülür. Her oyuncunun tercih ettiği kombinasyonun tamamlanması garanti edilmez; gelecekteki ekstralar gizli kalır.

Uygulama sırası: Kataloğu veri olarak tanımla → bilinen ipuçlarını kartlarda göster → sunucuda puan motorunu uygula → sonuç dökümünü göster → mevcut kurallara ilişkin testleri ekle → oynanabilir örnekler ve denge ölçümü. Bu dosya bu uygulamadan önce incelenebilir tasarım teslimatıdır.

## 7. Tasarımda henüz onay gerektiren tercih

Sayısal taslak ve ikili/üçlü bonus sınırları deneme değerleridir. Temel ürünler eşit taban puanlı, asıl farkları kombinasyonlarından gelen ürünler olarak önerilmiştir. Kahvaltıda başlangıçta negatif uyum cezası yoktur: Uyumsuz ürün eklemek ceza vermek yerine bonus fırsatını ve 8 kartlık alanı tüketir. Çorba negatif gizli uyumları korur.
