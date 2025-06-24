
import React from 'react';
import { Github, Linkedin, Mail, Download, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Hero = () => {
  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            Hi, I'm{' '}
            <span className="text-primary bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Alex Johnson
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Full-Stack Developer crafting digital experiences with modern technologies
          </p>
          
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            I build scalable web applications using React, Node.js, and cloud technologies. 
            Passionate about clean code, user experience, and solving complex problems.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-3">
              <Mail className="mr-2 h-5 w-5" />
              Get In Touch
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              <Download className="mr-2 h-5 w-5" />
              Download CV
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-6 mb-16">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github size={24} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="mailto:alex@example.com"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail size={24} />
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollToAbout}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        >
          <ChevronDown size={32} className="text-muted-foreground" />
        </button>
      </div>
    </section>
  );
};
