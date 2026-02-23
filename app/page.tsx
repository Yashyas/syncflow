import Comp from "@/components/comp";
import HeroSection from "@/components/heroSection";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThreeCards } from "@/components/threeCards";


export default function Home() {
  return (
<div>
  <ThemeToggle/>
  <HeroSection/>
  <ThreeCards/>
  <div className="p-4 md:p-8 ">
    <Comp/>
  </div>
  
</div>
  );
}
