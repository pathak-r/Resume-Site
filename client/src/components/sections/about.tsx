import { motion } from "framer-motion";

const skills = [
  "Product Strategy", "Generative AI", "LLMs & RAG", "Enterprise SaaS", 
  "MLOps Awareness", "Roadmapping", "Stakeholder Mgmt", "Azure PaaS"
];

export default function About() {
  return (
    <section id="about" className="py-32 bg-secondary/30">
      <div className="container px-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Bio Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold font-heading mb-8 text-foreground">About Me</h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed font-medium">
              <p>
                I am an AI-driven Senior Product Manager with over a decade of experience building enterprise SaaS and industrial-tech solutions. My passion lies in translating complex technical capabilities into intuitive products that solve real business problems.
              </p>
              <p>
                Currently, I focus on Agentic AI and RAG systems, helping engineering teams automate workflows and access critical data faster. I believe in responsible AI development—balancing innovation with governance, security, and ethical standards.
              </p>
            </div>

            <div className="mt-12 pt-12 border-t border-border/50">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">Education</h3>
              <div className="space-y-6">
                <div>
                  <div className="text-xl font-bold text-foreground font-heading">M.S. Mechanical Engineering</div>
                  <div className="text-muted-foreground">North Carolina State University</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground font-heading">B.Tech Mechanical Engineering</div>
                  <div className="text-muted-foreground">National Institute of Technology (NIT) Rourkela</div>
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
             <h2 className="text-3xl font-bold font-heading mb-8 text-foreground">Expertise</h2>
             <div className="flex flex-wrap gap-3">
               {skills.map((skill, i) => (
                 <span 
                  key={i} 
                  className="px-6 py-3 bg-white rounded-xl shadow-sm border border-border/50 text-lg font-medium text-foreground hover:shadow-md transition-shadow cursor-default"
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
