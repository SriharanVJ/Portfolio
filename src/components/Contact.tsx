import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter } from 'lucide-react';

// --- Configuration and Mock Components for Self-Contained File ---

// NOTE: This URL must point to your live FastAPI server endpoint that handles mail sending.
const FASTAPI_URL = 'http://localhost:8000'; 

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
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
    />
);

const Textarea = ({ className = '', ...props }) => (
    <textarea
        className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
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
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
      });
      return;
    }

    setIsSending(true);
    
    // Simulate a loading toast (in a real implementation, this would update a visual component)
    toast({
      title: "Sending Message...",
      description: "Please wait while your message is delivered.",
    });

    try {
      // This sends the data to the FastAPI server at http://localhost:8000/contact
      const response = await axios.post(`${FASTAPI_URL}/contact`, formData);
      
      if (response.status === 200 || response.status === 201) {
        toast({
          title: "Message Sent!",
          description: "Thank you for your message. I'll get back to you soon.",
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
         throw new Error(`Server responded with status ${response.status}`);
      }

    } catch (error) {
      console.error('Email submission error:', error);
      toast({
        title: "Submission Failed",
        description: "Sorry, the email server is unreachable. Please try again or use the direct email link.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      label: 'Email',
      value: 'sriharanvijayakumarsk@gmail.com',
      href: 'mailto:sriharanvijayakumarsk@gmail.com'
    },
    {
      icon: <Phone className="h-5 w-5" />,
      label: 'Phone',
      value: '+91 6380695167',
      href: 'tel:+916380695167'
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: 'Location',
      value: 'Chennai, India',
      href: null
    }
  ];

  const socialLinks = [
    {
      icon: <Github className="h-5 w-5" />,
      label: 'GitHub',
      href: 'https://github.com/SriharanVJ'
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/sriharan-vijayakumar-b936b326a'
    },
    {
      icon: <Twitter className="h-5 w-5" />,
      label: 'Twitter',
      href: 'https://twitter.com'
    }
  ];

  return (
    <section id="contact" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white hover:text-sky-400 transition-colors duration-200">
            Get In Touch
          </h2>
          <p className="text-lg text-zinc-300 max-w-3xl mx-auto">
            Have a project in mind or want to collaborate on AI solutions? I'd love to hear from you.
            Let's create something amazing together.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="text-blue-400">{info.icon}</div>
                    <div>
                      <p className="font-medium text-zinc-200">{info.label}</p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-zinc-300 hover:text-blue-400 transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-zinc-300">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Follow Me</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 border border-zinc-700 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-zinc-300"
                      title={link.label}
                    >
                      {link.icon}
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Send me a message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2 text-zinc-200">
                        Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Your name"
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2 text-zinc-200">
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
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2 text-zinc-200">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="What's this about?"
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2 text-zinc-200">
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
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isSending}
                  >
                    {isSending ? (
                      'Sending...' // Show sending state
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-zinc-800 text-center">
          <p className="text-zinc-400">
            © 2025 Sriharan Vijayakumar.
          </p>
        </div>
      </div>
    </section>
  );
};

// --- FIX: Using named export to match the Index.tsx import statement ---
export { ContactForm as Contact }; 
