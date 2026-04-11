import { motion } from "framer-motion";
import { GraduationCap, Award } from "lucide-react";

export default function Education() {
  return (
    <section className="py-12 bg-background">
      <div className="container px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Education */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <GraduationCap className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold font-heading">Education</h2>
            </div>
            
            <div className="space-y-8">
              <div className="border-l-2 border-border pl-6 relative">
                <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-muted-foreground ring-4 ring-background" />
                <h3 className="text-xl font-bold">Master of Science, Mechanical Engineering</h3>
                <p className="text-primary mb-1">North Carolina State University, Raleigh, USA</p>
                <p className="text-sm text-muted-foreground">2011 – 2013 • GPA: 3.57/4.0</p>
              </div>

              <div className="border-l-2 border-border pl-6 relative">
                <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-muted-foreground ring-4 ring-background" />
                <h3 className="text-xl font-bold">Bachelor of Technology, Mechanical Engineering</h3>
                <p className="text-primary mb-1">National Institute of Technology (NIT) Rourkela, India</p>
                <p className="text-sm text-muted-foreground">2005 – 2009 • 7.2/10</p>
              </div>
            </div>
          </motion.div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Award className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold font-heading">Certifications</h2>
            </div>

            <div className="grid gap-4">
              {[
                "LangChain for LLM Application Development",
                "Multi-Agent Systems Certification",
                "Certified Scrum Product Owner (CSPO)"
              ].map((cert, index) => (
                <div key={index} className="p-4 bg-secondary/30 rounded-lg border border-border/50 flex items-center gap-3">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                  <span className="font-medium text-foreground">{cert}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
