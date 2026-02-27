import { Project } from "@/lib/generated/prisma/client";
import { create } from "zustand/react";

interface DashboardStore {
    //1. Project selection drawer toggle 
    isProjectSelectionDrawerOpen: boolean;
    toggleProjectSelectionDrawer: () => void;

    //2. Project selection for dashboard to load data 
    selectedProject: Project | null;
    setSelectedProject: (project: Project | null) => void;

    //3. Add new project drawer toggle
    isAddProjectDrawerOpen: boolean;
    toggleAddProjectDrawer: () => void;

    // 4. Delete project drawer toggle 
    isDeleteProjectDrawerOpen: boolean;
    toggleDeleteProjectDrawer: () => void;  

    // 5.Share project drawer toggle 
    isShareProjectDrawerOpen: boolean
    toggleShareProjectDrawer: ()=> void

    // 6.Add Task drawer toggle 
    isAddTaskDrawerOpen: boolean;
    toggleAddTaskDrawer: ()=> void;

    
}

export const useDashboardStore = create<DashboardStore>((set) => ({
    //1. Project selection drawer toggle
    isProjectSelectionDrawerOpen: true,
    toggleProjectSelectionDrawer: () => set((state) => ({ isProjectSelectionDrawerOpen: !state.isProjectSelectionDrawerOpen })),

    //2. Project selection for dashboard to load data 
    selectedProject: null,
    setSelectedProject: (project: Project | null) => set({ selectedProject: project }),

    //3. Add new project drawer toggle
    isAddProjectDrawerOpen: false,
    toggleAddProjectDrawer: () => set((state) => ({ isAddProjectDrawerOpen: !state.isAddProjectDrawerOpen })),

    // 4. Delete project drawer toggle
    isDeleteProjectDrawerOpen: false,
    toggleDeleteProjectDrawer: () => set((state) => ({ isDeleteProjectDrawerOpen: !state.isDeleteProjectDrawerOpen })),

    // 5.Share project drawer toggle 
    isShareProjectDrawerOpen: false,
    toggleShareProjectDrawer:() => set((state)=>({isShareProjectDrawerOpen: !state.isShareProjectDrawerOpen})),

    // 6. Add task drawer toggle 
    isAddTaskDrawerOpen: false,
    toggleAddTaskDrawer: () => set((state)=>
    ({isAddTaskDrawerOpen: !state.isAddTaskDrawerOpen})),
}));