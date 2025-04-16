import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Footer() {
  const { isLoggedIn, userInfo } = useSelector((state) => state.user);

  // Sadece normal kullanıcılar (user rolü) için hesap silme linkini göster
  const showDeleteAccountLink = isLoggedIn && userInfo?.role === "user";

  const footerLinks = [
    { name: "Son Yazılar", path: "/blog/posts" },
    { name: "Kategoriler", path: "/blog/categories" },
  ];

  const companyLinks = [
    { name: "Yazarlar", path: "/team" },
    { name: "About us", path: "/about-us" },
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms of Service", path: "/disclaimer" },
  ];

  return (
    <footer className="bg-neutral-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 pt-8">
        <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:justify-center">
          {/* Navigation Links */}
          <div className="mb-6 md:mb-0">
            <ul className="flex flex-wrap justify-center gap-6">
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="hover:underline">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <div className="hidden md:block h-8 w-px bg-gray-700"></div>

          {/* Company Links */}
          <div className="mb-6 md:mb-0">
            <ul className="flex flex-wrap justify-center gap-6">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="hover:underline">
                    {link.name}
                  </Link>
                </li>
              ))}
              {showDeleteAccountLink && (
                <li>
                  <Link
                    to="/delete-account"
                    className="hover:underline text-danger-400"
                  >
                    Hesabımı Sil
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-8 border-t border-gray-600 text-center py-4 text-sm">
        <p>© 2024 Learn Deep Invest. All rights reserved.</p>
      </div>
    </footer>
  );
}
