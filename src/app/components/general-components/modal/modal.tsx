import Button from "@libs/app/components/general-components/button";
import { ReactNode, useRef, useState, useEffect } from "react";
import { LuX } from "react-icons/lu";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, AlertTriangle, Info } from "lucide-react";

interface BaseModalProps {
  title: string;
  buttonContent: string;
  isLoadingButton?: boolean;
  isSubmitDisabled?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  children: ReactNode;
  className?: string;
  style?: {
    textColor?: string;
    confirmButtonColor?: string;
  };
  variant?: "success" | "warning" | "info" | "default";
}

export default function Modal({
  title,
  buttonContent = "Accept",
  onClose,
  isLoadingButton,
  isSubmitDisabled,
  onSubmit,
  children,
  className,
  style,
  variant = "default",
}: BaseModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [canScroll, setCanScroll] = useState(false);

  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-600" />,
          bg: "bg-green-100",
          text: "text-green-700",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
          bg: "bg-yellow-100",
          text: "text-yellow-700",
        };
      case "info":
        return {
          icon: <Info className="h-5 w-5 text-blue-600" />,
          bg: "bg-blue-100",
          text: "text-blue-700",
        };
      default:
        return {
          icon: null,
          bg: "bg-gray-100",
          text: "text-gray-800",
        };
    }
  };

  const variantStyles = getVariantStyles();

  const handleScroll = () => {
    if (!modalRef.current) return;
    const { scrollTop } = modalRef.current;
    setHasScrolled(scrollTop > 0);
  };

  useEffect(() => {
    const el = modalRef.current;
    if (el) {
      setCanScroll(el.scrollHeight > el.clientHeight);
    }
  }, [children]);

  return (
    <div
      id="modal"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <AnimatePresence>
        <motion.div
          initial={{ y: 20, opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
          className={`animate-fade-in max-h-[80vh] min-w-[500px] rounded-lg bg-white py-6 shadow-xl ${className}`}
        >
          {/* Title Bar */}
          <div
            className={`mb-4 flex items-center justify-between px-6 transition-all`}
          >
            <div className="flex items-center gap-2">
              {variantStyles.icon && (
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${variantStyles.bg}`}
                >
                  {variantStyles.icon}
                </span>
              )}
              <h2
                className={`text-xl font-bold tracking-tight ${
                  style?.textColor || variantStyles.text
                }`}
              >
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 transition-colors hover:text-gray-600 focus:outline-none"
            >
              <LuX className="h-6 w-6 cursor-pointer" />
            </button>
          </div>

          {/* Scrollable content */}
          <div
            ref={modalRef}
            onScroll={handleScroll}
            className={`max-h-[65vh] overflow-auto px-6 ${
              canScroll
                ? hasScrolled
                  ? "border-gray-200 shadow-sm"
                  : "border-transparent"
                : ""
            } `}
          >
            {children}
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end space-x-3 px-6">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none"
            >
              Cancel
            </button>
            <Button
              isLoading={isLoadingButton}
              onClick={onSubmit}
              disabled={isSubmitDisabled}
              className={`cursor-pointer rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${style?.confirmButtonColor}`}
            >
              {buttonContent}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
