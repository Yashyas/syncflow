import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Activity, InboxIcon, ListCheck, MessageCircle } from "lucide-react"

export function ThreeCards() {
  return (
    <div className="flex w-full md:h-[30vh]  flex-col md:flex-row gap-8 p-4 justify-center">
      <Item variant="outline" className="shadow-2xl h-[20vh] bg-card ">
        <ItemMedia variant="icon" className="bg-primary text-background">
          <ListCheck/>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Kanban View</ItemTitle>
          <ItemDescription>
            Easy Tasks management through a Kanban Board.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline" className="shadow-2xl h-[20vh] bg-card">
        <ItemMedia variant="icon" className="bg-primary text-background">
          <Activity/>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Activity Tracking</ItemTitle>
          <ItemDescription>
            Real-time updates of task status and messages.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline" className="shadow-2xl h-[20vh] bg-card">
        <ItemMedia variant="icon" className="bg-primary text-background">
          <MessageCircle/>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Real-time Chat</ItemTitle>
          <ItemDescription>
            Real-time chats for whole project and task specific.
          </ItemDescription>
        </ItemContent>
      </Item>
      
    </div>
  )
}
