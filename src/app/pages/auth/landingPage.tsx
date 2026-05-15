import { AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import StickyHeader from "@libs/app/components/landing/StickyHeader";
import Hero from "@libs/app/components/landing/Hero";
import AppsGrid from "@libs/app/components/landing/AppsGrid";
import FeaturesList from "@libs/app/components/landing/FeaturesList";
import WhyChoose from "@libs/app/components/landing/WhyChoose";
import AuthRoles from "@libs/app/components/landing/AuthRoles";
import Footer from "@libs/app/components/landing/Footer";
import Button from "@libs/app/components/general-components/button";
import { useNavigate } from "react-router-dom";
import logo from "@libs/assets/taskflow.png";
import Image from "@libs/app/components/general-components/image";
export default function Home() {
  const [onScroll, setOnScroll] = useState(false);
  const navigate = useNavigate();

  // Refs cho từng section
  const heroRef = useRef<HTMLDivElement | null>(null);
  const appsRef = useRef<HTMLDivElement | null>(null);
  const featuresRef = useRef<HTMLDivElement | null>(null);
  const whyChooseRef = useRef<HTMLDivElement | null>(null);
  const authRolesRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setOnScroll(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hàm scroll đến đúng section (có bù trừ chiều cao header cố định)

  return (
    <AnimatePresence>
      <div className="min-h-screen">
        <div className="fixed top-0 left-0 z-50 w-full">
          <div className="flex w-full items-center justify-between bg-[#002117] p-4">
            <div className="py-0.5">
              <Image src={logo} className="h-9 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigate("/auth/login")}
                className="bg-[#064e3b] px-6 text-white hover:bg-[#0b513d]"
                title="Login"
              >
                Login
              </Button>
              <Button
                onClick={() => navigate("/auth/register")}
                className="bg-[#064e3b] px-6 text-white hover:bg-[#0b513d]"
                title="Register"
              >
                Register
              </Button>
            </div>
          </div>
        </div>
        <div className="relative pt-18">
          <StickyHeader isShow={onScroll} />
          <div id="hero" ref={heroRef} className="scroll-mt-24">
            <Hero showTopNav={onScroll} />
          </div>
          <div id="apps" ref={appsRef} className="scroll-mt-24">
            <AppsGrid />
          </div>
          <div id="features" ref={featuresRef} className="scroll-mt-24">
            <FeaturesList />
          </div>
          <div id="why" ref={whyChooseRef} className="scroll-mt-24">
            <WhyChoose />
          </div>
          <div id="auth" ref={authRolesRef} className="scroll-mt-24">
            <AuthRoles />
          </div>
          <div id="footer" ref={footerRef} className="scroll-mt-24">
            <Footer />
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
