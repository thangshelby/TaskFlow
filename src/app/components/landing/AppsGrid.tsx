import Button from "@libs/app/components/general-components/button";
import { ClipboardList, FileText, Users } from "lucide-react";
import { motion } from "motion/react";

export default function AppsGrid() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="bg-gray-50 px-6 py-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-4xl font-bold text-gray-800">
            Our Management System
          </h2>
          <p className="text-gray-600">Apps for anywhere</p>
        </div>

        <div className="mb-12 grid gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-[#f0f9f0]">
              <FileText className="h-8 w-8 text-[#064e3b]" />
            </div>
            <h3 className="mb-4 text-center text-xl font-semibold text-gray-800">
              Project Management
            </h3>
            <p className="text-center leading-relaxed text-gray-600">
              Project management is more than a to-do list. It means tracking
              tasks from beginning to end, delegating subtasks to teammates, and
              setting deadlines to make sure projects get done on time.
            </p>
          </div>

          <div className="rounded-lg bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-[#f0f9f0]">
              <Users className="h-8 w-8 text-[#064e3b]" />
            </div>
            <h3 className="mb-4 text-center text-xl font-semibold text-gray-800">
              Hr Management
            </h3>
            <p className="text-center leading-relaxed text-gray-600">
              Hr management is the practice of managing people to achieve better
              performance if you hire people into a business, you are looking
              for people who fit the company culture as they will be happier.
            </p>
          </div>

          <div className="rounded-lg bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-[#f0f9f0]">
              <ClipboardList className="h-8 w-8 text-[#064e3b]" />
            </div>
            <h3 className="mb-4 text-center text-xl font-semibold text-gray-800">
              Task Board
            </h3>
            <p className="text-center leading-relaxed text-gray-600">
              The board allows to improve workflow visibility and ensures
              efficient diffusion of information relevant to the whole team. It
              helps team members to see their progress at a glance.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Button className="bg-[#002117] px-8 py-3 text-white hover:bg-[#064e3b]">
            Buy Extended License
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
