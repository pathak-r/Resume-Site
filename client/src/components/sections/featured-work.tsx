import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Focusing on "Products/Projects" rather than "Job Titles"
const projects = [
  {
    title: "Enterprise AI Copilot System",
    category: "Generative AI Product",
    impact: "3x Faster Engineering Workflows",
    description: "Led the strategy and development of an LLM-based agentic system designed to automate complex 3D engineering workflows. This product transformed how global engineering teams operate, saving hundreds of hours monthly.",
    tags: ["LLM Agents", "Product Strategy", "3D Engineering", "Automation"]
  },
  {
    title: "Secure RAG Intelligence Platform",
    category: "Knowledge Management",
    impact: "40% Support Ticket Deflection",
    description: "Launched a production-ready RAG assistant trained on proprietary knowledge bases. This allowed users to query mission-critical data in natural language, significantly reducing support load and improving operational efficiency.",
    tags: ["RAG", "Data Privacy", "Enterprise Search", "Customer Success"]
  },
  {
    title: "AI ROI & Telemetry Framework",
    category: "Analytics & Strategy",
    impact: "Quantifiable Business Value",
    description: "Designed a comprehensive framework to measure the actual business impact of AI features. Defined KPIs for time savings and user adoption, enabling data-driven roadmap decisions across multiple business units.",
    tags: ["Product Analytics", "ROI Modeling", "Strategic Planning"]
  }
];

export default function FeaturedWork() {
  return (
    <section id="work" className="py-32 border-t border-border">
      <div className="container px-6 mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">Selected Work</h2>
            <p className="text-muted-foreground text-lg max-w-md">
              Transforming complex enterprise requirements into scalable, high-impact AI products.
            </p>
          </motion.div>
          
          <motion.div
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
          >
             <a href="/assets/Rohit_Pathak_CV.pdf" download className="group flex items-center gap-2 text-foreground border-b border-transparent hover:border-foreground transition-all pb-1">
               View Full Resume <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
             </a>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Card className="bg-transparent border border-border hover:border-white/20 transition-colors duration-500 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {/* Content Side */}
                  <div className="lg:col-span-8 p-8 md:p-12 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <Badge variant="outline" className="rounded-none border-primary/20 text-primary/80 uppercase tracking-wider text-xs px-3 py-1">
                          {project.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground font-mono">
                          // {project.impact}
                        </span>
                      </div>
                      
                      <h3 className="text-3xl font-bold mb-6 group-hover:text-white transition-colors">
                        {project.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl">
                        {project.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-xs font-mono text-muted-foreground border border-border px-3 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Visual Side (Abstract Representation) */}
                  <div className="lg:col-span-4 bg-secondary/20 border-t lg:border-t-0 lg:border-l border-border min-h-[200px] flex items-center justify-center relative overflow-hidden">
                     <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                     <ArrowUpRight className="w-16 h-16 text-muted-foreground/20 group-hover:text-white group-hover:scale-110 transition-all duration-500" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
