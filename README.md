# 🌌 Güneş Sistemi Simülasyonu

Gerçekçi fizik motoruna sahip, interaktif 3B Güneş Sistemi simülasyonu.

## 🚀 Özellikler

- **Gerçekçi Fizik Motoru**
  - Genel görelilik etkileri
  - Kepler yörünge hesaplamaları
  - RK4 integrasyon metodu
  - Doğru ölçeklendirilmiş kütleçekim etkileşimleri

- **Detaylı Gezegen Modelleri**
  - Gerçek boyut oranları
  - Doğru yörünge parametreleri
  - Eksen eğiklikleri
  - Dönme periyotları

- **İnteraktif Özellikler** 🎮
  - Gezegen bilgi kartları
  - Gezegen karşılaştırma arayüzü
  - Kamera kontrolleri ve hazır görünümler
  - Zaman kontrolü (hızlandırma, yavaşlatma, ileri-geri sarma)

- **Görsel Detaylar** 🎨
  - Yörünge izleri
  - Asteroid kuşağı
  - Atmosfer efektleri
  - Satürn halkaları
  - Yıldız arkaplanı

## 🛠️ Teknolojiler

- Three.js - 3B grafik motoru
- JavaScript - Ana programlama dili
- HTML5 & CSS3 - Kullanıcı arayüzü
- WebGL - Donanım hızlandırmalı grafik işleme

## ⚙️ Kurulum

1. Repoyu klonlayın:
   ```bash
   git clone https://github.com/[kullanıcı-adı]/solar-system.git
   ```

2. Proje dizinine gidin:
   ```bash
   cd solar-system
   ```

3. Bir web sunucusu başlatın (örneğin Python ile):
   ```bash
   python -m http.server 8000
   ```

4. Tarayıcınızda açın:
   ```
   http://localhost:8000
   ```

## 🎮 Kullanım

- **Gezegen Seçimi**: Gezegenlere tıklayarak detaylı bilgi alabilirsiniz
- **Kamera Kontrolü**: 
  - Sol tık + sürükle: Döndürme
  - Sağ tık + sürükle: Kaydırma
  - Fare tekerleği: Yakınlaştırma/Uzaklaştırma
- **Zaman Kontrolü**:
  - Oynat/Durdur
  - Hız ayarı
  - İleri/geri sarma
  - Belirli bir tarihe atlama

## 📚 Fizik Motoru

Simülasyon şu fiziksel hesaplamaları içerir:
- Newton'un evrensel çekim yasası
- Genel görelilik düzeltmeleri
- Kepler'in gezegen hareket yasaları
- Runge-Kutta 4. derece sayısal integrasyon

## 🤝 Katkıda Bulunma

1. Bu repoyu fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/YeniOzellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/YeniOzellik`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakınız.

## 👨‍💻 Geliştirici

Arda Çırak

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/bykurtu/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/byKurtu)

## 🌟 Teşekkürler

Bu projeyi geliştirirken kullanılan açık kaynak kütüphanelerin geliştiricilerine teşekkürler:
- Three.js ekibi
- WebGL topluluğu
- NASA (gezegen verileri için) 
