
import React from 'react';
import { Calendar, MapPin, Building, Briefcase, Trophy, Code, Rocket, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const Experience = () => {
  const experiences = [
    {
      company: 'Yavar Tech Works',
      position: 'Python Backend AI Developer',
      duration: 'March 2025 - Present',
      type: 'Full-time',
      location: 'Chennai, India',
      description: "Full-time AI Backend Developer building intelligent solutions with Python, FastAPI, and LLMs. Leading development of RAG systems and AI-powered applications for enterprise clients.",
      gradient: 'from-purple-500 to-blue-500',
      achievements: [
        '🏆 Received Delivery Excellence Award for outstanding project delivery and performance',
        'Built RAG Chatbot System with 95% query accuracy using FAISS and Sentence Transformers',
        'Developed Healthcare Appointment System handling 500+ daily bookings with AI chatbot integration',
        'Implemented real-time TTS integration with 3-second timeout for enhanced user experience',
        'Created scalable FastAPI backends serving multiple production applications',
        'Integrated WhatsApp and Meta APIs for e-commerce customer communication'
      ],
      technologies: ['Python', 'FastAPI', 'PostgreSQL', 'FAISS', 'LLMs', 'RAG', 'Gemini 2.5 Flash']
    },
    {
      company: 'Yavar Tech Works',
      position: 'Python Backend AI Developer Intern',
      duration: 'November 2024 - February 2025',
      type: 'Internship',
      location: 'Chennai, India',
      description: "4-month internship focused on learning and implementing AI/ML solutions. Gained hands-on experience with FastAPI, RAG systems, and modern backend development practices.",
      gradient: 'from-green-500 to-emerald-500',
      achievements: [
        'Learned and implemented RAG systems using vector databases and embeddings',
        'Developed RESTful APIs using FastAPI with PostgreSQL integration',
        'Gained practical experience with LLM integration and prompt engineering',
        'Contributed to e-commerce platform backend development',
        'Built foundation in AI-powered chatbot systems'
      ],
      technologies: ['Python', 'FastAPI', 'PostgreSQL', 'LLMs', 'REST APIs', 'Alembic']
    }
  ];

  return (
    <section id="experience" className="py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 mesh-gradient opacity-30" />
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-2 glass rounded-full text-sm font-medium text-purple-400 mb-6">
            Experience
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-space">
            <span className="gradient-text-purple">Professional</span>
            <span className="text-white"> Journey</span>
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            My professional journey building AI-powered backend solutions and intelligent systems.
          </p>
        </div>

        {/* Single Large Card Layout */}
        <div className="max-w-5xl mx-auto">
          {experiences.map((exp, index) => (
            <Card
              key={index}
              className="glass border-0 overflow-hidden card-hover"
            >
              {/* Top Gradient Bar */}
              <div className={`h-2 bg-gradient-to-r ${exp.gradient}`} />

              <CardContent className="p-8 md:p-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${exp.gradient}`}>
                        <Building size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white">
                          {exp.position}
                        </h3>
                        <p className="text-zinc-400 text-lg">{exp.company}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 glass rounded-full">
                      <Briefcase size={16} className="text-purple-400" />
                      <span className="text-white font-medium">{exp.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 glass rounded-full">
                      <MapPin size={16} className="text-blue-400" />
                      <span className="text-white">{exp.location}</span>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${exp.gradient}`}>
                      <span className="text-white text-sm font-medium">{exp.type}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-zinc-300 text-lg leading-relaxed mb-8">
                  {exp.description}
                </p>

                {/* Award Badge for Full-time role */}
                {exp.type === 'Full-time' && (
                  <div className="mb-8 p-4 glass rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500">
                        <Award size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="text-white font-semibold">🏆 Delivery Excellence Award</div>
                        <div className="text-zinc-400 text-sm">Recognized for outstanding project delivery and performance</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Two Column Layout for Achievements and Technologies */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Key Achievements */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Trophy size={20} className="text-yellow-500" />
                      <h4 className="font-semibold text-white text-lg">Key Achievements</h4>
                    </div>
                    <ul className="space-y-3">
                      {exp.achievements.map((achievement, achIndex) => (
                        <li key={achIndex} className="flex items-start gap-3 text-zinc-400">
                          <Rocket size={16} className="text-purple-400 mt-1 flex-shrink-0" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Code size={20} className="text-blue-400" />
                      <h4 className="font-semibold text-white text-lg">Technologies</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, techIndex) => (
                        <Badge
                          key={techIndex}
                          variant="secondary"
                          className="px-4 py-2 glass text-zinc-300 hover:text-white hover:bg-white/10 transition-all border-0 text-sm"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
