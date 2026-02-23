import Image from 'next/image'
import heroImage from '../public/hero.png'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'

export default function Comp() {
  return (
    <div className='flex flex-col md:flex-row justify-center items-stretch rounded-xl border-1 '>
      <div className='flex flex-1 justify-center'>
        <Image
        src={heroImage} 
        alt='syncflow hero img'
        priority
        className='md:rounded-l-xl md:rounded-t-none rounded-t-xl object-cover'
        />
      </div>
      <div className='flex flex-1 md:p-8 lg:p-16'>
         <Card className="flex flex-col justify-between w-full h-full shadow-2xl rounded-t-none md:rounded-xl">
                        <CardHeader>
                            <CardTitle className='text-2xl'>One-Link Transparency</CardTitle>
                            <CardDescription className='text-xl'>Stop the "Update?" emails.</CardDescription>
                            
                        </CardHeader>
                        <CardContent>
                            <p>Give your clients a live, read-only link to their project board. They see progress in real-time, you stay in your flow. No login required for them—just pure clarity for you.</p>

                        </CardContent>
                        <CardFooter>
                            <CardAction><Button>Get Started</Button></CardAction>
                        </CardFooter>
                        
                    </Card>
      </div>
    </div>
  )
}
