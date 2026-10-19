import React, { useState, useRef, useEffect } from 'react';
import { Mail, MapPin, Send, Github, Linkedin, MessageCircle, CheckCircle, AlertCircle, Loader2, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactForm = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | 'sending' | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 3000);
      return;
    }

    setSubmitStatus('sending');
    setIsSending(true);

    setTimeout(() => {
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => {
        setIsSending(false);
        setSubmitStatus(null);
      }, 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      label: 'Email',
      value: 'sriharanvijayakumarsk@gmail.com',
      href: 'mailto:sriharanvijayakumarsk@gmail.com',
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      label: 'Location',
      value: 'Chennai, India',
      href: null,
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  const socialLinks = [
    {
      icon: <Github className="h-6 w-6" />,
      label: 'GitHub',
      href: 'https://github.com/sriharanvj',
      gradient: 'from-purple-600 to-blue-600'
    },
    {
      icon: <Linkedin className="h-6 w-6" />,
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/sriharan-vijayakumar-b936b326a',
      gradient: 'from-blue-600 to-cyan-600'
    }
  ];

  return (
    <section id="contact" ref={sectionRef} className="py-32 relative overflow-hidden bg-[#030014]">
      {/* Background Elements */}
      <div className="absolute inset-0 mesh-gradient opacity-40" />
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[120px] animate-morphing-blob" />

      {/* Scan Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-20"
          style={{
            top: '50%',
            animation: `scan-line 8s linear infinite`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span
            className={`inline-block px-6 py-3 glass rounded-full text-sm font-bold text-purple-400 mb-8 transition-all duration-1000 ${
              isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-12'
            }`}
          >
            Contact
          </span>
          <h2
            className={`text-5xl md:text-6xl lg:text-7xl font-black mb-8 font-space transition-all duration-1000 ${
              isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-12'
            }`}
            style={{ animationDelay: '0.1s' }}
          >
            <span className="gradient-text-cyber text-glow-cyan">Let's Work</span>
            <span className="text-white"> Together</span>
          </h2>
          <p
            className={`text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto transition-all duration-1000 ${
              isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-12'
            }`}
            style={{ animationDelay: '0.2s' }}
          >
            Have a project in mind or want to collaborate? Let's create something amazing together.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div
            className="lg:col-span-1 space-y-8 transition-all duration-1000"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-80px)',
              transitionDelay: '0.3s'
            }}
          >
            {/* Contact Info Card */}
            <Card className="glass border-0 card-shine">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageCircle className="text-purple-400 animate-pulse" />
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="group hover:translate-x-3 transition-transform duration-300"
                  >
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${info.gradient} mb-4 group-hover:scale-125 transition-transform duration-300 shadow-lg`}>
                      <div className="text-white">
                        {info.icon}
                      </div>
                    </div>
                    <p className="font-semibold text-zinc-400 text-sm uppercase tracking-wide">{info.label}</p>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-xl text-white hover:text-cyan-400 transition-colors font-bold link-underline"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-xl text-white font-bold">{info.value}</p>
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
                <div className="flex gap-4">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative p-4 glass rounded-2xl hover:scale-125 transition-all duration-300 card-3d electric-line"
                      title={link.label}
                      onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
                        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
                        e.currentTarget.style.setProperty('--rotate-x', `${y}deg`);
                        e.currentTarget.style.setProperty('--rotate-y', `${x}deg`);
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.setProperty('--rotate-x', '0deg');
                        e.currentTarget.style.setProperty('--rotate-y', '0deg');
                      }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${link.gradient} opacity-0 group-hover:opacity-30 transition-opacity rounded-2xl blur-xl`} />
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
          <div
            className="lg:col-span-2 transition-all duration-1000"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(80px)',
              transitionDelay: '0.4s'
            }}
          >
            <Card className="glass border-0 card-shine">
              <CardHeader>
                <CardTitle className="text-white">Send me a message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Name Input */}
                    <div className="space-y-3">
                      <label
                        htmlFor="name"
                        className={`block text-sm font-bold uppercase tracking-wide transition-all duration-300 ${
                          focusedField === 'name' ? 'text-purple-400 translate-x-2' : 'text-zinc-400'
                        }`}
                      >
                        Name *
                      </label>
                      <div className="relative">
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          required
                          placeholder="Your name"
                          className={`glass-dark bg-transparent border-2 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-purple-500 rounded-xl h-14 px-5 transition-all duration-300 ${
                            focusedField === 'name' ? 'ring-4 ring-purple-500/20 shadow-lg shadow-purple-500/10' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-3">
                      <label
                        htmlFor="email"
                        className={`block text-sm font-bold uppercase tracking-wide transition-all duration-300 ${
                          focusedField === 'email' ? 'text-purple-400 translate-x-2' : 'text-zinc-400'
                        }`}
                      >
                        Email *
                      </label>
                      <div className="relative">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          required
                          placeholder="your.email@example.com"
                          className={`glass-dark bg-transparent border-2 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-purple-500 rounded-xl h-14 px-5 transition-all duration-300 ${
                            focusedField === 'email' ? 'ring-4 ring-purple-500/20 shadow-lg shadow-purple-500/10' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subject Input */}
                  <div className="space-y-3">
                    <label
                      htmlFor="subject"
                      className={`block text-sm font-bold uppercase tracking-wide transition-all duration-300 ${
                        focusedField === 'subject' ? 'text-purple-400 translate-x-2' : 'text-zinc-400'
                      }`}
                    >
                      Subject *
                    </label>
                    <div className="relative">
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('subject')}
                        onBlur={() => setFocusedField(null)}
                        required
                        placeholder="What's this about?"
                        className={`glass-dark bg-transparent border-2 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-purple-500 rounded-xl h-14 px-5 transition-all duration-300 ${
                          focusedField === 'subject' ? 'ring-4 ring-purple-500/20 shadow-lg shadow-purple-500/10' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Message Textarea */}
                  <div className="space-y-3">
                    <label
                      htmlFor="message"
                      className={`block text-sm font-bold uppercase tracking-wide transition-all duration-300 ${
                        focusedField === 'message' ? 'text-purple-400 translate-x-2' : 'text-zinc-400'
                      }`}
                    >
                      Message *
                    </label>
                    <div className="relative">
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('message')}
                        onBlur={() => setFocusedField(null)}
                        required
                        rows={6}
                        placeholder="Tell me about your project or idea..."
                        className={`glass-dark bg-transparent border-2 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-purple-500 rounded-xl px-5 py-4 transition-all duration-300 resize-none ${
                          focusedField === 'message' ? 'ring-4 ring-purple-500/20 shadow-lg shadow-purple-500/10' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    ref={buttonRef}
                    type="submit"
                    size="lg"
                    disabled={isSending}
                    className="w-full btn-cyber rounded-2xl py-8 text-xl ripple-effect group shadow-2xl shadow-purple-500/30"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-3 h-6 w-6 group-hover:translate-x-2 group-hover:-translate-y-2 transition-all duration-300" />
                        Send Message
                      </>
                    )}
                  </Button>

                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <div className="p-6 glass bg-green-500/10 border-2 border-green-500/30 text-green-300 rounded-2xl flex items-center gap-4 animate-fade-in-up">
                      <CheckCircle className="w-8 h-8 animate-bounce" />
                      <div>
                        <div className="font-bold text-lg">Message sent successfully!</div>
                        <div className="text-sm">I'll get back to you soon.</div>
                      </div>
                    </div>
                  )}
                  {submitStatus === 'error' && (
                    <div className="p-6 glass bg-red-500/10 border-2 border-red-500/30 text-red-300 rounded-2xl flex items-center gap-4 animate-fade-in-up">
                      <AlertCircle className="w-8 h-8 animate-pulse" />
                      <div>
                        <div className="font-bold text-lg">Please fill in all required fields</div>
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div
          className="mt-24 pt-10 border-t border-zinc-800/50 transition-all duration-1000"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transitionDelay: '0.6s'
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-zinc-500 text-base">
              © 2025 Sriharan Vijayakumar. Crafted with <Zap className="inline w-4 h-4 text-purple-400" /> passion.
            </p>
            <div className="flex items-center gap-8">
              {[
                { href: 'https://github.com/sriharanvj', label: 'GitHub' },
                { href: 'https://www.linkedin.com/in/sriharan-vijayakumar-b936b326a', label: 'LinkedIn' },
                { href: 'mailto:sriharanvijayakumarsk@gmail.com', label: 'Email' }
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-zinc-500 hover:text-white transition-colors text-base link-underline hover:-translate-y-1 inline-block font-semibold"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { ContactForm as Contact };
