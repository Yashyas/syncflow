"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { MessageSquareText, Minus, Plus } from "lucide-react"
import ClientChat from "./clientChat"


export function MessageDrawer({ children }: { children: React.ReactNode }) {

  return (
    <Drawer direction="right" >
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent>
            <ClientChat/>
      </DrawerContent>
    </Drawer>
  )
}
