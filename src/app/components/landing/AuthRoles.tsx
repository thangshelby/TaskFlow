import Button from "@libs/app/components/general-components/button";
import { motion, AnimatePresence } from "motion/react";
import taskManagementImg from "@libs/assets/images/task_management.png";
import teamManagementImg from "@libs/assets/images/team_management.png";
import loginImg from "@libs/assets/images/login.png";
import { useState } from "react";

export default function AuthRoles() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const tabs = [
    {
      label: "Login",
      des1: "The whole purpose of this post is about being dynamic. Especially, in systems with a different type of roles. We need to create a list of permissions in the system. Also, this list must be updated as the system developed.",
      des2: "List of controllers and methods is a good representation of all permissions in the system. Every route is leading to a method of a controller. So, it's a good idea to make a list of permissions using the routes list.",
      img: loginImg,
      imgAlt: "Login",
    },
    {
      label: "Tasks Management",
      des1: "Managing tasks effectively is crucial in a workflow system. Each task should have clear ownership, priority, and progress tracking to ensure the project moves forward without bottlenecks.",
      des2: "A structured task management module allows users to create, assign, update and monitor tasks in real time. By integrating status tracking, due dates and collaboration tools, the system improves productivity and transparency.",
      img: taskManagementImg,
      imgAlt: "Tasks Management",
    },
    {
      label: "Role Management",
      des1: "In multi-user systems, not every user should have access to the same features. Role management defines what actions each type of user is allowed to perform.",
      des2: "By mapping roles to permissions, the system becomes flexible and scalable. When new features are added, we only update the permission rules instead of modifying user logic directly.",
      img: teamManagementImg,
      imgAlt: "Role Management",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="h-[800px] bg-linear-to-br from-[#6b9bd8] via-[#5ba3a3] to-emerald-500 px-6 py-16"
    >
      <div className="mx-auto max-w-7xl py-20">
        {/* Title */}
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-4xl font-bold text-white">
            Users Authorization & Roles Management
          </h2>
          <p className="text-white/90">Best Feature Available in My-Task App</p>
        </div>

        {/* Tabs */}
        <div className="mb-12 flex justify-center gap-8">
          {tabs.map((tab, index) => (
            <motion.div
              key={index}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              <Button
                variant={activeTab === index ? "primary" : "outline"}
                className={`border-white/30 bg-white/10 text-white hover:bg-white/20`}
                onClick={() => setActiveTab(index)}
              >
                {tab.label}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Content */}
        <div className="grid items-start gap-12 md:grid-cols-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="text-white"
            >
              <h3 className="mb-6 text-3xl font-bold">
                {tabs[activeTab].label}
              </h3>
              <p className="mb-4 text-lg leading-relaxed text-white/90">
                {tabs[activeTab].des1}
              </p>
              <p className="text-lg leading-relaxed text-white/90">
                {tabs[activeTab].des2}
              </p>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex h-full w-full items-center justify-center"
            >
              <img
                src={tabs[activeTab].img}
                alt={tabs[activeTab].imgAlt}
                className="w-full rounded-xl shadow-2xl"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}
