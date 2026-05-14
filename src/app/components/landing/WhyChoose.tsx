import {
  FaLaravel,
  FaBootstrap,
  FaReact,
  FaSass,
  FaUserShield,
  FaUserFriends,
  FaLock,
  FaCheckCircle,
  FaGlobe,
  FaSun,
  FaMoon,
  FaMobileAlt,
  FaHandPaper,
  FaBolt,
  FaCogs,
  FaBookOpen,
  FaFont,
} from "react-icons/fa";
import { SiReactrouter, SiI18Next, SiIcq } from "react-icons/si";
import { motion } from "motion/react";

export default function WhyChoose() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="bg-white px-6 py-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-4xl font-bold text-gray-800">
            Why Choose Taskflow
          </h2>
          <p className="text-gray-600">Best Feature Available in Taskflow App</p>
        </div>

        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-6">
          {/* Row 1 */}
          <IconItem label="Laravel 8">
            <FaLaravel className="h-14 w-14 text-red-600" />
          </IconItem>
          <IconItem label="Bootstrap 5x">
            <FaBootstrap className="h-14 w-14 text-purple-600" />
          </IconItem>
          <IconItem label="Boilerplate">
            <FaCheckCircle className="h-14 w-14 text-green-600" />
          </IconItem>
          <IconItem label="React">
            <FaReact className="h-14 w-14 text-cyan-500" />
          </IconItem>
          <IconItem label="React Bootstrap">
            <FaBootstrap className="h-14 w-14 text-indigo-500" />
          </IconItem>
          <IconItem label="React Router">
            <SiReactrouter className="h-14 w-14 text-pink-500" />
          </IconItem>

          {/* Row 2 */}
          <IconItem label="React i18n">
            <SiI18Next className="h-14 w-14 text-blue-500" />
          </IconItem>
          <IconItem label="Authorization">
            <FaLock className="h-14 w-14 text-gray-600" />
          </IconItem>
          <IconItem label="User Management">
            <FaUserFriends className="h-14 w-14 text-rose-500" />
          </IconItem>
          <IconItem label="Role Management">
            <FaUserShield className="h-14 w-14 text-gray-700" />
          </IconItem>
          <IconItem label="Skeleton">
            <FaCogs className="h-14 w-14 text-pink-400" />
          </IconItem>
          <IconItem label="W3C Validated">
            <FaCheckCircle className="h-14 w-14 text-green-500" />
          </IconItem>

          {/* Row 3 */}
          <IconItem label="Sass">
            <FaSass className="h-14 w-14 text-pink-500" />
          </IconItem>
          <IconItem label="Fully responsive">
            <FaMobileAlt className="h-14 w-14 text-gray-700" />
          </IconItem>
          <IconItem label="IcoFont">
            <SiIcq className="h-14 w-14 text-teal-400" />
          </IconItem>
          <IconItem label="Dark / Light Version">
            <div className="flex gap-1">
              <FaSun className="h-5 w-5 text-yellow-500" />
              <FaMoon className="h-5 w-5 text-gray-500" />
            </div>
          </IconItem>
          <IconItem label="Cross Browser">
            <FaGlobe className="h-14 w-14 text-emerald-500" />
          </IconItem>
          <IconItem label="Google Font">
            <FaFont className="h-14 w-14 text-orange-400" />
          </IconItem>

          {/* Row 4 */}
          <IconItem label="Easy to use">
            <FaHandPaper className="h-14 w-14 text-pink-400" />
          </IconItem>
          <IconItem label="High Perform">
            <FaBolt className="h-14 w-14 text-cyan-400" />
          </IconItem>
          <IconItem label="Fully Customizable">
            <FaCogs className="h-14 w-14 text-orange-400" />
          </IconItem>
          <IconItem label="Well Documented">
            <FaBookOpen className="h-14 w-14 text-yellow-500" />
          </IconItem>
        </div>
      </div>
    </motion.section>
  );
}

function IconItem({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-[#f0f9f0]">
        {children}
      </div>
      <span className="text-center text-sm font-medium text-gray-700">
        {label}
      </span>
    </div>
  );
}
