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
  /** When true, only the overlay and animated shell are rendered; children supply full chrome (header/footer). */
  bare?: boolean;
  style?: {
    textColor?: string;
    confirmButtonColor?: string;
    confirmButtonVariant?: any;
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
  bare = false,
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
          icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
          bg: "bg-red-50",
          text: "text-red-600",
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

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
          className={
            bare
              ? `animate-fade-in flex max-h-[90vh] flex-col overflow-hidden ${className ?? ""}`
              : `animate-fade-in flex max-h-[90vh] min-w-[500px] flex-col rounded-lg bg-white py-6 shadow-xl ${className ?? ""}`
          }
        >
          {bare ? (
            children
          ) : (
            <>
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
                    className={`text-xl font-bold tracking-tight ${style?.textColor || variantStyles.text
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
                className={`flex-1 overflow-y-auto overscroll-contain px-6 ${canScroll
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
                  variant={style?.confirmButtonVariant || "primary"}
                  className={`rounded-md px-6 py-2 ${style?.confirmButtonColor || ""}`}
                >
                  {buttonContent}
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
