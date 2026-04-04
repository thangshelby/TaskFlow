import { Navigate, Outlet, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { useAuthStore } from "@libs/store/useAuthStore";
import { BarChart3, FileBarChart, Kanban, Network } from "lucide-react";
import authBackground from "@libs/assets/images/auth_background.png";

export default function AuthLayout() {
  const pathname = useLocation().pathname;
  const isLogin = pathname === "/auth/login";

  const { user } = useAuthStore();

  if (user) {
    return <Navigate to="/" />;
  }
  return (
    <div
      className={`relative flex h-screen items-center overflow-hidden bg-gray-50 ${isLogin ? "md:flex-row-reverse" : ""}`}
    >
      {/* Form column */}
      <motion.div
        layout
        className="w-full flex-1"
      >
        <motion.div
          key={pathname}
          initial={{ opacity: 0.5, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08, duration: 0.35 }}
          className="flex h-full w-full items-center justify-center"
        >
          <Outlet />
        </motion.div>
      </motion.div>
      {/* Branding column */}
      <motion.div
        layout
        className="hidden h-full w-full md:block md:max-w-[60%]"
      >
        <section className="relative h-full flex-1 overflow-hidden bg-emerald-950 md:flex">
          <div className="absolute inset-0 z-0">
            <img
              alt="Engineering workspace"
              className="h-full w-full object-cover opacity-20 grayscale"
              src={authBackground}
            />
            <div className="absolute inset-0 bg-linear-to-br from-emerald-950 to-emerald-800 mix-blend-multiply opacity-90" />
            <div className="absolute inset-0 bg-linear-to-t from-emerald-950 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 w-full px-12 lg:px-24">
            <div className="flex min-h-full flex-col justify-center">
              <div className="max-w-xl">
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-emerald-50/10 px-3 py-1">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-200 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-200" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-100">
                    System Status: Operational
                  </span>
                </div>

                <h2 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white lg:text-6xl">
                  Engineered for <br />
                  <span className="text-emerald-200/90 [text-shadow:0_0_24px_rgba(167,243,208,0.18)]">
                    Precision Output.
                  </span>
                </h2>
                <p className="mb-12 max-w-lg text-lg leading-relaxed text-emerald-100/80">
                  Welcome to TaskFlow, the high-density environment where engineering teams orchestrate complex
                  technical roadmaps with surgical precision.
                </p>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all hover:bg-white/10">
                    <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-emerald-200/15 text-emerald-100">
                      <BarChart3 className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Track Work</h3>
                      <p className="text-sm leading-snug text-emerald-100/70">
                        Visualise dependencies with real-time Gantt synchronization.
                      </p>
                    </div>
                  </div>

                  <div className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all hover:bg-white/10">
                    <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-emerald-200/15 text-emerald-100">
                      <Network className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Team Efficiency</h3>
                      <p className="text-sm leading-snug text-emerald-100/70">
                        Optimize allocation based on historical throughput data.
                      </p>
                    </div>
                  </div>

                  <div className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all hover:bg-white/10">
                    <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-emerald-200/15 text-emerald-100">
                      <FileBarChart className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Detailed Reports</h3>
                      <p className="text-sm leading-snug text-emerald-100/70">
                        Auto-generated sprint post-mortems and velocity charts.
                      </p>
                    </div>
                  </div>

                  <div className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all hover:bg-white/10">
                    <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-emerald-200/15 text-emerald-100">
                      <Kanban className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Unified Boards</h3>
                      <p className="text-sm leading-snug text-emerald-100/70">
                        Kanban columns and backlog in one flow with smooth status handoffs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </section>
      </motion.div>
    </div>
  );
}
