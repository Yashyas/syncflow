import Image from "next/image";
import dashboard from "../public/dashboard.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function HeroSection() {
    return (
        <div className="flex lg:flex-row flex-col justify-around">

            <div className=" flex flex-col justify-center p-8 gap-4 flex-1 w-full min-h-[50vh]">
                <h2 className="text-4xl md:text-6xl">The Transparent Link Between You and Your Client.</h2>
                <p className="text-sm md:text-xl">Real-time messaging + Task visibility for freelancers. No more email threads.</p>
                <div className="flex gap-4">
                    <Link href="/api/auth/login"><Button className="shadow-xl w-28">Developer</Button></Link>
                    <Link href="/client"><Button className="shadow-xl w-28">Client</Button></Link>
                </div>
                <p className="text-xs md:text-sm">Used by independent developers & designers.</p>
            </div>
            <div className=" flex-1 w-full min-h-[50vh] p-4 lg:p-12 position-relative">
                <Image
                    src={dashboard}
                    alt="SyncFlow Hero Image"
                    priority
                    className="w-full h-auto shadow-2xl rounded-2xl"

                />
            </div>
        </div>
    )
}
