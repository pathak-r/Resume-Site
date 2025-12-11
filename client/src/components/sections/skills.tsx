import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Code, Globe, Layout, Shield, Users } from "lucide-react";

const skillCategories = [
  {
    title: "Product Strategy",
    icon: <Globe className="w-6 h-6 text-primary" />,
    skills: ["Roadmapping", "Prioritization", "Go-to-Market", "Stakeholder Management", "Workshops", "ROI Tracking"]
  },
  {
    title: "AI & Machine Learning",
    icon: <Brain className="w-6 h-6 text-primary" />,
    skills: ["Generative AI", "LLMs", "RAG Systems", "Agentic Systems", "MLOps Awareness", "Responsible AI"]
  },
  {
    title: "Technical & SaaS",
    icon: <Code className="w-6 h-6 text-primary" />,
    skills: ["Enterprise SaaS", "Azure PaaS", "Governance", "Security & Compliance", "Telemetry Integration", "Full Product Lifecycle"]
  },
  {
    title: "Leadership",
    icon: <Users className="w-6 h-6 text-primary" />,
    skills: ["Cross-Functional Leadership", "Engineering Collaboration", "Agile/Scrum", "Customer Discovery", "Team Mentorship"]
  }
];

export default function Skills() {
  return (
    <section id="skills" className="py-24 bg-secondary/20">
      <div className="container px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Core Competencies</h2>
          <div className="h-1 w-20 bg-primary rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-bold font-heading">{category.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <Badge 
                        key={skill} 
                        variant="secondary" 
                        className="bg-background/50 hover:bg-primary/20 hover:text-primary transition-colors py-1.5 px-3 text-sm font-normal"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
