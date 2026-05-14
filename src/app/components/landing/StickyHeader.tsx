import { ClipboardCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function StickyHeader({ isShow }: { isShow: boolean }) {
  return (
    <div className="fixed top-18 left-0 z-50 w-full">
      <AnimatePresence>
        {isShow && (
          <motion.div
            key="sticky-header"
            initial={{ opacity: 0, y: 0, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full bg-white shadow-xl"
          >
            <nav className="w-full px-6 py-4">
              <div className="mx-auto flex max-w-7xl items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="h-8 w-8 text-[#064e3b]" />
                  <span className="text-xl font-semibold text-gray-800">
                    Taskflow
                  </span>
                </div>
                <div className="flex items-center gap-8">
                  <a
                    href="#hero"
                    className="text-gray-700 transition-colors hover:text-[#064e3b]"
                  >
                    Home
                  </a>
                  <a
                    href="#features"
                    className="text-gray-700 transition-colors hover:text-[#064e3b]"
                  >
                    Features
                  </a>
                  <a
                    href="#auth"
                    className="text-gray-700 transition-colors hover:text-[#064e3b]"
                  >
                    Authorization
                  </a>
                  <a
                    href="#apps"
                    className="text-gray-700 transition-colors hover:text-[#064e3b]"
                  >
                    Apps
                  </a>
                  <a
                    href="#why"
                    className="text-gray-700 transition-colors hover:text-[#064e3b]"
                  >
                    Why
                  </a>
                  <a
                    href="#footer"
                    className="text-gray-700 transition-colors hover:text-[#064e3b]"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
