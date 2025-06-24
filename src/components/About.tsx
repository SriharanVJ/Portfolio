
import React from 'react';
import { Code, Database, Globe, Smartphone, Cloud, GitBranch } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const About = () => {
  const skills = [
    {
      category: 'Frontend',
      icon: <Globe className="h-6 w-6" />,
      technologies: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Vue.js']
    },
    {
      category: 'Backend',
      icon: <Database className="h-6 w-6" />,
      technologies: ['Node.js', 'Python', 'Express', 'PostgreSQL', 'MongoDB']
    },
    {
      category: 'Mobile',
      icon: <Smartphone className="h-6 w-6" />,
      technologies: ['React Native', 'Flutter', 'iOS', 'Android']
    },
    {
      category: 'Cloud & DevOps',
      icon: <Cloud className="h-6 w-6" />,
      technologies: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform']
    },
    {
      category: 'Tools',
      icon: <GitBranch className="h-6 w-6" />,
      technologies: ['Git', 'VS Code', 'Figma', 'Postman', 'Jest']
    },
    {
      category: 'Languages',
      icon: <Code className="h-6 w-6" />,
      technologies: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go']
    }
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            I'm a passionate full-stack developer with 5+ years of experience creating 
            digital solutions that make a difference. I love turning complex problems 
            into simple, beautiful, and intuitive designs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-4">My Journey</h3>
            <p className="text-muted-foreground leading-relaxed">
              Started my journey in computer science with a curiosity for how things work. 
              Over the years, I've worked with startups and established companies, 
              helping them build scalable applications and improve user experiences.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              I believe in writing clean, maintainable code and following best practices. 
              When I'm not coding, you'll find me exploring new technologies, contributing 
              to open source projects, or sharing knowledge with the developer community.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold mb-4">Quick Facts</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Experience:</span>
                <span className="text-muted-foreground">5+ Years</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Projects Completed:</span>
                <span className="text-muted-foreground">50+</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Current Focus:</span>
                <span className="text-muted-foreground">Full-Stack Development</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Location:</span>
                <span className="text-muted-foreground">San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-8 text-center">Skills & Technologies</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
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
