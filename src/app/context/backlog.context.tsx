import React, { createContext, useContext, useState, ReactNode } from "react";

interface BacklogContextType {
  overItemId: string | null;
  setOverItemId: (id: string | null) => void;

  scrumSprintSize: {
    width: number;
    height: number;
  };
  setScrumSprintSize: (size: { width: number; height: number }) => void;

  issueCardSize: {
    width: number;
    height: number;
  };
  setIssueCardSize: (size: { width: number; height: number }) => void;

  scrollTop: number;
  setScrollTop: (scrollTop: number) => void;

  editingIssueId: string | null;
  setEditingIssueId: (id: string | null) => void;
}

const BacklogContext = createContext<BacklogContextType | undefined>(undefined);

export const useOverItem = () => {
  const context = useContext(BacklogContext);
  if (context === undefined) {
    throw new Error("useOverItem must be used within an OverItemProvider");
  }
  return context;
};

export const useScrumSprintSize = () => {
  const context = useContext(BacklogContext);
  if (context === undefined) {
    throw new Error(
      "useScrumSprintSize must be used within an ScrumSprintSizeProvider",
    );
  }
  return context;
};

export const useIssueCardSize = () => {
  const context = useContext(BacklogContext);
  if (context === undefined) {
    throw new Error(
      "useIssueCardSize must be used within an IssueCardSizeProvider",
    );
  }
  return context;
};

export const useScrollTop = () => {
  const context = useContext(BacklogContext);
  if (context === undefined) {
    throw new Error("useScrollTop must be used within an ScrollTopProvider");
  }
  return context;
};

export const useEditingIssue = () => {
  const context = useContext(BacklogContext);
  if (context === undefined) {
    throw new Error("useEditingIssue must be used within a BacklogProvider");
  }
  return context;
};

interface BacklogProviderProps {
  children: ReactNode;
}

export const BacklogProvider: React.FC<BacklogProviderProps> = ({
  children,
}) => {
  const [overItemId, setOverItemId] = useState<string | null>(null);
  const [scrumSprintSize, setScrumSprintSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const [issueCardSize, setIssueCardSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const [scrollTop, setScrollTop] = useState(0);
  const [editingIssueId, setEditingIssueId] = useState<string | null>(null);

  return (
    <BacklogContext.Provider
      value={{
        overItemId,
        setOverItemId,
        scrumSprintSize,
        setScrumSprintSize,
        issueCardSize,
        setIssueCardSize,
        scrollTop,
        setScrollTop,
        editingIssueId,
        setEditingIssueId,
      }}
    >
      {children}
    </BacklogContext.Provider>
  );
};
