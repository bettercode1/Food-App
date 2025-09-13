import { useState, createContext, useContext } from 'react';

type ViewMode = 'user' | 'manager';

interface ViewModeContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
}

export function useViewModeState() {
  const [viewMode, setViewMode] = useState<ViewMode>('user');

  return {
    viewMode,
    setViewMode
  };
}

export { ViewModeContext };