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


export function MessageDrawer() {

  return (
    <Drawer direction="right" >
      <DrawerTrigger asChild>
        <MessageSquareText/>
      </DrawerTrigger>
      <DrawerContent>
            <ClientChat/>
      </DrawerContent>
    </Drawer>
  )
}
