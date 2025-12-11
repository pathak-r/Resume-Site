import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    description: "Delivered enterprise-grade AI agents enabling natural-language queries on complex databases, significantly improving access to mission-critical data and accelerating cross-functional decision-making.",
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
    <section id="work" className="pt-40 pb-24 bg-background min-h-screen">
      <div className="container px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20 max-w-3xl"
        >
          <h1 className="text-xl md:text-2xl font-bold font-heading mb-4 text-foreground leading-tight">
            I'm Rohit Pathak, a Senior Product Manager building Enterprise AI solutions.
          </h1>
          <p className="text-muted-foreground text-xl leading-relaxed">
             Based in UAE. Specializing in GenAI copilots, RAG systems, and scalable SaaS platforms.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 max-w-5xl mx-auto">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Card className="bg-white border-none shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden rounded-2xl p-8 relative">
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowUpRight className="w-5 h-5 text-foreground" />
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="secondary" className="rounded-full bg-secondary text-secondary-foreground font-medium px-3 py-1 text-xs">
                      {project.category}
                    </Badge>
                    <span className="text-xs font-bold text-primary uppercase tracking-wide">
                      • {project.impact}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold font-heading text-foreground">
                    {project.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-base leading-relaxed max-w-3xl">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-xs font-medium text-muted-foreground bg-secondary/50 px-2.5 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
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
