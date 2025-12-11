import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Linkedin, Mail } from "lucide-react";
import heroBg from "@assets/generated_images/abstract_dark_tech_mesh_gradient_background.png";

export default function Hero() {
  return (
    <section id="about" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />

      <div className="container relative z-10 px-6 mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full border border-primary/20">
            Senior Product Manager
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading tracking-tight mb-6 leading-tight">
            Building the Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
              Enterprise AI
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            AI-driven Product Leader with 10+ years of experience building enterprise SaaS, 
            GenAI copilots, and RAG systems. Transforming business requirements into 
            scalable platforms.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto text-base h-12 px-8" asChild>
              <a href="#experience">
                View Experience <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-base h-12 px-8" asChild>
              <a href="/assets/Rohit_Pathak_CV.pdf" download>
                Download CV <Download className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-6 text-muted-foreground">
            <a href="mailto:pathak.a.rohit@gmail.com" className="hover:text-primary transition-colors">
              <Mail className="h-6 w-6" />
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
