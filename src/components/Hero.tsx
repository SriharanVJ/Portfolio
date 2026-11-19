import React, { useState, useRef, useEffect } from 'react';
import { Github, Linkedin, Mail, Download, ChevronDown, Sparkles, Code2, ArrowRight, Terminal, Zap, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Typewriter } from 'react-simple-typewriter';

export const Hero = () => {
  const [showTyping, setShowTyping] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#030014]"
    >
      {/* Bold Animated Background - Tech Grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Tech Grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(168, 85, 247, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(168, 85, 247, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Animated Scan Lines */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30"
              style={{
                top: `${20 + i * 30}%`,
                animation: `scan-line 4s linear infinite`,
                animationDelay: `${i * 1.5}s`,
              }}
            />
          ))}
        </div>

        {/* Large Dramatic Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-morphing-blob" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] animate-morphing-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-morphing-blob animation-delay-4000" />

        {/* Data Flow Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="data-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              height: `${15 + Math.random() * 20}px`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-12">
        {/* Dramatic Logo with Orbiting Elements */}
        <div
          className={`flex justify-center mb-8 transition-all duration-1000 ${isLoaded ? 'animate-scale-in opacity-100' : 'opacity-0'}`}
        >
          <div className="relative">
            {/* Outer Glow Rings */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-2xl opacity-60 animate-pulse-glow" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-xl pulse-ring" />

            {/* Main Icon Container */}
            <div className="relative w-32 h-32 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-full flex items-center justify-center glow-blue animate-float card-shine">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/30 to-cyan-400/30 animate-shimmer" />
              <Code2 size={64} className="text-white animate-neon-flicker" />
            </div>

            {/* Orbiting Elements */}
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: i % 2 === 0 ? '#a855f7' : '#06b6d4',
                  boxShadow: `0 0 20px ${i % 2 === 0 ? '#a855f7' : '#06b6d4'}`,
                  animation: `orbit ${8 + i * 2}s linear infinite`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}

            {/* Tech Symbols */}
            <div className="absolute -top-4 -right-4 text-purple-400 animate-bounce">
              <Terminal size={24} />
            </div>
            <div className="absolute -bottom-4 -left-4 text-cyan-400 animate-bounce animation-delay-1000">
              <Cpu size={24} />
            </div>
          </div>
        </div>

        {/* Bold Greeting with Glitch Effect */}
        <div
          className={`flex items-center justify-center gap-3 text-xl md:text-2xl transition-all duration-1000 ${
            isLoaded ? 'animate-fade-in-up opacity-100' : 'opacity-0'
          }`}
          style={{ animationDelay: '0.2s' }}
        >
          <Sparkles className="w-6 h-6 text-yellow-400 animate-bounce" />
          <span className="gradient-text-cyber font-bold">Welcome to my portfolio</span>
          <Sparkles className="w-6 h-6 text-yellow-400 animate-bounce animation-delay-500" />
        </div>

        {/* Dramatic Name with Typewriter */}
        <h1
          className={`text-6xl sm:text-8xl md:text-9xl font-black tracking-tight font-space transition-all duration-1000 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ animationDelay: '0.4s' }}
        >
          <span className="block text-zinc-200 mb-4 text-4xl md:text-5xl lg:text-6xl">
            Hi <span className="inline-block animate-wave">👋</span>, I'm
          </span>
          <div className="relative inline-block">
            <span className="text-white inline-block">
              {showTyping ? (
                <Typewriter
                  words={['Sriharan Vijayakumar', 'AI Developer', 'Python Expert', 'Backend Engineer']}
                  loop
                  cursor
                  cursorStyle="|"
                  typeSpeed={80}
                  deleteSpeed={50}
                  delaySpeed={2000}
                />
              ) : (
                'Sriharan Vijayakumar'
              )}
            </span>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 animate-pulse-glow" />
          </div>
        </h1>

        {/* Bold Tagline with Fire Gradient */}
        <div
          className={`relative inline-block transition-all duration-1000 ${isLoaded ? 'animate-fade-in-up opacity-100' : 'opacity-0'}`}
          style={{ animationDelay: '0.6s' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 blur-2xl opacity-60 animate-glow-pulse" />
          <p className="relative text-3xl md:text-4xl lg:text-5xl font-black gradient-text-fire text-glow">
            Python Backend AI Developer
          </p>
        </div>

        {/* Tech Stack Pills with Bold Animations */}
        <div
          className={`flex flex-wrap justify-center gap-4 py-6 stagger-children transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ animationDelay: '0.8s' }}
        >
          {[
            { name: 'Python', color: 'from-blue-500 to-cyan-500', icon: '🐍' },
            { name: 'FastAPI', color: 'from-green-500 to-emerald-500', icon: '⚡' },
            { name: 'LLMs', color: 'from-purple-500 to-pink-500', icon: '🤖' },
            { name: 'RAG', color: 'from-orange-500 to-red-500', icon: '🔮' },
            { name: 'PostgreSQL', color: 'from-blue-600 to-indigo-600', icon: '🗄️' }
          ].map((tech, index) => (
            <div
              key={tech.name}
              className="group relative px-6 py-3 glass rounded-xl cursor-default hover:scale-110 transition-all duration-300 card-hover"
              style={{ animationDelay: `${0.9 + index * 0.1}s` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${tech.color} rounded-xl opacity-0 group-hover:opacity-20 transition-opacity`} />
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${tech.color} opacity-0 group-hover:opacity-40 blur-xl transition-opacity`} />
              <span className="relative flex items-center gap-2 text-white font-semibold">
                <span className="text-xl">{tech.icon}</span>
                {tech.name}
              </span>
            </div>
          ))}
        </div>

        {/* Dramatic CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-6 justify-center pt-8 transition-all duration-1000 ${isLoaded ? 'animate-fade-in-up opacity-100' : 'opacity-0'}`}
          style={{ animationDelay: '1.4s' }}
        >
          <Button
            asChild
            size="lg"
            className="text-xl px-10 py-8 btn-cyber rounded-xl ripple-effect group"
          >
            <a href="mailto:sriharanvijayakumarsk@gmail.com" className="flex items-center">
              <Mail className="mr-3 h-6 w-6 group-hover:animate-bounce" />
              Get In Touch
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
            </a>
          </Button>

          <Button
            asChild
            size="lg"
            className="text-xl px-10 py-8 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-emerald-500/30 group ripple-effect"
          >
            <a href="/SriharanVijayakumar_Resume.pdf" download className="flex items-center">
              <Download className="mr-3 h-6 w-5 group-hover:animate-bounce" />
              Download CV
            </a>
          </Button>
        </div>

        {/* Social Icons with Electric Effects */}
        <div
          className={`flex justify-center space-x-10 pt-10 transition-all duration-1000 ${isLoaded ? 'animate-fade-in-up opacity-100' : 'opacity-0'}`}
          style={{ animationDelay: '1.6s' }}
        >
          {[
            { icon: Github, href: 'https://github.com/sriharanvj', label: 'GitHub', color: 'from-purple-600 to-blue-600' },
            { icon: Linkedin, href: 'https://www.linkedin.com/in/sriharan-vijayakumar-b936b326a', label: 'LinkedIn', color: 'from-blue-600 to-cyan-600' },
            { icon: Mail, href: 'mailto:sriharanvijayakumarsk@gmail.com', label: 'Email', color: 'from-purple-600 to-pink-600' },
          ].map((social, index) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-4 glass rounded-2xl hover:scale-125 transition-all duration-300 card-3d electric-line"
              style={{ animationDelay: `${1.7 + index * 0.1}s` }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * -15;
                e.currentTarget.style.setProperty('--rotate-x', `${y}deg`);
                e.currentTarget.style.setProperty('--rotate-y', `${x}deg`);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.setProperty('--rotate-x', '0deg');
                e.currentTarget.style.setProperty('--rotate-y', '0deg');
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${social.color} rounded-2xl opacity-0 group-hover:opacity-40 transition-opacity blur-xl`} />
              <social.icon size={32} className="text-zinc-400 group-hover:text-white transition-colors relative z-10" />
            </a>
          ))}
        </div>
      </div>

      {/* Bold Scroll Indicator */}
      <div
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3 transition-all duration-1000 ${isLoaded ? 'animate-fade-in-up opacity-100' : 'opacity-0'}`}
        style={{ animationDelay: '1.8s' }}
      >
        <span className="text-sm text-zinc-400 font-medium animate-pulse">Scroll to explore</span>
        <button
          onClick={scrollToAbout}
          className="p-4 glass rounded-2xl hover:scale-110 transition-all duration-300 scroll-indicator group"
        >
          <ChevronDown size={32} className="text-purple-400 group-hover:text-cyan-400 transition-colors animate-bounce" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity blur-xl" />
        </button>
      </div>

      {/* Bottom Gradient Fade with Scan Line */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#030014] via-[#030014]/90 to-transparent pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-shimmer" />
      </div>
    </section>
  );
};
