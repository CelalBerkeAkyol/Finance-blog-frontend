const handleLogout = async () => {
  console.info("handleLogout: Çıkış işlemi başlatılıyor.");
  try {
    const response = await fetch("http://127.0.0.1:8000/api/logout", {
      method: "POST",
      credentials: "include",
    });
    if (response.ok) {
      console.info("handleLogout: Çıkış başarılı. Yönlendiriliyor...");
      // Örneğin Redux state temizleme işlemleri yapılabilir.
      window.location.href = "/blog-admin/login";
    } else {
      console.error(
        "handleLogout: Çıkış yapma hatası. HTTP durum:",
        response.status
      );
    }
  } catch (error) {
    console.error("handleLogout: Sunucu hatası:", error);
  }
};

export default handleLogout;
