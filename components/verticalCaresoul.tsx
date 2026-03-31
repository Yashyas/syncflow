"use client" 
import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures"

const carouselData = [
    {
      "id": "add-task",
      "headline": "Full Task Management",
      "image": "/addtask.png",
      "description": "Create, assign, and track tasks with ease. Keep your projects organized with subtasks, deadlines, and real-time status updates so everyone knows exactly what needs to be done."
    },
    {
      "id": "chat",
      "headline": "Contextual Conversations",
      "image": "/chat.png",
      "description": "Never lose track of feedback again. Use the central message hub for high-level project discussions, and dive into task-specific chats to hash out the exact details right where the work happens."
    },
    {
      "id": "ideas",
      "headline": "Shared Ideas Board",
      "image": "/ideas.png",
      "description": "Your shared sandbox for inspiration. Both you and your clients can drop images, text snippets, and URLs into a collaborative moodboard to align on the creative vision effortlessly."
    },
    {
      "id": "share",
      "headline": "Frictionless Client Access",
      "image": "/share.png",
      "description": "Onboard clients in zero clicks. Generate a secure Project ID and password to share your workspace instantly. No forced account creation or lost email invites required."
    },
    {
      "id": "trash",
      "headline": "Project Archive & Trash",
      "image": "/trash.png",
      "description": "Keep your active workspace clutter-free. Safely archive completed tasks or move discarded ideas to the trash, knowing you can easily restore them if the project changes direction."
    }
]

const ComplexCarouselCard: React.FC<{
  headline: string
  imageSrc: string
  description: string
}> = ({ headline, imageSrc, description }) => {
  return (
    <div className="
        border-2 bg-background border-ring p-6 m-4 rounded-lg relative 
        transition-all duration-300 ease-in-out 
        hover:scale-102 hover:shadow-lg hover:border-secondary/50
        max-w-4xl mx-auto
      ">
      <div className="absolute -top-3 left-6 bg-primary px-2 text-background text-lg font-semibold whitespace-nowrap z-10 rounded-2xl">
        {headline}
      </div>

      {/*Image on Left, Description on Right) */}
      <div className="flex  flex-col  md:flex-row  gap-4 pt-3">
        {/* Left Column (Image Block) */}
        <div className="border border-ring rounded-lg  min-h-[300px] flex items-center justify-center relative bg-muted flex-2/3">
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <Image 
              src={imageSrc}
              alt={`Image for ${headline}`} 
              fill
              className="rounded-lg"
              priority={headline === carouselData[0].headline}
            />
          </div>
        </div>

        {/* Right Column (Description Text) */}
        <div className="text-base text-foreground whitespace-pre-wrap leading-relaxed flex-1/3">
          {description}
        </div>
      </div>
    </div>
  )
}

export function VerticalCarousel() {
  const pluginAutoplay = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true }) //
  )
  const pluginWheel = React.useRef(
    WheelGesturesPlugin({
      forceWheelAxis: 'y', 
    })
  )

  return (
    <div className="w-full flex justify-center p-2 bg-background ">
      <Carousel
        opts={{
          align: "start",
          loop: true,
          dragFree: true, 
        }}
        orientation="vertical" 
        plugins={[pluginAutoplay.current, pluginWheel.current]}
        className="w-full max-w-5xl px-4 "
        onMouseEnter={() => pluginAutoplay.current.stop()}
        onMouseLeave={() => pluginAutoplay.current.play()} 
      >
        {/* Top Scroll Button */}
        <CarouselPrevious className="relative top-0 mt-0 mb-4 left-1/2 -translate-x-1/2 z-20 bg-primary hover:bg-secondary" />
        
        <CarouselContent className="-mt-1 h-[70vh] md:h-[50vh]"> 
          {carouselData.map((card) => (
            <CarouselItem key={card.id} className="pt-1 pb-6 md:basis-full lg:basis-full">
              {/* Complex Card Component */}
              <ComplexCarouselCard 
                headline={card.headline}
                imageSrc={card.image}
                description={card.description}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Bottom Scroll Button */}
        <CarouselNext className="relative bottom-0 mt-1 left-1/2 -translate-x-1/2 z-20 bg-primary hover:bg-secondary" />
      </Carousel>
    </div>
  )
}