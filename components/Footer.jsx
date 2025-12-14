export default function Footer() {
  return (
    <footer className="mt-20 bg-transparent border-t border-slate-600">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-3xl font-bold main-dark tracking-tight">MessFinder</h2>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed">
            Helping students discover clean, affordable and trusted mess options near their hostel.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-lg font-semibold main-dark mb-4">Quick Links</h3>
          <ul className="space-y-2 text-slate-400">
            <li>
              <a href="/" className="hover:text-emerald-400 transition">Home</a>
            </li>
            <li>
              <a href="/become-owner" className="hover:text-emerald-400 transition">Become Owner</a>
            </li>
            <li>
              <a href="/about" className="hover:text-emerald-400 transition">About Us</a>
            </li>
            <li>
              <a href="/contact" className="hover:text-emerald-400 transition">Contact</a>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-lg font-semibold main-dark mb-4">Contact Us</h3>
          <ul className="space-y-2 text-slate-400">
            <li>Email: support@messfinder.com</li>
            <li>Phone: +91 98765 43210</li>
            <li>Nagpur, Maharashtra</li>
          </ul>
        </div>

      </div>

      {/* BOTTOM COPYRIGHT BAR */}
      <div className="border-t border-slate-800/60 text-center py-4">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} MessFinder • All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
