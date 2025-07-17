import React, { useState } from 'react';
import { Github, Linkedin, Mail, Download, ChevronDown } from 'lucide-react';
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
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-black py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">

        {/* Name with Typewriter */}
        <h1
        className="text-4xl sm:text-6xl font-bold text-white tracking-tight font-poppins animate-slideUp transition-all duration-500 hover:scale-[1.01]"
        onMouseEnter={() => setShowTyping(true)}
        onMouseLeave={() => setShowTyping(false)}
      >
      <span className="text-zinc-200 mr-2">
        Hi <span className="inline-block animate-wave origin-[70%_70%]">👋</span>, I'm
      </span>
        <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-transparent bg-clip-text">
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


        {/* Static Tagline */}
        <p className="text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto">
          Python Backend AI Developer crafting intelligent solutions with modern technologies
        </p>

        {/* Bio */}
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
          I build scalable AI applications using Python, FastAPI, and LLMs. Passionate about backend development, RAG systems, and solving complex AI problems.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            size="lg"
            className="text-lg px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Mail className="mr-2 h-5 w-5" />
            Get In Touch
          </Button>

          <Button
            asChild
            size="lg"
            className="text-lg px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <a href="/SriharanVijayakumar_Resume.pdf" download>
              <Download className="mr-2 h-5 w-5" />
              Download CV
            </a>
          </Button>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center space-x-6 pt-6">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-blue-400 transition-colors"
          >
            <Github size={24} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-blue-400 transition-colors"
          >
            <Linkedin size={24} />
          </a>
          <a
            href="mailto:sriharanvijayakumarsk@gmail.com"
            className="text-zinc-400 hover:text-blue-400 transition-colors"
          >
            <Mail size={24} />
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
      >
        <ChevronDown size={32} className="text-zinc-400" />
      </button>
    </section>
  );
};
