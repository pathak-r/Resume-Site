import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

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
    ]
  }
];

export default function Experience() {
  return (
    <section id="experience" className="py-32 bg-background">
      <div className="container px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-foreground">Experience</h2>
        </motion.div>

        <div className="relative border-l-2 border-border ml-3 md:ml-6 space-y-16">
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
              <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-background border-4 border-foreground" />
              
              <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-4 gap-2">
                <h3 className="text-2xl font-bold font-heading text-foreground">{exp.role}</h3>
                <span className="text-sm font-bold text-muted-foreground">{exp.period}</span>
              </div>
              
              <div className="mb-6">
                <div className="text-lg font-bold text-foreground mb-1">{exp.company}</div>
                <div className="text-sm text-muted-foreground">{exp.location}</div>
              </div>

              <p className="text-lg text-foreground mb-4 font-medium">{exp.description}</p>

              <ul className="space-y-2">
                {exp.achievements.map((item, i) => (
                  <li key={i} className="text-muted-foreground flex items-start">
                    <span className="mr-3 text-foreground font-bold">•</span>
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
