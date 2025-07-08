
import React from 'react';
import { Code, Database, Globe, Brain, GitBranch } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const About = () => {
  const skills = [
    {
      category: 'Backend',
      icon: <Database className="h-6 w-6" />,
      technologies: ['Python', 'FastAPI', 'RESTful APIs', 'API Integration']
    },
    {
      category: 'AI & ML',
      icon: <Brain className="h-6 w-6" />,
      technologies: ['LLMs', 'RAG Systems', 'AI Frameworks', 'Machine Learning', 'NLP']
    },
    {
      category: 'Languages',
      icon: <Code className="h-6 w-6" />,
      technologies: ['Python', 'Java', 'C++', 'SQL']
    },
    {
      category: 'Tools',
      icon: <GitBranch className="h-6 w-6" />,
      technologies: ['VS Code', 'Git', 'Postman', 'Linux']
    },
    {
      category: 'Database',
      icon: <Database className="h-6 w-6" />,
      technologies: ['PostgreSQL', 'Alembic']
    }
  ];

  return (
    <section id="about" className="py-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">About Me</h2>
          <p className="text-lg text-zinc-300 max-w-3xl mx-auto">
            I'm a passionate Python Backend AI developer with 7 months of experience creating 
            intelligent solutions that make a difference. I love building scalable AI applications 
            and exploring the latest in machine learning and backend technologies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-4 text-white">My Journey</h3>
            <p className="text-zinc-300 leading-relaxed">
              Started my journey in AI and backend development with a passion for solving complex problems. 
              Over the past 7 months at Yavar Tech Works, I've worked on diverse projects ranging from 
              e-commerce platforms to healthcare solutions and intelligent chatbots.
            </p>
            <p className="text-zinc-300 leading-relaxed">
              I specialize in building robust backend systems with Python and FastAPI, integrating 
              AI capabilities through LLMs and RAG systems. My focus is on creating efficient, 
              scalable solutions that leverage the power of artificial intelligence.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold mb-4 text-white">Quick Facts</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-zinc-200">Experience:</span>
                <span className="text-zinc-300">7+ Months</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-zinc-200">Specialization:</span>
                <span className="text-zinc-300">AI Backend Development</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-zinc-200">Current Focus:</span>
                <span className="text-zinc-300">LLMs & RAG Systems</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-zinc-200">Location:</span>
                <span className="text-zinc-300">Chennai, India</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-8 text-center text-white">Skills & Technologies</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="text-blue-400 mr-3">
                      {skill.icon}
                    </div>
                    <h4 className="text-lg font-semibold text-white">{skill.category}</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skill.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-blue-600/20 text-blue-300 text-sm rounded-full border border-blue-600/30"
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
