import Comp from "@/components/comp";
import HeroSection from "@/components/heroSection";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThreeCards } from "@/components/threeCards";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function Home() {
  const session = await getServerSession(authOptions)
      if (session) {
        redirect("/dashboard")
      }
  return (
<div>
  
  
  <HeroSection/>
  <ThreeCards/>
  <div className="p-4 md:p-8 ">
    <Comp/>
  </div>
  
</div>
  );
}
