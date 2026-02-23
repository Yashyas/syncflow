import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { InboxIcon } from "lucide-react"

export function ThreeCards() {
  return (
    <div className="flex w-full md:h-[30vh]  flex-col md:flex-row gap-8 p-4 justify-center">
      <Item variant="outline" className="shadow-2xl h-[20vh] bg-card ">
        <ItemMedia variant="icon">
          <InboxIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Kanban View</ItemTitle>
          <ItemDescription>
            Real-time messaging + Task visibility for freelancers. No more email thread.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline" className="shadow-2xl h-[20vh] bg-card">
        <ItemMedia variant="icon">
          <InboxIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Contextual Comments</ItemTitle>
          <ItemDescription>
            Real-time messaging + visibility for contextual comments.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline" className="shadow-2xl h-[20vh] bg-card">
        <ItemMedia variant="icon">
          <InboxIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Real-time Chat</ItemTitle>
          <ItemDescription>
            Enable-time chats and real-time chat messages and reactions.
          </ItemDescription>
        </ItemContent>
      </Item>
      
    </div>
  )
}
