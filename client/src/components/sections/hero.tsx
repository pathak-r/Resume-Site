import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroBg from "@assets/generated_images/minimalist_dark_noise_grain_texture.png";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background Texture */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-30 mix-blend-overlay"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      <div className="container relative z-10 px-6 mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-heading tracking-tight mb-8 leading-[0.9]">
            Product Strategy <br />
            <span className="text-muted-foreground">meets</span> Enterprise AI.
          </h1>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-l border-white/20 pl-8 md:pl-12 mt-12">
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              I help organizations bridge the gap between complex AI capabilities and real-world business value. 
              Specializing in GenAI copilots, RAG systems, and scalable SaaS platforms.
            </p>

            <div className="flex flex-col gap-4 min-w-[200px]">
              <div className="text-sm font-mono text-muted-foreground mb-1">CURRENTLY</div>
              <div className="text-lg font-medium">Senior Product Manager</div>
              <div className="text-sm text-muted-foreground">Hexagon AB</div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-16 flex items-center gap-6"
          >
            <Button 
              variant="outline" 
              className="rounded-none border-white/20 h-14 px-8 text-base hover:bg-white hover:text-black transition-all"
              asChild
            >
              <a href="#work">
                View Selected Work <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-12 right-12 hidden md:block"
      >
        <div className="h-24 w-[1px] bg-gradient-to-b from-transparent via-white/50 to-transparent" />
      </motion.div>
    </section>
  );
}
