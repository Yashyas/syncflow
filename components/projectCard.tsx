import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

export default function ProjectCard(project: { title: string , client: string , description: string }) {
  return (
    <Card className='cursor-pointer w-full h-full hover:bg-secondary/60 '>
        <CardHeader>
            <CardTitle>{project.title}</CardTitle>
            <CardDescription className='text-primary font-bold'>Client:{project.client}</CardDescription>
        </CardHeader>
        <CardContent>
            <p>{project.description}</p>
        </CardContent>
    </Card>
  )
}
