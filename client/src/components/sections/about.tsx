import { motion } from "framer-motion";

const skills = [
  "Product Strategy", "Generative AI", "LLMs & RAG", "Enterprise SaaS", 
  "MLOps Awareness", "Roadmapping", "Stakeholder Mgmt", "Azure PaaS"
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-secondary/30">
      <div className="container px-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Bio Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold font-heading mb-6 text-foreground">About Me</h2>
            <div className="space-y-4 text-base text-muted-foreground leading-relaxed font-medium">
              <p>
                I am an AI-driven Senior Product Manager with over a decade of experience building enterprise SaaS and industrial-tech solutions. My passion lies in translating complex technical capabilities into intuitive products that solve real business problems.
              </p>
              <p>
                Currently, I focus on Agentic AI and RAG systems, helping engineering teams automate workflows and access critical data faster. I believe in responsible AI development, balancing innovation with governance, security, and ethical standards.
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-border/50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Education</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-lg font-bold text-foreground font-heading">M.S. Mechanical Engineering</div>
                  <div className="text-sm text-muted-foreground">North Carolina State University</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-foreground font-heading">B.Tech Mechanical Engineering</div>
                  <div className="text-sm text-muted-foreground">National Institute of Technology (NIT) Rourkela</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Skills Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
             <h2 className="text-3xl font-bold font-heading mb-6 text-foreground">Expertise</h2>
             <div className="flex flex-wrap gap-2">
               {skills.map((skill, i) => (
                 <span 
                  key={i} 
                  className="px-4 py-2 bg-white rounded-lg shadow-sm border border-border/50 text-base font-medium text-foreground hover:shadow-md transition-shadow cursor-default"
                >
                   {skill}
                 </span>
               ))}
             </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
