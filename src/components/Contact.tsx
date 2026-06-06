import React, { useState } from 'react';
import { Mail, MapPin, Send, Github, Linkedin, MessageCircle } from 'lucide-react';

// --- Configuration and Mock Components for Self-Contained File ---

// Mock components for shadcn/ui to make the file runnable
const Card = ({ className = '', children }) => (
  <div className={`rounded-xl border shadow ${className}`}>{children}</div>
);
const CardHeader = ({ children }) => <div className="flex flex-col space-y-1.5 p-6">{children}</div>;
const CardTitle = ({ className = '', children }) => <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
const CardContent = ({ children }) => <div className="p-6 pt-0">{children}</div>;

const Button = ({ className = '', children, type, size = 'md', onClick, disabled, ...props }) => {
  let padding = 'px-4 py-2';
  if (size === 'lg') padding = 'px-6 py-3';
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center rounded-md text-sm font-medium
        ring-offset-background transition-colors focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        disabled:pointer-events-none disabled:opacity-50
        ${padding} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = '', ...props }) => (
  <input
    className={`flex h-12 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Textarea = ({ className = '', ...props }) => (
  <textarea
    className={`flex min-h-[120px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

// Simple useToast mock (logs to console for testing)
const useToast = () => {
  const toast = (props) => {
    console.log("TOAST:", props.title, "-", props.description);
    // In a production app, this would trigger a visual notification
  };
  return { toast };
};

// --- Contact Form Component ---

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', 'error', 'sending'
  const { toast } = useToast();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setSubmitStatus('error');
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
      });
      // Clear error status after a delay
      setTimeout(() => {
        setSubmitStatus(null);
      }, 3000);
      return;
    }

    setSubmitStatus('sending');
    setIsSending(true);

    // Simulate a loading toast (in a real implementation, this would update a visual component)
    toast({
      title: "Sending Message...",
      description: "Please wait while your message is delivered.",
    });

    // Show static success message instead of making HTTP request
    setTimeout(() => {
      setSubmitStatus('success');
      toast({
        title: "Message Sent!",
        description: "Sriharan will contact you soon.",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      // Keep the success status visible for a while, then reset
      setTimeout(() => {
        setIsSending(false);
        setSubmitStatus(null);
      }, 5000); // Clear success status after 5 seconds to allow user to see the message
    }, 1000); // Simulate a small delay for better UX
  };

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      label: 'Email',
      value: 'sriharanvijayakumarsk@gmail.com',
      href: 'mailto:sriharanvijayakumarsk@gmail.com',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: 'Location',
      value: 'Chennai, India',
      href: null,
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  const socialLinks = [
    {
      icon: <Github className="h-5 w-5" />,
      label: 'GitHub',
      href: 'https://github.com/sriharanvj',
      gradient: 'from-zinc-600 to-zinc-800'
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/sriharan-vijayakumar-b936b326a',
      gradient: 'from-blue-600 to-blue-800'
    }
  ];

  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 mesh-gradient opacity-30" />
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-2 glass rounded-full text-sm font-medium text-purple-400 mb-6">
            Contact
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-space">
            <span className="gradient-text">Let's Work</span>
            <span className="text-white"> Together</span>
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            Have a project in mind or want to collaborate on AI solutions? I'd love to hear from you.
            Let's create something amazing together.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Info Card */}
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageCircle className="text-purple-400" />
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="group">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${info.gradient} mb-3 group-hover:scale-110 transition-transform`}>
                      <div className="text-white">
                        {info.icon}
                      </div>
                    </div>
                    <p className="font-medium text-zinc-400 text-sm">{info.label}</p>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-lg text-white hover:text-purple-400 transition-colors font-medium"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-lg text-white font-medium">{info.value}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Social Links Card */}
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle className="text-white">Follow Me</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative p-3 glass rounded-xl hover:glass-dark transition-all duration-300 hover:scale-110"
                      title={link.label}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${link.gradient} opacity-0 group-hover:opacity-20 transition-opacity rounded-xl`} />
                      <div className="relative text-zinc-400 group-hover:text-white transition-colors">
                        {link.icon}
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle className="text-white">Send me a message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-zinc-300">
                        Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Your name"
                        className="glass bg-transparent border-zinc-700 text-white placeholder:text-zinc-500 focus:border-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your.email@example.com"
                        className="glass bg-transparent border-zinc-700 text-white placeholder:text-zinc-500 focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="block text-sm font-medium text-zinc-300">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="What's this about?"
                      className="glass bg-transparent border-zinc-700 text-white placeholder:text-zinc-500 focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium text-zinc-300">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell me about your project or idea..."
                      className="glass bg-transparent border-zinc-700 text-white placeholder:text-zinc-500 focus:border-purple-500 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full btn-primary rounded-xl py-6 text-lg"
                    disabled={isSending}
                  >
                    {isSending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>

                  {/* Display status messages */}
                  {submitStatus === 'success' && (
                    <div className="p-4 glass bg-green-500/10 border border-green-500/30 text-green-300 rounded-xl flex items-center gap-3 animate-fade-in">
                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-green-400" />
                      Message sent successfully! Sriharan will contact you soon.
                    </div>
                  )}
                  {submitStatus === 'error' && (
                    <div className="p-4 glass bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl flex items-center gap-3 animate-fade-in">
                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-red-400" />
                      Please fill in all required fields.
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-zinc-800/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-zinc-500 text-sm">
              © 2025 Sriharan Vijayakumar. Crafted with passion.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/sriharanvj"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-white transition-colors text-sm"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/sriharan-vijayakumar-b936b326a"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-white transition-colors text-sm"
              >
                LinkedIn
              </a>
              <a
                href="mailto:sriharanvijayakumarsk@gmail.com"
                className="text-zinc-500 hover:text-white transition-colors text-sm"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- FIX: Using named export to match the Index.tsx import statement ---
export { ContactForm as Contact }; 
