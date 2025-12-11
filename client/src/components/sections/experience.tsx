import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const experiences = [
  {
    company: "Hexagon AB",
    role: "Senior Product Manager",
    period: "Jan 2023 – Present",
    location: "Abu Dhabi, UAE",
    description: "Leading end-to-end strategy for AI product innovation, building and scaling LLM-based agentic systems.",
    achievements: [
      "Led strategy for AI copilots, achieving 3x faster execution for engineering workflows.",
      "Delivered enterprise-grade AI agents for complex database queries.",
      "Launched secure RAG assistant deflecting 40% of support tickets.",
      "Defined operationalized product telemetry & ROI measurement KPIs.",
      "Championed Responsible AI standards and governance."
    ]
  },
  {
    company: "Hexagon AB",
    role: "Product Manager",
    period: "Sep 2018 – Dec 2022",
    location: "Abu Dhabi, UAE",
    description: "Managed product lifecycle and delivered high-impact AI MVPs.",
    achievements: [
      "Delivered two high-impact AI MVPs within 12 months.",
      "Led 100+ executive stakeholder and customer discovery workshops.",
      "Recognized with 'Voice of the Customer' award for productivity gains.",
      "Implemented AI use-case prioritization frameworks."
    ]
  },
  {
    company: "Hexagon AB",
    role: "Support Analyst",
    period: "Sep 2013 – Sep 2018",
    location: "Huntsville, Alabama",
    description: "Led support for mission-critical enterprise deployments.",
    achievements: [
      "Reduced engineering effort by 80% via SDK-driven automation scripts.",
      "Authored Knowledge Base documentation reducing resolution time by 25%.",
      "Promoted to Product Manager for consistent delivery excellence."
    ]
  }
];

export default function Experience() {
  return (
    <section id="experience" className="py-24 bg-background">
      <div className="container px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Work Experience</h2>
          <div className="h-1 w-20 bg-primary rounded-full" />
        </motion.div>

        <div className="relative border-l border-border/50 ml-3 md:ml-6 space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8 md:pl-12"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background" />
              
              <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-2">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{exp.role}</h3>
                  <p className="text-primary font-medium">{exp.company}</p>
                </div>
                <div className="text-sm text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full w-fit">
                  {exp.period} • {exp.location}
                </div>
              </div>

              <p className="text-muted-foreground mb-4">{exp.description}</p>

              <ul className="space-y-2 mb-6">
                {exp.achievements.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start">
                    <span className="mr-2 text-primary">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
