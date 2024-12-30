export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-gray-300 py-10 mt-auto">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 px-6">
        {/* Column 1 */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Company</h3>
          <ul>
            <li>
              <a href="#" className="hover:underline">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Support</h3>
          <ul>
            <li>
              <a href="#" className="hover:underline">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Subscribe</h3>
          <form>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="mt-3 w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center">
        <p>© 2024 MyCompany. All rights reserved.</p>
      </div>
    </footer>
  );
}
