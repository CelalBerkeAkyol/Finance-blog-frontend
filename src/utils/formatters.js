/**
 * Format yardımcı fonksiyonları - tüm projede tutarlı formatlamalar için kullanılabilir
 */

/**
 * Kategori veya etiket slug'ını okunabilir formata çevirir
 * @param {string} slug - Çevrilecek slug
 * @returns {string} - Okunabilir format
 * @example slugToReadable("blog-post") => "Blog Post"
 */
export const slugToReadable = (slug) => {
  if (!slug) return "";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Metni belirli bir karakter sayısına kısaltır
 * @param {string} text - Kısaltılacak metin
 * @param {number} maxLength - Maksimum karakter sayısı
 * @returns {string} - Kısaltılmış metin
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

/**
 * Tarihi okunabilir formata çevirir
 * @param {string} dateString - ISO formatında tarih
 * @returns {string} - Okunabilir tarih
 * @example formatDate("2023-05-15") => "15 Mayıs 2023"
 */
export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Sayıyı okunabilir formata çevirir (bin, milyon, vb.)
 * @param {number} num - Formatlanacak sayı
 * @returns {string} - Okunabilir sayı
 * @example formatNumber(1500) => "1.5B"
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return "0";

  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "B";
  }
  return num.toString();
};

/**
 * Zamanı "ne kadar zaman önce" formatına çevirir
 * @param {string} dateString - ISO formatında tarih
 * @returns {string} - Ör: "5 dakika önce", "2 saat önce", "3 gün önce"
 */
export const timeAgo = (dateString) => {
  if (!dateString) return "";

  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  // Zaman dilimleri
  const intervals = {
    yıl: 31536000,
    ay: 2592000,
    hafta: 604800,
    gün: 86400,
    saat: 3600,
    dakika: 60,
    saniye: 1,
  };

  // En uygun zaman dilimini bul
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);

    if (interval >= 1) {
      return `${interval} ${unit}${
        interval > 1 && unit !== "ay" ? "" : ""
      } önce`;
    }
  }

  return "şimdi";
};

// Dışa aktarılan tüm yardımcı fonksiyonlar
export default {
  slugToReadable,
  truncateText,
  formatDate,
  formatNumber,
  timeAgo,
};
