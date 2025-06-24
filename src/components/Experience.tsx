
import React from 'react';
import { Calendar, MapPin, Building } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const Experience = () => {
  const experiences = [
    {
      company: 'Yavar Tech Works',
      position: 'Python Backend AI Developer',
      duration: '7 Months',
      location: 'Chennai, India',
      description: 'Developed AI-powered backend solutions using Python and FastAPI. Built intelligent systems with LLMs and RAG implementations for various client projects.',
      achievements: [
        'Built e-commerce platform with WhatsApp and Meta integrations',
        'Developed healthcare appointment system with AI chatbot',
        'Implemented RAG systems for intelligent document processing',
        'Created scalable backend APIs serving multiple client applications'
      ],
      technologies: ['Python', 'FastAPI', 'PostgreSQL', 'Alembic', 'LLMs', 'RAG', 'AI Frameworks']
    }
  ];

  return (
    <section id="experience" className="py-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Experience</h2>
          <p className="text-lg text-zinc-300 max-w-3xl mx-auto">
            My professional journey building AI-powered backend solutions and intelligent systems.
          </p>
        </div>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow bg-zinc-900 border-zinc-800">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-blue-400">{exp.position}</h3>
                    <div className="flex items-center text-lg font-medium mt-1 text-white">
                      <Building className="h-4 w-4 mr-2" />
                      {exp.company}
                    </div>
                  </div>
                  <div className="flex flex-col md:items-end mt-2 md:mt-0">
                    <div className="flex items-center text-zinc-300 mb-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      {exp.duration}
                    </div>
                    <div className="flex items-center text-zinc-300">
                      <MapPin className="h-4 w-4 mr-2" />
                      {exp.location}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-zinc-300 mb-4 leading-relaxed">
                  {exp.description}
                </p>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-white">Key Achievements:</h4>
                  <ul className="list-disc list-inside space-y-1 text-zinc-300">
                    {exp.achievements.map((achievement, achIndex) => (
                      <li key={achIndex}>{achievement}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-white">Technologies:</h4>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="bg-zinc-800 text-zinc-200 border-zinc-700">
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
