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
    <section id="contact" className="py-24 bg-secondary/20">
      <div className="container px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16"
        >
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">Get in Touch</h2>
            <p className="text-muted-foreground text-lg mb-10">
              I'm actively targeting Senior Product Manager roles across the UAE and GCC. 
              Let's discuss how I can help drive your AI product strategy.
            </p>

            <div className="space-y-6">
              <a href="mailto:pathak.a.rohit@gmail.com" className="flex items-center gap-4 text-foreground hover:text-primary transition-colors p-4 bg-background rounded-lg border border-border/50">
                <Mail className="w-6 h-6 text-primary" />
                <span className="text-lg">pathak.a.rohit@gmail.com</span>
              </a>
              
              <div className="flex items-center gap-4 text-foreground p-4 bg-background rounded-lg border border-border/50">
                <Phone className="w-6 h-6 text-primary" />
                <span className="text-lg">+971 567 874 381</span>
              </div>

              <div className="flex items-center gap-4 text-foreground p-4 bg-background rounded-lg border border-border/50">
                <MapPin className="w-6 h-6 text-primary" />
                <span className="text-lg">Abu Dhabi, United Arab Emirates</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-background p-8 rounded-2xl border border-border/50 shadow-lg">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} className="bg-secondary/20" />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} className="bg-secondary/20" />
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
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="How can I help you?" 
                          className="min-h-[120px] bg-secondary/20" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full text-base py-6">
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
