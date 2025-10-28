# 📧 EmailJS Kurulum Rehberi

İletişim formunuzdan gelen mesajların `info@koptay.av.tr` adresine gitmesi için EmailJS kurulumu yapmanız gerekiyor.

## 🚀 Adım Adım Kurulum

### 1️⃣ EmailJS Hesabı Oluşturun
1. [https://www.emailjs.com/](https://www.emailjs.com/) adresine gidin
2. Sağ üstteki **"Sign Up"** butonuna tıklayın
3. Gmail hesabınızla giriş yapın (en kolay yöntem)
4. Ücretsiz plan yeterli (ayda 200 mail)

---

### 2️⃣ Email Service Ekleyin
1. Dashboard'da **"Email Services"** sekmesine gidin
2. **"Add New Service"** butonuna tıklayın
3. **Gmail** seçin
4. Açılan pencerede:
   - **Service Name:** `Koptay Hukuk` yazın
   - **Connect Gmail Account** butonuna tıklayın
   - `info@koptay.av.tr` Gmail hesabıyla giriş yapın
   - İzinleri onaylayın
5. **Service ID**'yi kopyalayın (örnek: `service_abc1234`)
   - Bu ID'yi bir yere not edin! ✏️

---

### 3️⃣ Email Template Oluşturun
1. Dashboard'da **"Email Templates"** sekmesine gidin
2. **"Create New Template"** butonuna tıklayın
3. Template içeriğini şöyle düzenleyin:

#### Subject (Konu):
```
Yeni İletişim Formu - {{subject}}
```

#### Content (İçerik):
```html
<h2>🏛️ Yeni İletişim Formu Mesajı</h2>

<p><strong>Gönderen:</strong> {{from_name}}</p>
<p><strong>E-posta:</strong> {{from_email}}</p>
<p><strong>Telefon:</strong> {{phone}}</p>
<p><strong>Konu:</strong> {{subject}}</p>

<hr>

<h3>Mesaj:</h3>
<p>{{message}}</p>

<hr>
<p style="color: #666; font-size: 12px;">
Bu mesaj koptay.av.tr web sitesi iletişim formundan gönderilmiştir.
</p>
```

4. **Settings** kısmında:
   - **To Email:** `info@koptay.av.tr` yazın
   - **From Name:** `{{from_name}}` yazın
   - **Reply To:** `{{reply_to}}` yazın (böylece direkt cevaplayabilirsiniz)

5. **Save** butonuna tıklayın
6. **Template ID**'yi kopyalayın (örnek: `template_xyz5678`)
   - Bu ID'yi de not edin! ✏️

---

### 4️⃣ Public Key Alın
1. Dashboard'da sol menüden **"Account"** → **"General"** sekmesine gidin
2. **"Public Key"** bölümünü bulun
3. Public Key'i kopyalayın (örnek: `aBcDeFgHiJkLmN`)
   - Bu key'i de not edin! ✏️

---

### 5️⃣ Kodunuzu Güncelleyin

Şimdi `src/utils/api.js` dosyasını açın ve şu satırları bulun:

```javascript
const EMAILJS_CONFIG = {
  serviceID: 'service_XXXXX',      // EmailJS'den alacağınız Service ID
  templateID: 'template_XXXXX',    // EmailJS'den alacağınız Template ID
  publicKey: 'YOUR_PUBLIC_KEY'     // EmailJS'den alacağınız Public Key
};
```

Bu satırları aldığınız değerlerle değiştirin:

```javascript
const EMAILJS_CONFIG = {
  serviceID: 'service_abc1234',        // Adım 2'den aldığınız
  templateID: 'template_xyz5678',      // Adım 3'ten aldığınız
  publicKey: 'aBcDeFgHiJkLmN'          // Adım 4'ten aldığınız
};
```

---

### 6️⃣ Test Edin!

1. Değişiklikleri kaydedin
2. Git commit + push yapın:
```bash
git add .
git commit -m "EmailJS yapılandırması tamamlandı"
git push origin main
```

3. Siteniz deploy edildikten sonra (1-2 dakika) iletişim formunu test edin
4. `info@koptay.av.tr` adresine mail geldiğini kontrol edin ✅

---

## 🎯 Kontrol Listesi

- [ ] EmailJS hesabı oluşturuldu
- [ ] Gmail service eklendi (`info@koptay.av.tr`)
- [ ] Email template oluşturuldu
- [ ] Service ID kopyalandı
- [ ] Template ID kopyalandı
- [ ] Public Key kopyalandı
- [ ] `api.js` dosyası güncellendi
- [ ] Değişiklikler push edildi
- [ ] Form test edildi
- [ ] Mail geldi ✅

---

## ❓ Sorun mu var?

### Mail gelmiyor?
1. Gmail hesabının doğru bağlandığından emin olun
2. EmailJS Dashboard'da "Logs" sekmesine bakın
3. Template'deki email adresini kontrol edin
4. Spam klasörünü kontrol edin

### Hata alıyorum?
1. Console'da (F12) hataları kontrol edin
2. Service ID, Template ID ve Public Key'in doğru olduğundan emin olun
3. EmailJS Dashboard'da aylık limitinizi kontrol edin (200 mail/ay)

---

## 💡 İpuçları

- EmailJS ücretsiz planda ayda 200 mail gönderebilirsiniz
- Daha fazlaya ihtiyacınız varsa ücretli plana geçebilirsiniz
- Her mail gönderiminde EmailJS Dashboard'da log tutulur
- Template'i istediğiniz zaman değiştirebilirsiniz (kod değişikliği gerekmez)

---

**Başarılar! 🎉**
