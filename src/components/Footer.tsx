export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Lewa kolumna (logo + copyright i payment badges) */}
          <div className="md:col-span-1">
            <div className="flex items-center">
              <h2 className="text-3xl font-extrabold tracking-tight">
                <span className="text-orange-500">Nexus</span>
                <span className="text-white">Hub</span>
              </h2>
            </div>

            <p className="mt-6 text-sm text-gray-400">
              © 2023 NexusHub. All rights reserved.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="bg-white rounded-md px-3 py-2 text-xs font-semibold shadow-sm inline-flex items-center">
                VISA
              </span>
              <span className="bg-white rounded-md px-3 py-2 text-xs font-semibold shadow-sm inline-flex items-center">
                Mastercard
              </span>
              <span className="bg-white rounded-md px-3 py-2 text-xs font-semibold shadow-sm inline-flex items-center">
                PayPal
              </span>
              <span className="bg-white rounded-md px-3 py-2 text-xs font-semibold shadow-sm inline-flex items-center">
                Pay
              </span>
              <span className="bg-white rounded-md px-3 py-2 text-xs font-semibold shadow-sm inline-flex items-center">
                GPay
              </span>
            </div>
          </div>

          {/* Kolumny z listami */}
          <div className="md:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li>About Us</li>
                <li>Contact</li>
                <li>Partner</li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Social</h3>
              <ul className="space-y-3 text-gray-400">
                <li>Instagram</li>
                <li>Twitter</li>
                <li>Facebook</li>
                <li>LinkedIn</li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">FAQ</h3>
              <ul className="space-y-3 text-gray-400">
                <li>Account</li>
                <li>Deliveries</li>
                <li>Orders</li>
                <li>Payments</li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-3 text-gray-400">
                <li>E-books</li>
                <li>Tutorials</li>
                <li>Course</li>
                <li>Blog</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
