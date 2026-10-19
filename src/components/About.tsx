import React, { useRef, useState, useEffect } from 'react';
import { Code, Database, Globe, Brain, Terminal, Cloud, Award, Zap, Cpu } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({ years: 0, projects: 0, tech: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animate counters
          const duration = 2000;
          const steps = 60;
          const interval = duration / steps;

          let currentStep = 0;
          const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            const easeOut = 1 - Math.pow(1 - progress, 3);

            setCounts({
              years: Math.floor(1 * easeOut),
              projects: Math.floor(5 * easeOut),
              tech: Math.floor(10 * easeOut)
            });

            if (currentStep >= steps) {
              clearInterval(timer);
              setCounts({ years: 1, projects: 5, tech: 10 });
            }
          }, interval);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const skills = [
    {
      category: 'Backend Development',
      icon: <Database className="h-6 w-6" />,
      technologies: [
        { name: 'Python', level: 95 },
        { name: 'FastAPI', level: 90 },
        { name: 'REST APIs', level: 88 },
        { name: 'API Integration', level: 85 }
      ],
      color: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10'
    },
    {
      category: 'AI & Machine Learning',
      icon: <Brain className="h-6 w-6" />,
      technologies: [
        { name: 'LLMs', level: 92 },
        { name: 'RAG Systems', level: 88 },
        { name: 'AI Frameworks', level: 85 },
        { name: 'NLP', level: 82 }
      ],
      color: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/10 to-pink-500/10'
    },
    {
      category: 'Programming Languages',
      icon: <Code className="h-6 w-6" />,
      technologies: [
        { name: 'Python', level: 95 },
        { name: 'Java', level: 75 },
        { name: 'C++', level: 70 },
        { name: 'SQL', level: 85 }
      ],
      color: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/10 to-emerald-500/10'
    },
    {
      category: 'Tools & Platforms',
      icon: <Terminal className="h-6 w-6" />,
      technologies: [
        { name: 'VS Code', level: 90 },
        { name: 'Git', level: 85 },
        { name: 'Postman', level: 88 },
        { name: 'Linux', level: 75 }
      ],
      color: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-500/10 to-red-500/10'
    },
    {
      category: 'Databases',
      icon: <Database className="h-6 w-6" />,
      technologies: [
        { name: 'PostgreSQL', level: 85 },
        { name: 'Alembic', level: 80 },
        { name: 'NoSQL', level: 75 },
        { name: 'Scylla', level: 70 }
      ],
      color: 'from-yellow-500 to-amber-500',
      bgGradient: 'from-yellow-500/10 to-amber-500/10'
    },
    {
      category: 'Cloud & Integration',
      icon: <Cloud className="h-6 w-6" />,
      technologies: [
        { name: 'Livekit', level: 80 },
        { name: 'Webhooks', level: 85 },
        { name: 'SSO', level: 78 },
        { name: 'APIs', level: 90 }
      ],
      color: 'from-indigo-500 to-violet-500',
      bgGradient: 'from-indigo-500/10 to-violet-500/10'
    }
  ];

  return (
    <section id="about" ref={sectionRef} className="py-32 relative overflow-hidden bg-[#030014]">
      {/* Background Elements */}
      <div className="absolute inset-0 mesh-gradient opacity-40" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-morphing-blob" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-morphing-blob animation-delay-2000" />

      {/* Scan Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-20"
            style={{
              top: `${25 + i * 50}%`,
              animation: `scan-line 6s linear infinite`,
              animationDelay: `${i * 3}s`,
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
            About Me
          </span>
          <h2
            className={`text-5xl md:text-6xl lg:text-7xl font-black mb-8 font-space transition-all duration-1000 ${
              isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-12'
            }`}
            style={{ animationDelay: '0.1s' }}
          >
            <span className="gradient-text-cyber text-glow-cyan">Crafting Intelligent</span>
            <br />
            <span className="text-white">Solutions</span>
          </h2>
          <p
            className={`text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto transition-all duration-1000 ${
              isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-12'
            }`}
            style={{ animationDelay: '0.2s' }}
          >
            Passionate Python Backend AI developer creating intelligent solutions with modern technologies
          </p>
        </div>

        {/* Animated Stats - Bold Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { value: `${counts.years}+`, label: 'Years Experience', icon: Zap, color: 'from-purple-500 to-blue-500' },
            { value: `${counts.projects}+`, label: 'AI Projects', icon: Cpu, color: 'from-cyan-500 to-blue-500' },
            { value: `${counts.tech}+`, label: 'Technologies', icon: Globe, color: 'from-pink-500 to-purple-500' }
          ].map((stat, index) => (
            <Card
              key={index}
              className="glass card-hover text-center group perspective-1000 gpu-accelerated transition-all duration-1000"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(60px) scale(0.9)',
                transitionDelay: `${0.3 + index * 0.15}s`
              }}
            >
              <CardContent className="p-10">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.color} mb-6 group-hover:scale-125 transition-transform duration-300 shadow-lg`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-6xl font-black gradient-text-cyber text-glow-cyan mb-4 counter-animate">
                  {stat.value}
                </div>
                <div className="text-lg text-zinc-400 font-semibold">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Journey and Facts */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Journey */}
          <div
            className="space-y-8 transition-all duration-1000"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-80px)',
              transitionDelay: '0.8s'
            }}
          >
            <h3 className="text-3xl md:text-4xl font-black text-white font-space">
              My <span className="gradient-text-cyber text-glow-cyan">Journey</span>
            </h3>
            <div className="space-y-6 text-zinc-300 leading-relaxed text-lg">
              <p className="glass-dark rounded-2xl p-6 card-shine">
                Started my journey in AI and backend development with a passion for solving complex problems.
                At Yavar Tech Works, I've worked on diverse projects ranging from e-commerce platforms
                to healthcare solutions and intelligent chatbots.
              </p>
              <p className="glass-dark rounded-2xl p-6 card-shine">
                I specialize in building robust backend systems with Python and FastAPI, integrating
                AI capabilities through LLMs and RAG systems. My focus is on creating efficient,
                scalable solutions that leverage the power of artificial intelligence.
              </p>
            </div>
          </div>

          {/* Quick Facts - Interactive */}
          <div
            className="glass rounded-3xl p-10 card-shine transition-all duration-1000"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(80px)',
              transitionDelay: '0.9s'
            }}
          >
            <h3 className="text-3xl md:text-4xl font-black text-white mb-10 font-space">
              Quick <span className="gradient-text-cyber text-glow-cyan">Facts</span>
            </h3>
            <div className="space-y-8">
              {[
                { label: 'Experience', value: '1+ Year (Mar 2025 - Present)', color: 'from-blue-500 to-cyan-500', icon: '💼' },
                { label: 'Previous', value: 'Internship (Nov 2024 - Feb 2025)', color: 'from-purple-500 to-pink-500', icon: '🚀' },
                { label: 'Current Focus', value: 'LLMs & RAG Systems', color: 'from-green-500 to-emerald-500', icon: '🎯' },
                { label: 'Location', value: 'Chennai, India', color: 'from-orange-500 to-red-500', icon: '📍' },
              ].map((fact, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-6 p-4 rounded-2xl hover:bg-white/5 transition-all duration-300 hover:translate-x-4 cursor-default"
                  style={{ animationDelay: `${1 + index * 0.1}s` }}
                >
                  <span className="text-3xl">{fact.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm text-zinc-500 font-semibold uppercase tracking-wide">{fact.label}</div>
                    <div className="text-xl text-white font-bold">{fact.value}</div>
                  </div>
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${fact.color} group-hover:scale-150 transition-transform shadow-lg`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3
              className={`text-4xl md:text-5xl font-black text-white mb-6 font-space transition-all duration-1000 ${
                isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-12'
              }`}
              style={{ animationDelay: '1.1s' }}
            >
              Education & <span className="gradient-text-cyber text-glow-cyan">Certifications</span>
            </h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                degree: 'B.E. Mechanical Engineering',
                institution: 'Erode Sengunthar Engineering College',
                period: '2021 - 2024',
                percentage: '76%',
                gradient: 'from-purple-500 to-pink-500',
                icon: '🎓'
              },
              {
                degree: 'Diploma in Mechanical Engineering',
                institution: 'Konghu Vellalar Polytechnic College',
                period: '2018 - 2021',
                percentage: '86% Distinction',
                gradient: 'from-cyan-500 to-blue-500',
                icon: '📜'
              },
              {
                degree: 'SSLC',
                institution: 'Government Boys Higher Secondary School',
                period: '2017 - 2018',
                percentage: '73%',
                gradient: 'from-green-500 to-emerald-500',
                icon: '🏫'
              }
            ].map((edu, index) => (
              <Card
                key={index}
                className="glass card-hover border-0 overflow-hidden card-3d group gpu-accelerated transition-all duration-1000"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(60px) scale(0.9)',
                  transitionDelay: `${1.2 + index * 0.15}s`
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
                  const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
                  e.currentTarget.style.setProperty('--rotate-x', `${y}deg`);
                  e.currentTarget.style.setProperty('--rotate-y', `${x}deg`);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.setProperty('--rotate-x', '0deg');
                  e.currentTarget.style.setProperty('--rotate-y', '0deg');
                }}
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${edu.gradient} mr-4 group-hover:scale-125 transition-transform duration-300 shadow-lg`}>
                      <span className="text-3xl">{edu.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{edu.degree}</h4>
                      <p className="text-zinc-400 text-sm">{edu.period}</p>
                    </div>
                  </div>
                  <p className="text-zinc-300 mb-4">{edu.institution}</p>
                  <div className={`inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-r ${edu.gradient} text-white font-bold shadow-lg`}>
                    {edu.percentage}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Certifications */}
          <div
            className="mt-12 glass rounded-3xl p-10 card-shine transition-all duration-1000"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
              transitionDelay: '1.6s'
            }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Award className="w-8 h-8 text-yellow-500" />
              <h4 className="text-2xl font-black text-white">Certifications & Achievements</h4>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { text: '🏆 Delivery Excellence Award - Yavar Tech Works', highlight: true },
                { text: 'Intermediate Java - Infosys Springboard', highlight: false },
                { text: 'Data Science Basics - Infosys Springboard', highlight: false },
                { text: 'Diploma in UiPath - UiPath Academy', highlight: false },
                { text: '2nd Prize - National Level Symposium', highlight: false },
                { text: 'Treasurer - Department College Festivities', highlight: false },
                { text: 'Workshop - Power BI Business Intelligence', highlight: false }
              ].map((cert, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-all duration-300 group cursor-default"
                  style={{ animationDelay: `${1.7 + index * 0.05}s` }}
                >
                  <div className={`w-3 h-3 rounded-full ${cert.highlight ? 'bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg shadow-yellow-500/50' : 'bg-gradient-to-r from-purple-500 to-blue-500'}`} />
                  <span className={`text-lg ${cert.highlight ? 'text-white font-black gradient-text-fire' : 'text-zinc-300'}`}>
                    {cert.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Grid with Bold Progress Bars */}
        <div>
          <div className="text-center mb-12">
            <h3
              className={`text-4xl md:text-5xl font-black text-white mb-6 font-space transition-all duration-1000 ${
                isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-12'
              }`}
              style={{ animationDelay: '1.8s' }}
            >
              Skills & <span className="gradient-text-cyber">Technologies</span>
            </h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <Card
                key={index}
                className="group card-hover glass border-0 overflow-hidden transition-all duration-1000 gpu-accelerated"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(60px)',
                  transitionDelay: `${1.9 + index * 0.1}s`
                }}
              >
                <CardContent className={`p-8`}>
                  <div className="flex items-center mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${skill.color} mr-4 group-hover:scale-125 transition-transform duration-300 shadow-lg`}>
                      <div className="text-white">
                        {skill.icon}
                      </div>
                    </div>
                    <h4 className="text-xl font-black text-white">{skill.category}</h4>
                  </div>

                  {/* Skill Pills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {skill.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-4 py-2 text-sm rounded-xl glass text-zinc-300 hover:text-white hover:glass-dark transition-all duration-300 cursor-default"
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>

                  {/* Bold Progress Bars */}
                  <div className="space-y-4">
                    {skill.technologies.slice(0, 4).map((tech, techIndex) => (
                      <div key={techIndex} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-400 font-semibold">{tech.name}</span>
                        </div>
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${skill.color} rounded-full shadow-lg transition-all duration-1500 ease-out`}
                            style={{
                              width: isVisible ? `${tech.level}%` : '0%',
                              transitionDelay: `${2.5 + index * 0.1 + techIndex * 0.1}s`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
