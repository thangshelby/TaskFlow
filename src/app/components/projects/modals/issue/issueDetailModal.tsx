import React, { Suspense, useEffect } from "react";
const IssueDetail = React.lazy(() => import("../../../issues/IssueDetail"));
import { useIssueStore } from "@libs/store/useIssueStore";
import ModalPortal from "../../../general-components/modal/modalPortal";
import { motion, AnimatePresence } from "motion/react";
import IssueDetailSkeleton from "../../../skeleton/issueDetailSkeleton";

const IssueDetailModal = () => {
  const { closeIssueDetail } = useIssueStore();

  const selectedIssueId = useIssueStore((s) => s.selectedIssueId);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeIssueDetail();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeIssueDetail();
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
    <ModalPortal>
      {selectedIssueId ? (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/60"
          onClick={handleBackdropClick}
        >
          <AnimatePresence>
            <motion.div
              initial={{
                x: 0,
                y: 20,
                opacity: 0.8,
              }}
              transition={{
                type: "tween",
                duration: 0.01,
                ease: "easeOut",
              }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              exit={{ x: 0, y: 50, opacity: 0 }}
              className="flex h-[80%] min-h-[400px] w-[70%] min-w-[600px] items-center justify-center overflow-hidden rounded-md transition-all duration-300"
            >
              <Suspense fallback={<IssueDetailSkeleton />}>
                <IssueDetail selectedIssueId={selectedIssueId} />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : null}
    </ModalPortal>
  );
};

export default IssueDetailModal;
