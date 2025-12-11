import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-secondary/30">
      <div className="container px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold font-heading mb-6 text-foreground">Get in Touch</h2>
          <p className="text-muted-foreground text-lg mb-10 font-medium">
            I'm actively targeting Senior Product Manager roles across the UAE and GCC. 
            Let's discuss how I can help drive your AI product strategy.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
            <a href="mailto:pathak.a.rohit@gmail.com" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                <Mail className="w-4 h-4 text-foreground" />
              </div>
              <span className="text-lg font-medium text-foreground group-hover:text-muted-foreground transition-colors">Email Me</span>
            </a>
            
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Phone className="w-4 h-4 text-foreground" />
              </div>
              <span className="text-lg font-medium text-foreground">+971 567 874 381</span>
            </div>

            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <MapPin className="w-4 h-4 text-foreground" />
              </div>
              <span className="text-lg font-medium text-foreground">Abu Dhabi, UAE</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
