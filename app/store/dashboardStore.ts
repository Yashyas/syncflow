import { Message, Project, Task } from "@/lib/generated/prisma/client";
import { create } from "zustand/react";

export enum CurrentView {
    KANBAN = 'KANBAN',
    CHAT = 'CHAT',
    ACTIVITY = 'ACTIVITY',
}

interface MessageSlice {
  messages: Message[]; 
  isLoading: boolean;  
}

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
    isAddTaskDrawerOpen: boolean
    toggleAddTaskDrawer: ()=> void

    // 7.Tasks array for kanban board 
    tasks: Task[]
    setTasks: (tasks: Task[]) => void
    addTask: (task: Task) => void
    updateTask: (task: Task) => void
    removeTask: (taskId: string) => void
    
     // 8.Add Task drawer toggle 
    isUpdateTaskDrawerOpen: boolean
    toggleUpdateTaskDrawer: ()=> void

    //9. Selected task 
    selectedTask: Task | null;
    setSelectedTask: (task: Task | null) => void;

     // 10.Add Task drawer toggle 
    isDeleteTaskDrawerOpen: boolean
    toggleDeleteTaskDrawer: ()=> void

    //11.Current dashboard view
    currentDashboardView: CurrentView;
    setCurrentDashboardView: (view: CurrentView) => void;

     // 12.Setting drawer toggle 
     isSettingDrawerOpen: boolean
     toggleSettingDrawer: ()=> void

      // ── 13. CHAT SLICE ────────────────────────────────────────────────────────

  taskChats: Record<string, MessageSlice>;
//   initial message set for a task 
  setTaskMessages: (taskId: string, messages: Message[]) => void;
//   new message appended in store 
  appendMessage: (taskId: string, message: Message) => void;
// replace the message with the one that came 
  replaceOptimisticMessage: (taskId: string,optimisticId: string,real: Message
  ) => void;
 
  // removeMessage — used to ROLL BACK an optimistic message if the API call fails.
  removeMessage: (taskId: string, messageId: string) => void;
  // setTaskLoading — toggles the loading spinner for a specific task's chat.
  setTaskLoading: (taskId: string, loading: boolean) => void;

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

      // 7.Tasks array for kanban board 
    tasks: [],
    setTasks: (tasks) => set({tasks}),
    addTask: (task) => set((state)=>({tasks: [task, ...state.tasks]})),
    updateTask: (task) => set((state)=>({
        tasks: state.tasks.map((t) => (t.id === task.id ? task : t)) })),
    removeTask: (taskId) => set((state)=>({
        tasks: state.tasks.filter((t) => t.id !== taskId) })),

     // 8. Add task drawer toggle 
    isUpdateTaskDrawerOpen: false,
    toggleUpdateTaskDrawer: () => set((state)=>
    ({isUpdateTaskDrawerOpen: !state.isUpdateTaskDrawerOpen})),

    //9. Selected task 
    selectedTask: null,
    setSelectedTask: (task: Task | null) => set({ selectedTask: task }),

     // 10. Delete task drawer toggle 
    isDeleteTaskDrawerOpen: false,
    toggleDeleteTaskDrawer: () => set((state)=>
    ({isDeleteTaskDrawerOpen: !state.isDeleteTaskDrawerOpen})),

        //11.Current dashboard view
    currentDashboardView: CurrentView.KANBAN,
    setCurrentDashboardView: (view: CurrentView) => set({currentDashboardView: view}),

    // 12.Setting drawer toggle 
    isSettingDrawerOpen: true,
    toggleSettingDrawer: () => set((state)=>
    ({isSettingDrawerOpen: !state.isSettingDrawerOpen})),

     // ── 13. CHAT SLICE IMPLEMENTATIONS ────────────────────────────────────────

  taskChats: {},
 
  setTaskMessages: (taskId, messages) =>
    set((state) => ({
      taskChats: {
        ...state.taskChats,            
        [taskId]: {messages, isLoading: false },
      },
    })),
 
  // appendMessage
  appendMessage: (taskId, message) =>
    set((state) => ({
      taskChats: {
        ...state.taskChats,
        [taskId]: {
          isLoading: state.taskChats[taskId]?.isLoading ?? false,
          messages: [
            ...(state.taskChats[taskId]?.messages ?? []), // existing messages or empty array
            message,                                       // new message goes at the END
          ],
        },
      },
    })),
 
  replaceOptimisticMessage: (taskId, optimisticId, real) =>
    set((state) => ({
      taskChats: {
        ...state.taskChats,
        [taskId]: {
          isLoading: state.taskChats[taskId]?.isLoading ?? false,
          messages: (state.taskChats[taskId]?.messages ?? []).map(
            (m) => (m.id === optimisticId ? real : m)
          ),
        },
      },
    })),

  removeMessage: (taskId, messageId) =>
    set((state) => ({
      taskChats: {
        ...state.taskChats,
        [taskId]: {
          isLoading: state.taskChats[taskId]?.isLoading ?? false,
          messages: (state.taskChats[taskId]?.messages ?? []).filter(
            (m) => m.id !== messageId
          ),
        },
      },
    })),
 
  setTaskLoading: (taskId, loading) =>
    set((state) => ({
      taskChats: {
        ...state.taskChats,
        [taskId]: {
          messages: state.taskChats[taskId]?.messages ?? [],
          isLoading: loading,
        },
      },
    })),
}));
 