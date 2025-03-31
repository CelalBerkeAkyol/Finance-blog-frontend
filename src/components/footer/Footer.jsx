import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Footer() {
  const { isLoggedIn, userInfo } = useSelector((state) => state.user);

  // Sadece normal kullanıcılar (user rolü) için hesap silme linkini göster
  const showDeleteAccountLink = isLoggedIn && userInfo?.role === "user";

  return (
    <footer className="bg-neutral-900 text-gray-300 mt-auto">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-6 pt-8">
        {/* Column 1 */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-white font-semibold text-lg mb-4">
            Popular Categories
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/blog/category/makro-ekonomi"
                className="hover:underline"
              >
                Makro Ekonomi
              </Link>
            </li>
            <li>
              <Link
                to="/blog/category/mikro-ekonomi"
                className="hover:underline"
              >
                Mikro Ekonomi
              </Link>
            </li>

            <li>
              <Link to="/blog/category/araştırma" className="hover:underline">
                Araştırma
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2 */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-white font-semibold text-lg mb-4">Company</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/about-us" className="hover:underline">
                About us
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/disclaimer" className="hover:underline">
                Terms of Service
              </Link>
            </li>
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

        {/* Column 3 */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Subscribe</h3>
          <form>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 rounded bg-zinc-700 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="mt-3 w-full py-2 bg-zinc-700 text-white rounded hover:bg-indigo-500 transition duration-200">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-8 border-t border-gray-600 text-center py-4 text-sm">
        <p>© 2024 Fin AI. All rights reserved.</p>
      </div>
    </footer>
  );
}
