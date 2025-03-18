# Profil Bileşenleri

Bu dizin, kullanıcı profil sayfası için gerekli olan modüler bileşenleri içerir. Bu yapı, kod organizasyonunu iyileştirmek, bakımı kolaylaştırmak ve bileşenlerin yeniden kullanılabilirliğini artırmak için tasarlanmıştır.

## İçerik

### Bileşenler

- **ProfileImageUploader.jsx**: Profil resmi yükleme, önizleme ve silme işlevlerini sağlar.
- **ProfileEditForm.jsx**: Kullanıcı profil bilgilerini düzenleme formunu içerir.
- **ProfileTabs.jsx**: Kullanıcı bilgilerini kategorik sekmeler halinde gösterir.
- **ProfileSummaryCard.jsx**: Kullanıcı profilinin özetini kart şeklinde gösterir.

### Servisler

- **ProfileImageService.js**: Resim yükleme, doğrulama ve önizleme için gerekli yardımcı fonksiyonları içerir.

### Genel Export

- **ProfileComponents.js**: Tüm bileşen ve servisleri tek bir yerden export eder, import işlemlerini kolaylaştırır.

## Kullanım

Profil bileşenlerini uygulamanızda kullanmak için:

```jsx
import {
  ProfileImageUploader,
  ProfileEditForm,
  ProfileSummaryCard,
  uploadProfileImage,
  validateImageFile,
  createImagePreview,
} from "./profile-components/ProfileComponents";
```

## Bileşen Hiyerarşisi

```
ProfileComponent (Ana Bileşen)
├── ProfileSummaryCard
│   └── ProfileTabs
├── ProfileImageUploader
└── ProfileEditForm
```

## Servis Kullanımı

```jsx
// Resim dosyasını doğrulama
if (validateImageFile(file, errorCallback)) {
  // Geçerli dosya
}

// Resim önizlemesi oluşturma
createImagePreview(file, setImagePreview);

// Resmi sunucuya yükleme
const imageUrl = await uploadProfileImage(file, setLoadingState, errorCallback);
```

## Bakım ve Geliştirme

Yeni bir bileşen eklerken:

1. Bileşeni ayrı bir dosya olarak oluşturun
2. `ProfileComponents.js` dosyasına export ifadesini ekleyin
3. Gerekli yerlerde import ederek kullanın
