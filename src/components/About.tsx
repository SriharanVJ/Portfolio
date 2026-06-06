import React from 'react';
import { Code, Database, Globe, Brain, GitBranch, Cpu, Zap, Terminal, Cloud } from 'lucide-react';

// Mock components for shadcn/ui to make the file runnable
const Card = ({ className = '', children }) => (
    <div className={`rounded-xl border shadow ${className}`}>{children}</div>
);
const CardContent = ({ children, className = '' }) => <div className={`p-6 ${className}`}>{children}</div>;

export const About = () => {
  const skills = [
    {
      category: 'Backend Development',
      icon: <Database className="h-6 w-6" />,
      technologies: ['Python', 'FastAPI', 'RESTful APIs', 'API Integration'],
      color: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10'
    },
    {
      category: 'AI & Machine Learning',
      icon: <Brain className="h-6 w-6" />,
      technologies: ['LLMs', 'RAG Systems', 'AI Frameworks', 'Machine Learning', 'NLP'],
      color: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/10 to-pink-500/10'
    },
    {
      category: 'Programming Languages',
      icon: <Code className="h-6 w-6" />,
      technologies: ['Python', 'Java', 'C++', 'SQL'],
      color: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/10 to-emerald-500/10'
    },
    {
      category: 'Tools & Platforms',
      icon: <Terminal className="h-6 w-6" />,
      technologies: ['VS Code', 'Git', 'Postman', 'Linux'],
      color: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-500/10 to-red-500/10'
    },
    {
      category: 'Databases',
      icon: <Database className="h-6 w-6" />,
      technologies: ['PostgreSQL', 'Alembic', 'NoSQL', 'Scylla'],
      color: 'from-yellow-500 to-amber-500',
      bgGradient: 'from-yellow-500/10 to-amber-500/10'
    },
    {
      category: 'Cloud & Integration',
      icon: <Cloud className="h-6 w-6" />,
      technologies: ['Livekit', 'Notification', 'SSO', 'Webhooks'],
      color: 'from-indigo-500 to-violet-500',
      bgGradient: 'from-indigo-500/10 to-violet-500/10'
    }
  ];

  const stats = [
    { value: '1+', label: 'Year Experience', icon: Zap },
    { value: '5+', label: 'AI Projects Built', icon: Cpu },
    { value: '10+', label: 'Technologies Learned', icon: Globe },
  ];

  return (
    <section id="about" className="py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 mesh-gradient opacity-50" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-2 glass rounded-full text-sm font-medium text-purple-400 mb-6">
            About Me
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-space">
            <span className="gradient-text-purple">Crafting Intelligent</span>
            <br />
            <span className="text-white">Solutions</span>
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            I'm a passionate Python Backend AI developer creating intelligent solutions that make a difference.
            I specialize in building scalable AI applications with modern technologies.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="glass card-hover text-center group"
            >
              <CardContent className="p-8">
                <div className="inline-flex p-3 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-4xl font-bold gradient-text-purple mb-2">{stat.value}</div>
                <div className="text-zinc-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Journey and Facts */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Journey */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-white font-space">
              My <span className="gradient-text-blue">Journey</span>
            </h3>
            <div className="space-y-4 text-zinc-300 leading-relaxed">
              <p>
                Started my journey in AI and backend development with a passion for solving complex problems.
                At Yavar Tech Works, I've worked on diverse projects ranging from e-commerce platforms
                to healthcare solutions and intelligent chatbots.
              </p>
              <p>
                I specialize in building robust backend systems with Python and FastAPI, integrating
                AI capabilities through LLMs and RAG systems. My focus is on creating efficient,
                scalable solutions that leverage the power of artificial intelligence.
              </p>
            </div>
          </div>

          {/* Quick Facts */}
          <div className="glass rounded-2xl p-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 font-space">
              Quick <span className="gradient-text-purple">Facts</span>
            </h3>
            <div className="space-y-6">
              {[
                { label: 'Experience', value: '1+ Year (Mar 2025 - Present)', color: 'from-blue-500 to-cyan-500' },
                { label: 'Previous', value: 'Internship (Nov 2024 - Feb 2025)', color: 'from-purple-500 to-pink-500' },
                { label: 'Current Focus', value: 'LLMs & RAG Systems', color: 'from-green-500 to-emerald-500' },
                { label: 'Location', value: 'Chennai, India', color: 'from-orange-500 to-red-500' },
              ].map((fact, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${fact.color}`} />
                  <div className="flex-1">
                    <div className="text-sm text-zinc-500">{fact.label}</div>
                    <div className="text-white font-medium">{fact.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 font-space">
              Education & <span className="gradient-text-purple">Certifications</span>
            </h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Education Cards */}
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
                percentage: '86% (Distinction)',
                gradient: 'from-blue-500 to-cyan-500',
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
                className="glass card-hover border-0 overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${edu.gradient} mr-4`}>
                      <span className="text-2xl">{edu.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">{edu.degree}</h4>
                      <p className="text-zinc-400 text-xs">{edu.period}</p>
                    </div>
                  </div>
                  <p className="text-zinc-300 text-sm mb-2">{edu.institution}</p>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${edu.gradient} bg-opacity-20`}>
                    <span className="text-xs font-medium text-white">{edu.percentage}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Certifications */}
          <div className="mt-8 glass rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-6 h-6 text-yellow-500" />
              <h4 className="text-xl font-bold text-white">Certifications & Achievements</h4>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                '🏆 Delivery Excellence Award - Yavar Tech Works',
                'Intermediate of Java - Infosys Springboard',
                'Basics of Data Science - Infosys Springboard',
                'Diploma in UiPath - UiPath Academy',
                '2nd Prize - National Level Technical Symposium, KIT Erode',
                'Treasurer - Department College Festivities',
                'Workshop - Business Intelligence using Power BI'
              ].map((cert, index) => (
                <div key={index} className="flex items-center gap-3 text-zinc-300">
                  <div className={`w-2 h-2 rounded-full ${cert.includes('🏆') ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-purple-500 to-blue-500'}`} />
                  <span className={`text-sm ${cert.includes('🏆') ? 'text-white font-semibold' : ''}`}>{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Grid */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 font-space">
              Skills & <span className="gradient-text">Technologies</span>
            </h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <Card
                key={index}
                className={`group card-hover glass border-0 overflow-hidden`}
              >
                <CardContent className={`p-6 bg-gradient-to-br ${skill.bgGradient}`}>
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${skill.color} mr-4 group-hover:scale-110 transition-transform`}>
                      <div className="text-white">
                        {skill.icon}
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold text-white">{skill.category}</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skill.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className={`px-3 py-1.5 text-sm rounded-full glass text-zinc-300 hover:text-white transition-colors`}
                      >
                        {tech}
                      </span>
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

