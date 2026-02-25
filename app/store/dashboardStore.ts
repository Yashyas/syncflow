import { create } from "zustand/react";

interface DashboardStore {
    //1. Project selection drawer toggle 
    isProjectSelectionDrawerOpen: boolean;
    toggleProjectSelectionDrawer: () => void;

    //2. Project selection for dashboard to load data 
    selectedProject: string | null;
    setSelectedProject: (project: string) => void;

    //3. Add new project drawer toggle
    isAddProjectDrawerOpen: boolean;
    toggleAddProjectDrawer: () => void;

    
}

export const useDashboardStore = create<DashboardStore>((set) => ({
    //1. Project selection drawer toggle
    isProjectSelectionDrawerOpen: true,
    toggleProjectSelectionDrawer: () => set((state) => ({ isProjectSelectionDrawerOpen: !state.isProjectSelectionDrawerOpen })),

    //2. Project selection for dashboard to load data 
    selectedProject: null,
    setSelectedProject: (project: string) => set({ selectedProject: project }),

    //3. Add new project drawer toggle
    isAddProjectDrawerOpen: false,
    toggleAddProjectDrawer: () => set((state) => ({ isAddProjectDrawerOpen: !state.isAddProjectDrawerOpen })),
}));