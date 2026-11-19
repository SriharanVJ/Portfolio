import React, { useRef, useState, useEffect } from 'react';
import { Github, Sparkles, TrendingUp, Layers } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const Projects = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

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

  const projects = [
    {
      title: 'Acting-Driver',
      description: 'Full ride-hailing platform: an async FastAPI backend with Redis GEO-based nearby-driver matching and ride lifecycle, plus TanStack Start rider and driver frontends.',
      technologies: ['FastAPI', 'TanStack Start', 'Redis', 'SQLAlchemy', 'Docker'],
      gradient: 'from-amber-500 to-orange-600',
      featured: true,
      githubUrl: 'https://github.com/SriharanVJ/Acting-Driver',
      icon: '🚕'
    },
    {
      title: 'Product Comparison API',
      description: 'QuickCommerce price comparison backend: search a product once and get normalized prices from Blinkit, Zepto and Swiggy Instamart through a FastAPI + Redis/PostgreSQL stack.',
      technologies: ['FastAPI', 'Redis', 'PostgreSQL', 'Docker', 'Python'],
      gradient: 'from-cyan-500 to-teal-600',
      featured: true,
      githubUrl: 'https://github.com/SriharanVJ/Product-Comarision',
      icon: '🛒'
    },
    {
      title: 'App Price Whiz',
      description: 'SwiftCart Compare — a TanStack Start storefront that searches products and compares prices across shopping sites in one clean, responsive view.',
      technologies: ['TanStack Start', 'React', 'TypeScript', 'Tailwind CSS'],
      gradient: 'from-blue-500 to-indigo-600',
      featured: true,
      githubUrl: 'https://github.com/SriharanVJ/app-price-whiz',
      icon: '🛍️'
    },
    {
      title: 'Trip Booking (Bus)',
      description: 'Bus travel booking platform pairing a FastAPI API with a TanStack Start app for travelers and admins — search trips and manage bookings, vehicles and schedules.',
      technologies: ['TanStack Start', 'FastAPI', 'TypeScript', 'Docker'],
      gradient: 'from-purple-600 to-blue-600',
      featured: true,
      githubUrl: 'https://github.com/SriharanVJ/Trip-Booking',
      icon: '🚌'
    },
    {
      title: 'Sparkler Snap Cart',
      description: 'Festive crackers e-commerce storefront built with TanStack Start — product catalog, cart and price rows with a polished, Lovable-designed UI.',
      technologies: ['TanStack Start', 'React', 'TypeScript', 'Docker'],
      gradient: 'from-red-500 to-orange-600',
      featured: true,
      githubUrl: 'https://github.com/SriharanVJ/sparkler-snap-cart',
      icon: '🎆'
    },
    {
      title: 'Attendance Automation',
      description: 'Automated attendance check-in/out: a Python client and a Cloudflare Worker hit the portal inside randomized time windows, with Dockerized deployment for reliability.',
      technologies: ['Python', 'Cloudflare Workers', 'Docker', 'Automation'],
      gradient: 'from-green-500 to-emerald-600',
      featured: true,
      githubUrl: 'https://github.com/SriharanVJ/Attendance',
      icon: '🕘'
    },
    {
      title: 'Voice Agent',
      description: 'Real-time voice agent pipeline over websockets: Whisper speech-to-text, a Gemini LLM in the middle, and Kokoro TTS streaming natural-sounding replies back.',
      technologies: ['Python', 'aiohttp', 'Whisper', 'Gemini', 'Kokoro TTS'],
      gradient: 'from-fuchsia-500 to-purple-600',
      featured: true,
      githubUrl: 'https://github.com/SriharanVJ/Voice_Agent',
      icon: '🎙️'
    },
    {
      title: 'QueueCut (Barber Shop)',
      description: 'WhatsApp-first virtual queue for barbershops: customers join by scanning a QR code, get live position updates over WhatsApp, and walk in right on time.',
      technologies: ['FastAPI', 'WhatsApp', 'QR Codes', 'Docker'],
      gradient: 'from-pink-600 to-rose-600',
      featured: true,
      githubUrl: 'https://github.com/SriharanVJ/Barber_shop',
      icon: '💈'
    },
    {
      title: 'Food Ordering',
      description: 'Food-truck ordering app: a Next.js storefront for menus, cart and checkout on top of a FastAPI backend that manages orders end to end.',
      technologies: ['Next.js', 'FastAPI', 'React', 'Docker'],
      gradient: 'from-orange-500 to-red-500',
      featured: true,
      githubUrl: 'https://github.com/SriharanVJ/Food-order',
      icon: '🍜'
    },
    {
      title: 'Salon Booking (Saloon)',
      description: 'Salon booking platform with an Express + Prisma REST API and a React frontend for services, stylists and appointment management.',
      technologies: ['Express', 'Prisma', 'React', 'Node.js'],
      gradient: 'from-rose-500 to-pink-600',
      featured: true,
      githubUrl: 'https://github.com/SriharanVJ/Saloon',
      icon: '💅'
    },
    {
      title: 'Auto Form Filler',
      description: 'Turns plain-English instructions into filled PDFs: a FastAPI service that extracts form fields with PyPDFForm and lets a local Ollama model map values to the right fields.',
      technologies: ['FastAPI', 'Ollama', 'PyPDFForm', 'Python'],
      gradient: 'from-violet-500 to-purple-600',
      featured: true,
      githubUrl: 'https://github.com/SriharanVJ/Auto-form',
      icon: '📝'
    },
    {
      title: 'IVR System',
      description: 'Interactive Voice Response flows built on FastAPI and Twilio TWiML — menu-driven call handling through clean webhook endpoints that are easy to extend.',
      technologies: ['FastAPI', 'Twilio', 'TWiML', 'Python'],
      gradient: 'from-teal-500 to-cyan-600',
      featured: true,
      githubUrl: 'https://github.com/SriharanVJ/IVR',
      icon: '☎️'
    },
    {
      title: 'NVIDIA NIM Chat',
      description: 'Streaming terminal chat client for NVIDIA NIM (Llama 3.1 8B) via the OpenAI SDK, with colored CLI output and graceful interrupt handling.',
      technologies: ['Python', 'OpenAI SDK', 'NVIDIA NIM'],
      gradient: 'from-lime-500 to-green-600',
      featured: true,
      githubUrl: 'https://github.com/SriharanVJ/Nvidia',
      icon: '🖥️'
    },
    {
      title: 'AI Receptionist',
      description: 'Local-first AI receptionist: an Ollama-powered CLI that greets visitors, answers questions about the workspace, and logs every visit to SQLite.',
      technologies: ['Python', 'Ollama', 'SQLite'],
      gradient: 'from-indigo-500 to-blue-600',
      featured: true,
      githubUrl: 'https://github.com/SriharanVJ/receptionist',
      icon: '🛎️'
    },
    {
      title: 'AI Web Scraping',
      description: 'AI web scraping POCs with ScrapeGraphAI driven by a local Ollama model — structured extraction from pages without brittle CSS selectors.',
      technologies: ['Python', 'ScrapeGraphAI', 'Ollama'],
      gradient: 'from-slate-500 to-gray-600',
      featured: true,
      githubUrl: 'https://github.com/SriharanVJ/WebScraping',
      icon: '🕸️'
    }
  ];

  return (
    <section id="projects" ref={sectionRef} className="py-32 relative overflow-hidden bg-[#030014]">
      {/* Background Elements */}
      <div className="absolute inset-0 mesh-gradient opacity-40" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-morphing-blob" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-morphing-blob animation-delay-2000" />

      {/* Scan Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-20"
            style={{
              top: `${30 + i * 40}%`,
              animation: `scan-line 5s linear infinite`,
              animationDelay: `${i * 2.5}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span
            className={`inline-block px-6 py-3 glass rounded-full text-sm font-bold text-purple-400 mb-8 transition-all duration-1000 ${
              isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-12'
            }`}
          >
            Featured Projects
          </span>
          <h2
            className={`text-5xl md:text-6xl lg:text-7xl font-black mb-8 font-space transition-all duration-1000 ${
              isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-12'
            }`}
            style={{ animationDelay: '0.1s' }}
          >
            <span className="gradient-text-cyber text-glow-cyan">Recent</span>
            <span className="text-white"> Work</span>
          </h2>
          <p
            className={`text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto transition-all duration-1000 ${
              isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-12'
            }`}
            style={{ animationDelay: '0.2s' }}
          >
            Showcasing my expertise in Python backend development and AI integration
          </p>
        </div>

        {/* Projects Grid - Modern Bento Style */}
        <div className="grid md:grid-cols-2 gap-8">
          {projects.filter(project => project.featured).map((project, index) => (
            <Card
              key={index}
              className={`group gradient-border overflow-hidden bg-zinc-900/60 border-0 card-hover card-3d perspective-1000 gpu-accelerated transition-all duration-1000 ${
                hoveredCard === index ? 'ring-4 ring-purple-500/40 scale-[1.02]' : ''
              }`}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(80px) scale(0.9)',
                transitionDelay: `${0.3 + index * 0.15}s`
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
                e.currentTarget.style.setProperty('--rotate-x', `${y}deg`);
                e.currentTarget.style.setProperty('--rotate-y', `${x}deg`);
              }}
            >
              {/* Project Image with Dramatic Effects */}
              <div className="relative h-72 overflow-hidden">
                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-30 transition-all duration-500 ${
                    hoveredCard === index ? 'opacity-50' : ''
                  }`}
                />

                {/* Image with Zoom */}
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-8xl select-none transition-transform duration-700 group-hover:scale-110">
                    {project.icon}
                  </div>
                )}

                {/* Overlay Content on Hover */}
                {project.stats && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col justify-end p-6 transition-all duration-500 ${
                      hoveredCard === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  >
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {Object.entries(project.stats).map(([key, value]) => (
                        <div key={key} className="text-center glass rounded-lg p-2">
                          <div className="text-2xl font-black gradient-text-cyber">{value}</div>
                          <div className="text-xs text-zinc-400 uppercase tracking-wide">{key}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tech Badge */}
                <div className="absolute top-4 right-4">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${project.gradient} text-white text-sm font-bold shadow-2xl`}>
                    <span className="text-xl">{project.icon}</span>
                    Featured
                  </div>
                </div>

                {/* Bottom Gradient Line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${project.gradient} transition-all duration-500 ${
                  hoveredCard === index ? 'h-2' : ''
                }`} />
              </div>

              {/* Project Content */}
              <CardHeader className="pb-4">
                <h3 className="text-2xl font-black text-white group-hover:gradient-text-cyber transition-all duration-300">
                  {project.title}
                </h3>
              </CardHeader>

              <CardContent>
                <p className="text-zinc-400 leading-relaxed mb-6 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <Badge
                      key={techIndex}
                      variant="secondary"
                      className="px-4 py-2 glass text-zinc-300 hover:text-white hover:glass-dark hover:scale-110 transition-all duration-300 border-0 cursor-default"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              {/* Card Footer with Action Buttons */}
              <CardFooter className="pt-0">
                <div className="flex gap-4 w-full">
                  {project.githubUrl && (
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="flex-1 glass hover:glass-dark transition-all duration-300 group/btn electric-line"
                    >
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                      >
                        <Github className="w-5 h-5 mr-2 group-hover/btn:animate-spin" />
                        GitHub
                      </a>
                    </Button>
                  )}
                  {project.liveUrl && (
                    <Button
                      asChild
                      size="lg"
                      className="flex-1 btn-cyber ripple-effect"
                    >
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                      >
                        <Eye className="w-5 h-5 mr-2" />
                        Live Demo
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <div
          className="mt-20 transition-all duration-1000"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transitionDelay: '1s'
          }}
        >
          <Card className="glass max-w-3xl mx-auto card-shine group hover:scale-105 transition-all duration-500">
            <CardContent className="p-10">
              <div className="relative inline-block mb-6">
                <Sparkles className="w-16 h-16 text-purple-400 mx-auto animate-bounce" />
                <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-2xl animate-pulse-glow" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4 text-center">
                Want to see more?
              </h3>
              <p className="text-xl text-zinc-400 mb-8 text-center max-w-xl mx-auto">
                Check out my GitHub for more projects, contributions, and open-source work.
              </p>
              <Button
                asChild
                size="lg"
                className="btn-cyber rounded-xl px-10 py-8 text-xl ripple-effect mx-auto flex"
              >
                <a
                  href="https://github.com/sriharanvj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <Github className="mr-3 h-6 w-6 group-hover:animate-spin" />
                  View GitHub Profile
                  <TrendingUp className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Tech Stack Banner */}
        <div
          className="mt-16 glass rounded-2xl p-8 transition-all duration-1000"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transitionDelay: '1.2s'
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Layers className="w-6 h-6 text-purple-400" />
            <h3 className="text-2xl font-black text-white">Technologies I Work With</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: 'Python', color: 'from-blue-500 to-cyan-500', icon: '🐍' },
              { name: 'FastAPI', color: 'from-green-500 to-emerald-500', icon: '⚡' },
              { name: 'PostgreSQL', color: 'from-blue-600 to-indigo-600', icon: '🗄️' },
              { name: 'LLMs', color: 'from-purple-500 to-pink-500', icon: '🤖' },
              { name: 'RAG', color: 'from-orange-500 to-red-500', icon: '🔮' },
              { name: 'React', color: 'from-cyan-500 to-blue-500', icon: '⚛️' },
              { name: 'Docker', color: 'from-blue-500 to-purple-500', icon: '🐳' },
              { name: 'TypeScript', color: 'from-blue-600 to-cyan-600', icon: '📘' }
            ].map((tech, index) => (
              <div
                key={tech.name}
                className="px-6 py-3 glass rounded-xl text-white font-semibold hover:scale-110 hover:glass-dark transition-all duration-300 card-hover group"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <span className="mr-2">{tech.icon}</span>
                {tech.name}
                <div className={`absolute inset-0 bg-gradient-to-r ${tech.color} rounded-xl opacity-0 group-hover:opacity-20 transition-opacity blur-xl`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
