import { ClipboardCheck, Globe } from "lucide-react";
import { motion } from "motion/react";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="bg-gray-100 px-6 py-12"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <ClipboardCheck className="h-8 w-8 text-[#064e3b]" />
              <span className="text-xl font-semibold text-gray-800">
                Taskflow
              </span>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">
              Pixelwibes is the world's leading community for creatives to
              share, grow, and get hired.
            </p>
            <div className="mb-4">
              <p className="mb-1 font-semibold text-gray-800">Pixelwibes.</p>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-gray-800">4.5</span>
                <div className="flex text-yellow-400">
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span className="text-gray-300">★</span>
                </div>
                <span className="text-sm text-gray-600">Reviews</span>
              </div>
            </div>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded bg-gray-200 transition-colors hover:bg-[#064e3b] hover:text-white"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded bg-gray-200 transition-colors hover:bg-[#064e3b] hover:text-white"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded bg-gray-200 transition-colors hover:bg-[#064e3b] hover:text-white"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded bg-gray-200 transition-colors hover:bg-[#064e3b] hover:text-white"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-gray-800">COMPANY</h3>
            <ul className="space-y-2">
              {[
                "Hire Developer",
                "About Us",
                "Services",
                "Portfolio",
                "Blog",
              ].map((label) => (
                <li key={label}>
                  <a
                    href="#"
                    className="text-sm text-gray-600 transition-colors hover:text-[#064e3b]"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-gray-800">SERVICES</h3>
            <ul className="space-y-2">
              {[
                "WEB Technologies",
                "Cross Platform Apps",
                "Frontend Technologies",
                "UI/UX & Design",
                "BlockChain",
              ].map((label) => (
                <li key={label}>
                  <a
                    href="#"
                    className="text-sm text-gray-600 transition-colors hover:text-[#064e3b]"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-gray-800">Templates</h3>
            <ul className="space-y-2">
              {[
                "Qboat",
                "Cryptoon",
                "Ebazar",
                "Ihealth",
                "e-Learn",
                "Timetracker",
              ].map((label) => (
                <li key={label}>
                  <a
                    href="#"
                    className="text-sm text-gray-600 transition-colors hover:text-[#064e3b]"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-300 pt-6 md:flex-row">
          <p className="text-sm text-gray-600">
            Designed and Developed by Pixelwibes
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-sm text-gray-600 transition-colors hover:text-[#064e3b]"
            >
              Terms of use
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 transition-colors hover:text-[#064e3b]"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
