import { motion } from "motion/react";
import { useState } from "react";

export default function FeaturesList() {
  const [activeFeature, setActiveFeature] = useState<string>(
    "Projects Management",
  );

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
            This is the Future of Work.
          </h2>
          <p className="text-gray-600">All Our work in one place</p>
        </div>

        <div className="flex w-full items-center justify-center gap-12">
          <div className="w-[40%] space-y-1">
            {[
              "Projects Management",
              "Task Management",
              "Project Timesheet",
              "Tickets Detail",
              "Attendance Detail",
              "Employees View",
              "Leave Request",
              "Clients List",
              "Calendar Events",
              "Chat List",
              "Contact",
            ].map((label, index) => (
              <div
                onClick={() => {
                  setActiveFeature(label);
                }}
                key={label}
                className={`flex cursor-pointer items-center gap-4 rounded-lg p-4 py-2 transition-colors ${activeFeature === label ? "bg-[#f0f9f0]" : ""}`}
              >
                <span
                  className={`text-lg font-bold hover:text-[#064e3b] ${activeFeature === label ? "text-[#064e3b]" : "text-gray-500"}`}
                >
                  {String(index + 1).padStart(2, "0")} :
                </span>
                <span
                  className={`font-bold hover:text-[#064e3b] ${
                    activeFeature === label
                      ? "text-[#064e3b]"
                      : "text-gray-600"
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="relative flex h-full w-full flex-1 items-center justify-center">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-HK9l9065mPN1Q20nC7eN4LIzNBeHg4.png"
              alt="Projects Management Interface"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
