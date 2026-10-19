import React, { useRef, useState, useEffect } from 'react';
import { Calendar, MapPin, Building, Briefcase, Trophy, Code, Rocket, Award, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const Experience = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

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

  const experiences = [
    {
      company: 'Yavar Tech Works',
      position: 'Python Backend AI Developer',
      duration: 'March 2025 - Present',
      type: 'Full-time',
      location: 'Chennai, India',
      description: "Full-time AI Backend Developer building intelligent solutions with Python, FastAPI, and LLMs. Leading development of RAG systems and AI-powered applications for enterprise clients.",
      gradient: 'from-purple-600 to-blue-600',
      achievements: [
        '🏆 Delivery Excellence Award for outstanding project delivery',
        'Built RAG Chatbot with 95% query accuracy',
        'Healthcare System handling 500+ daily bookings',
        'Real-time TTS integration with 3-second timeout',
        'Scalable FastAPI backends for production apps',
        'WhatsApp & Meta API integrations for e-commerce'
      ],
      technologies: ['Python', 'FastAPI', 'PostgreSQL', 'FAISS', 'LLMs', 'RAG', 'Gemini'],
      metrics: [
        { label: 'Projects', value: '5+', color: 'from-purple-500 to-blue-500' },
        { label: 'Accuracy', value: '95%', color: 'from-cyan-500 to-blue-500' },
        { label: 'Users', value: '1000+', color: 'from-pink-500 to-purple-500' }
      ]
    },
    {
      company: 'Yavar Tech Works',
      position: 'Python Backend AI Developer Intern',
      duration: 'November 2024 - February 2025',
      type: 'Internship',
      location: 'Chennai, India',
      description: "4-month internship focused on learning and implementing AI/ML solutions. Gained hands-on experience with FastAPI, RAG systems, and modern backend development practices.",
      gradient: 'from-green-600 to-emerald-600',
      achievements: [
        'Learned and implemented RAG systems with vector databases',
        'Developed RESTful APIs using FastAPI with PostgreSQL',
        'Gained practical experience with LLM integration',
        'Contributed to e-commerce platform backend',
        'Built foundation in AI-powered chatbot systems'
      ],
      technologies: ['Python', 'FastAPI', 'PostgreSQL', 'LLMs', 'REST APIs', 'Alembic'],
      metrics: [
        { label: 'APIs Built', value: '10+', color: 'from-green-500 to-emerald-500' },
        { label: 'Skills', value: '8+', color: 'from-cyan-500 to-green-500' },
        { label: 'Projects', value: '3', color: 'from-blue-500 to-cyan-500' }
      ]
    }
  ];

  return (
    <section id="experience" ref={sectionRef} className="py-32 relative overflow-hidden bg-[#030014]">
      {/* Background Elements */}
      <div className="absolute inset-0 mesh-gradient opacity-40" />
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-morphing-blob" />
      <div className="absolute bottom-1/3 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-morphing-blob animation-delay-2000" />

      {/* Scan Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-20"
            style={{
              top: `${35 + i * 30}%`,
              animation: `scan-line 7s linear infinite`,
              animationDelay: `${i * 3.5}s`,
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
            Experience
          </span>
          <h2
            className={`text-5xl md:text-6xl lg:text-7xl font-black mb-8 font-space transition-all duration-1000 ${
              isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-12'
            }`}
            style={{ animationDelay: '0.1s' }}
          >
            <span className="gradient-text-cyber text-glow-cyan">Professional</span>
            <span className="text-white"> Journey</span>
          </h2>
          <p
            className={`text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto transition-all duration-1000 ${
              isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-12'
            }`}
            style={{ animationDelay: '0.2s' }}
          >
            Building AI-powered backend solutions and intelligent systems
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Animated Timeline Line */}
          <div
            className="absolute left-1/2 transform -translate-x-1/2 h-full w-2 hidden lg:block"
            style={{
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 1s ease',
              background: 'linear-gradient(to bottom, #a855f7 0%, #6366f1 50%, #3b82f6 100%)',
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)'
            }}
          />

          {/* Timeline Dots */}
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden lg:block">
            {experiences.map((_, index) => (
              <div
                key={index}
                className="absolute w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 border-4 border-[#030014] shadow-2xl shadow-purple-500/50"
                style={{
                  top: `${20 + index * 40}%`,
                  opacity: isVisible ? 1 : 0,
                  transform: `translateX(-50%) scale(${isVisible ? 1 : 0})`,
                  transition: `all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.3 + index * 0.2}s`
                }}
              />
            ))}
          </div>

          {/* Experience Cards */}
          <div className="max-w-5xl mx-auto space-y-16">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className={`relative transition-all duration-1000 ${
                  index % 2 === 0 ? 'lg:pr-1/2 lg:ml-auto lg:text-left' : 'lg:pl-1/2 lg:mr-auto lg:text-right'
                }`}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateX(0)' : index % 2 === 0 ? 'translateX(-80px)' : 'translateX(80px)',
                  transitionDelay: `${0.3 + index * 0.2}s`
                }}
              >
                <Card
                  className={`glass border-0 overflow-hidden card-hover card-3d group perspective-1000 gpu-accelerated transition-all duration-500 ${
                    expandedCard === index ? 'ring-4 ring-purple-500/40 scale-[1.02]' : ''
                  }`}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
                    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
                    e.currentTarget.style.setProperty('--rotate-x', `${y}deg`);
                    e.currentTarget.style.setProperty('--rotate-y', `${x}deg`);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.setProperty('--rotate-x', '0deg');
                    e.currentTarget.style.setProperty('--rotate-y', '0deg');
                  }}
                >
                  {/* Top Gradient Bar */}
                  <div className={`h-2 bg-gradient-to-r ${exp.gradient} transition-all duration-500 group-hover:h-3 shadow-lg`} />

                  <CardContent className="p-10">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`p-4 rounded-2xl bg-gradient-to-br ${exp.gradient} group-hover:scale-125 transition-transform duration-300 shadow-2xl`}>
                            <Building size={28} className="text-white" />
                          </div>
                          <div>
                            <h3 className="text-3xl font-black text-white group-hover:gradient-text-cyber transition-all duration-300">
                              {exp.position}
                            </h3>
                            <p className="text-xl text-zinc-400">{exp.company}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 px-5 py-3 glass rounded-2xl hover:glass-dark transition-all duration-300">
                          <Briefcase size={18} className="text-purple-400" />
                          <span className="text-white font-bold">{exp.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 px-5 py-3 glass rounded-2xl hover:glass-dark transition-all duration-300">
                          <MapPin size={18} className="text-cyan-400" />
                          <span className="text-white font-bold">{exp.location}</span>
                        </div>
                        <div className={`flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r ${exp.gradient} shadow-lg`}>
                          <span className="text-white font-black text-sm">{exp.type}</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xl text-zinc-300 leading-relaxed mb-8">
                      {exp.description}
                    </p>

                    {/* Award Badge */}
                    {exp.type === 'Full-time' && (
                      <div className="mb-8 p-6 glass-dark rounded-2xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 card-shine group">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg animate-pulse-glow">
                            <Award size={24} className="text-white" />
                          </div>
                          <div>
                            <div className="text-white font-black text-xl">🏆 Delivery Excellence Award</div>
                            <div className="text-zinc-400">Outstanding project delivery and performance</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Bold Metrics */}
                    {exp.metrics && (
                      <div className="mb-8 p-8 glass rounded-3xl">
                        <h4 className="text-lg font-black text-zinc-400 mb-6 flex items-center gap-2">
                          <TrendingUp size={20} className="text-yellow-500" />
                          KEY METRICS
                        </h4>
                        <div className="grid grid-cols-3 gap-6">
                          {exp.metrics.map((metric, mIndex) => (
                            <div key={mIndex} className="text-center group/metric">
                              <div className={`text-4xl font-black bg-gradient-to-r ${metric.color} bg-clip-text text-transparent mb-2 group-hover/metric:scale-125 transition-transform duration-300`}>
                                {metric.value}
                              </div>
                              <div className="text-sm text-zinc-500 font-semibold uppercase tracking-wide">{metric.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Expandable Achievements */}
                    <div className="glass rounded-2xl p-6">
                      <button
                        onClick={() => setExpandedCard(expandedCard === index ? null : index)}
                        className="w-full flex items-center justify-between mb-6 hover:text-purple-400 transition-colors"
                      >
                        <h4 className="font-black text-white text-xl flex items-center gap-2">
                          <Trophy size={24} className="text-yellow-500" />
                          KEY ACHIEVEMENTS
                        </h4>
                        {expandedCard === index ? (
                          <ChevronUp size={24} className="text-purple-400" />
                        ) : (
                          <ChevronDown size={24} className="text-zinc-400" />
                        )}
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-700 ${
                          expandedCard === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <ul className="space-y-4">
                          {exp.achievements.map((achievement, achIndex) => (
                            <li
                              key={achIndex}
                              className="flex items-start gap-4 text-zinc-300 text-lg group/achievement hover:text-white transition-colors"
                            >
                              <Rocket
                                size={20}
                                className="text-purple-400 mt-1 flex-shrink-0 group-hover/achievement:scale-125 group-hover/achievement:rotate-12 transition-all duration-300"
                              />
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {expandedCard !== index && (
                        <div className="space-y-3">
                          {exp.achievements.slice(0, 2).map((achievement, achIndex) => (
                            <div
                              key={achIndex}
                              className="flex items-center gap-4 text-zinc-400"
                            >
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${exp.gradient}`} />
                              <span className="truncate">{achievement}</span>
                            </div>
                          ))}
                          <button
                            onClick={() => setExpandedCard(index)}
                            className="text-purple-400 hover:text-purple-300 font-bold transition-colors"
                          >
                            +{exp.achievements.length - 2} more achievements
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Technologies */}
                    <div className="mt-8">
                      <div className="flex items-center gap-2 mb-6">
                        <Code size={24} className="text-cyan-400" />
                        <h4 className="font-black text-white text-xl">TECHNOLOGIES</h4>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {exp.technologies.map((tech, techIndex) => (
                          <Badge
                            key={techIndex}
                            variant="secondary"
                            className="px-5 py-3 glass text-zinc-300 hover:text-white hover:glass-dark hover:scale-110 transition-all duration-300 border-0 text-sm font-semibold cursor-default"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Card */}
        <div
          className="mt-16 glass rounded-3xl p-12 text-center card-shine transition-all duration-1000"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(60px)',
            transitionDelay: '0.8s'
          }}
        >
          <div className="inline-flex p-4 rounded-3xl bg-gradient-to-r from-purple-500 to-blue-500 mb-6 animate-bounce-soft shadow-2xl shadow-purple-500/30">
            <Rocket size={32} className="text-white" />
          </div>
          <h3 className="text-3xl font-black text-white mb-6">
            Ready for the Next Challenge
          </h3>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            From intern to full-time developer, my journey has been defined by continuous learning and
            delivering impactful solutions. Always excited to take on new challenges.
          </p>
        </div>
      </div>
    </section>
  );
};
