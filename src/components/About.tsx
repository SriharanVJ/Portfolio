
import React from 'react';
import { Code, Database, Globe, Brain, Cloud, GitBranch } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const About = () => {
  const skills = [
    {
      category: 'Backend',
      icon: <Database className="h-6 w-6" />,
      technologies: ['Python', 'FastAPI', 'PostgreSQL', 'Alembic', 'RESTful APIs']
    },
    {
      category: 'AI & ML',
      icon: <Brain className="h-6 w-6" />,
      technologies: ['LLMs', 'RAG Systems', 'AI Frameworks', 'Machine Learning', 'NLP']
    },
    {
      category: 'Languages',
      icon: <Code className="h-6 w-6" />,
      technologies: ['Python', 'Java', 'C++', 'SQL', 'JavaScript']
    },
    {
      category: 'Tools',
      icon: <GitBranch className="h-6 w-6" />,
      technologies: ['VS Code', 'Git', 'Postman', 'Docker', 'Linux']
    },
    {
      category: 'Databases',
      icon: <Database className="h-6 w-6" />,
      technologies: ['PostgreSQL', 'MongoDB', 'Redis', 'Database Design', 'Query Optimization']
    },
    {
      category: 'Cloud & DevOps',
      icon: <Cloud className="h-6 w-6" />,
      technologies: ['AWS', 'Docker', 'CI/CD', 'API Documentation', 'Testing']
    }
  ];

  return (
    <section id="about" className="py-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            I'm a passionate Python Backend AI developer with 1 year of experience creating 
            intelligent solutions that make a difference. I love building scalable AI applications 
            and exploring the latest in machine learning and backend technologies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-4">My Journey</h3>
            <p className="text-muted-foreground leading-relaxed">
              Started my journey in AI and backend development with a passion for solving complex problems. 
              Over the past year, I've worked on diverse projects ranging from e-commerce platforms 
              to healthcare solutions and intelligent chatbots.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              I specialize in building robust backend systems with Python and FastAPI, integrating 
              AI capabilities through LLMs and RAG systems. My focus is on creating efficient, 
              scalable solutions that leverage the power of artificial intelligence.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold mb-4">Quick Facts</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Experience:</span>
                <span className="text-muted-foreground">1 Year</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Specialization:</span>
                <span className="text-muted-foreground">AI Backend Development</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Current Focus:</span>
                <span className="text-muted-foreground">LLMs & RAG Systems</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Location:</span>
                <span className="text-muted-foreground">Chennai, India</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-8 text-center">Skills & Technologies</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow bg-white/70">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="text-primary mr-3">
                      {skill.icon}
                    </div>
                    <h4 className="text-lg font-semibold">{skill.category}</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skill.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
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
