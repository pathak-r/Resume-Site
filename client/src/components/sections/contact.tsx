import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Linkedin } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Message Sent",
      description: "Thanks for reaching out! I'll get back to you soon.",
    });
    form.reset();
  }

  return (
    <section id="contact" className="py-32 bg-secondary/30">
      <div className="container px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-20"
        >
          {/* Contact Info */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-8 text-foreground">Get in Touch</h2>
            <p className="text-muted-foreground text-lg mb-12 font-medium">
              I'm actively targeting Senior Product Manager roles across the UAE and GCC. 
              Let's discuss how I can help drive your AI product strategy.
            </p>

            <div className="space-y-8">
              <a href="mailto:pathak.a.rohit@gmail.com" className="flex items-center gap-6 group">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                  <Mail className="w-5 h-5 text-foreground" />
                </div>
                <span className="text-xl font-medium text-foreground group-hover:text-muted-foreground transition-colors">pathak.a.rohit@gmail.com</span>
              </a>
              
              <div className="flex items-center gap-6">
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Phone className="w-5 h-5 text-foreground" />
                </div>
                <span className="text-xl font-medium text-foreground">+971 567 874 381</span>
              </div>

              <div className="flex items-center gap-6">
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <MapPin className="w-5 h-5 text-foreground" />
                </div>
                <span className="text-xl font-medium text-foreground">Abu Dhabi, United Arab Emirates</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-border/50">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-bold text-foreground">Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} className="h-12 bg-secondary/30 border-transparent focus:bg-white transition-colors" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-bold text-foreground">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} className="h-12 bg-secondary/30 border-transparent focus:bg-white transition-colors" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-bold text-foreground">Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="How can I help you?" 
                          className="min-h-[140px] bg-secondary/30 border-transparent focus:bg-white transition-colors resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full h-14 text-lg rounded-full mt-4">
                  Send Message
                </Button>
              </form>
            </Form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
