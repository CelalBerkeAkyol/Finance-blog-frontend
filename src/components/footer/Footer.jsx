export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-gray-300 mt-auto">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-3  px-6 pt-8">
        {/* Column 1 */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-2">Company</h3>
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
          <h3 className="text-white font-semibold text-lg mb-2">Support</h3>
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
          <h3 className="text-white font-semibold text-lg ">Subscribe</h3>
          <form>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 rounded bg-zinc-700 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="mt-3 w-full py-2 bg-zinc-700  text-white rounded hover:bg-indigo-500">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-5 border-t border-gray-700  text-center py-4 text-sm">
        <p>© 2024 MyCompany. All rights reserved.</p>
      </div>
    </footer>
  );
}
