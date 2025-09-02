import Hero from "@/components/sections/Hero";
import LogoMarquee from "@/components/sections/LogoMarquee";
import { WasteClassifier } from "@/components/WasteClassifier";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <Hero />
      <LogoMarquee />
      <div className="container mx-auto py-12">
        <WasteClassifier />
      </div>
    </div>
  );
};

export default Index;
