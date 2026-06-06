import React, { useState } from 'react';
import { Github, Linkedin, Mail, Download, ChevronDown, Sparkles, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Typewriter } from 'react-simple-typewriter';

export const Hero = () => {
  const [showTyping, setShowTyping] = useState(false);

  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden mesh-gradient py-20"
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">

        {/* Animated logo/icon */}
        <div className="flex justify-center mb-8 animate-float">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center glow-purple">
              <Code2 size={40} className="text-white" />
            </div>
          </div>
        </div>

        {/* Greeting with sparkles */}
        <div className="flex items-center justify-center gap-2 text-lg md:text-xl text-zinc-300 animate-slide-in-left">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <span>Welcome to my portfolio</span>
          <Sparkles className="w-5 h-5 text-yellow-400" />
        </div>

        {/* Name with Typewriter */}
        <h1
          className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight font-space transition-all duration-500"
          onMouseEnter={() => setShowTyping(true)}
          onMouseLeave={() => setShowTyping(false)}
        >
          <span className="block text-zinc-200 mb-2">
            Hi <span className="inline-block animate-wave">👋</span>, I'm
          </span>
          <span className="gradient-text">
            {showTyping ? (
              <Typewriter
                words={['Sriharan Vijayakumar']}
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={100}
                deleteSpeed={40}
                delaySpeed={1000}
              />
            ) : (
              'Sriharan Vijayakumar'
            )}
          </span>
        </h1>

        {/* Animated Tagline */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 blur-lg opacity-30" />
          <p className="relative text-xl md:text-2xl lg:text-3xl font-semibold gradient-text-blue">
            Python Backend AI Developer
          </p>
        </div>

        {/* Bio */}
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          I build scalable AI applications using Python, FastAPI, and LLMs. Started as an intern at
          Yavar Tech Works and now working full-time on RAG systems and intelligent backend solutions.
        </p>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap justify-center gap-3 py-4">
          {['Python', 'FastAPI', 'LLMs', 'RAG', 'PostgreSQL'].map((tech) => (
            <span
              key={tech}
              className="px-4 py-2 glass rounded-full text-sm font-medium text-zinc-300 hover:text-white hover:glass-dark transition-all duration-300 cursor-default"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button
            asChild
            size="lg"
            className="text-lg px-8 py-6 btn-primary rounded-full"
          >
            <a href="mailto:sriharanvijayakumarsk@gmail.com">
              <Mail className="mr-2 h-5 w-5" />
              Get In Touch
            </a>
          </Button>

          <Button
            asChild
            size="lg"
            className="text-lg px-8 py-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-emerald-500/30"
          >
            <a href="/SriharanVijayakumar_Resume.pdf" download>
              <Download className="mr-2 h-5 w-5" />
              Download CV
            </a>
          </Button>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center space-x-8 pt-8">
          {[
            { icon: Github, href: 'https://github.com/sriharanvj', label: 'GitHub' },
            { icon: Linkedin, href: 'https://www.linkedin.com/in/sriharan-vijayakumar-b936b326a', label: 'LinkedIn' },
            { icon: Mail, href: 'mailto:sriharanvijayakumarsk@gmail.com', label: 'Email' },
          ].map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-3 glass rounded-full hover:glass-dark transition-all duration-300 hover:scale-110"
            >
              <social.icon size={24} className="text-zinc-400 group-hover:text-white transition-colors" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity" />
            </a>
          ))}
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-sm text-zinc-500">Scroll to explore</span>
        <button
          onClick={scrollToAbout}
          className="p-2 glass rounded-full hover:glass-dark transition-all duration-300 animate-bounce"
        >
          <ChevronDown size={24} className="text-zinc-400" />
        </button>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
};
