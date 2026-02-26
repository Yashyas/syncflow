import { TaskStatus } from "@/lib/generated/prisma/enums";

export const COLUMNS: {id: TaskStatus;label:string}[] =[
    {id: 'pending', label:'Pending'},
    {id: 'in_progress', label: 'In Progress'},
    {id: 'for_verification', label: 'For Review'},
    {id: 'completed', label: 'Completed'},
    // {id: 'scraped', label: 'Scraped'},
    
]