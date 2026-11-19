import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Code2, Terminal } from 'lucide-react';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'projects', 'experience', 'contact'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (currentSection) {
        setActiveSection(currentSection);
      }

      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-xl shadow-2xl shadow-purple-500/20 border-b border-purple-500/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-5">
          {/* Enhanced Logo */}
          <button
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl blur-lg opacity-60 group-hover:opacity-100 group-hover:blur-xl transition-all duration-300" />
              <div className="relative w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Code2 size={24} className="text-white group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <span className="text-2xl font-black font-space gradient-text-cyber group-hover:scale-105 transition-transform duration-300">
              SRI
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`relative px-6 py-3 text-sm font-bold transition-all duration-300 rounded-xl overflow-hidden group ${
                  activeSection === item.id
                    ? 'text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span className="relative z-10">{item.label}</span>

                {/* Active indicator */}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full shadow-lg shadow-purple-500/50" />
                )}

                {/* Hover background */}
                {activeSection !== item.id && (
                  <span
                    className={`absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl transition-all duration-300 ${
                      hoveredItem === item.id ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                )}

                {/* Electric line on hover */}
                {activeSection !== item.id && hoveredItem === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-shimmer" />
                )}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-3 text-zinc-400 hover:text-white transition-colors group glass rounded-xl"
          >
            {isOpen ? (
              <X size={28} className="group-hover:rotate-90 transition-transform duration-300" />
            ) : (
              <Menu size={28} className="group-hover:scale-110 transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div
            className="md:hidden py-6 space-y-2 backdrop-blur-xl animate-fade-in-down"
          >
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full px-6 py-4 text-left rounded-2xl transition-all duration-300 relative overflow-hidden group ${
                  activeSection === item.id
                    ? 'text-white bg-gradient-to-r from-purple-500/20 to-cyan-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
                style={{
                  animationDelay: `${index * 0.05}s`,
                  opacity: 0,
                  animation: 'fade-in-up 0.3s ease-out forwards'
                }}
              >
                <span className="relative z-10 font-bold">{item.label}</span>

                {/* Hover effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 rounded-2xl" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Animated bottom border when scrolled */}
      {scrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 animate-gradient-shift" style={{ backgroundSize: '200% 100%' }} />
      )}
    </nav>
  );
};
