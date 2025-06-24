
import React from 'react';
import { Calendar, MapPin, Building } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const Experience = () => {
  const experiences = [
    {
      company: 'TechCorp Solutions',
      position: 'Senior Full-Stack Developer',
      duration: '2022 - Present',
      location: 'San Francisco, CA',
      description: 'Led development of enterprise-scale web applications serving 100k+ users. Architected microservices infrastructure and mentored junior developers.',
      achievements: [
        'Improved application performance by 40% through code optimization',
        'Led team of 5 developers in agile development practices',
        'Implemented CI/CD pipelines reducing deployment time by 60%'
      ],
      technologies: ['React', 'Node.js', 'AWS', 'Docker', 'PostgreSQL']
    },
    {
      company: 'StartupXYZ',
      position: 'Full-Stack Developer',
      duration: '2020 - 2022',
      location: 'Remote',
      description: 'Built the core product from scratch using modern web technologies. Collaborated with designers and product managers to deliver user-centric solutions.',
      achievements: [
        'Developed MVP that secured $2M in Series A funding',
        'Built real-time chat system handling 10k+ concurrent users',
        'Reduced API response time by 50% through database optimization'
      ],
      technologies: ['Vue.js', 'Express', 'MongoDB', 'Socket.io', 'Redis']
    },
    {
      company: 'Digital Agency Inc',
      position: 'Frontend Developer',
      duration: '2019 - 2020',
      location: 'New York, NY',
      description: 'Developed responsive websites and web applications for various clients. Focused on creating pixel-perfect, accessible user interfaces.',
      achievements: [
        'Delivered 15+ client projects with 100% on-time completion',
        'Improved website loading speed by 35% on average',
        'Implemented accessibility standards achieving WCAG 2.1 compliance'
      ],
      technologies: ['HTML/CSS', 'JavaScript', 'React', 'Sass', 'Webpack']
    }
  ];

  return (
    <section id="experience" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            My professional journey building software solutions and leading development teams.
          </p>
        </div>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-primary">{exp.position}</h3>
                    <div className="flex items-center text-lg font-medium mt-1">
                      <Building className="h-4 w-4 mr-2" />
                      {exp.company}
                    </div>
                  </div>
                  <div className="flex flex-col md:items-end mt-2 md:mt-0">
                    <div className="flex items-center text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      {exp.duration}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      {exp.location}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {exp.description}
                </p>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Key Achievements:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {exp.achievements.map((achievement, achIndex) => (
                      <li key={achIndex}>{achievement}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Technologies:</h4>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
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
