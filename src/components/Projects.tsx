import React from 'react';
import { ExternalLink, Github, ArrowRight, Store, Hospital } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const Projects = () => {
  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'A comprehensive e-commerce solution with FastAPI backend, WhatsApp integration for customer communication, and Meta integration for social commerce features.',
      image: 'https://m.media-amazon.com/images/G/31/amazonservices/Blog/What_is_an_E-commerce_business.jpg',
      technologies: ['FastAPI', 'WhatsApp Integration', 'Meta Integration', 'Python', 'PostgreSQL'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      featured: true
    },
    {
      title: 'Healthcare Appointment System',
      description: 'An intelligent healthcare platform with AI-powered chatbot for appointment booking and rescheduling. Streamlines patient-doctor interactions with automated scheduling.',
      image: 'https://media.istockphoto.com/id/1501183871/photo/doctors-registering-patients-at-the-hospital.jpg?s=612x612&w=0&k=20&c=mnjpoSNO69dNWp11zMmbmMx5S0ch4cG_d-8sMvKzKwI=',
      technologies: ['FastAPI', 'AI Chatbot', 'Appointment Booking', 'PostgreSQL', 'LLMs'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      featured: true
    },
    {
      title: 'Weather Dashboard',
      description: 'A responsive weather application with location-based forecasts, interactive maps, and historical data visualization.',
      image: 'https://s3-alpha.figma.com/hub/file/6422877612/800966cc-495a-4d7f-8afe-e5f2a3e89456-cover.png',
      technologies: ['React', 'Chart.js', 'OpenWeather API', 'PWA'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      featured: true
    },
    {
      title: 'RAG Chatbot System',
      description: 'Advanced Retrieval-Augmented Generation chatbot with intelligent document processing and context-aware responses for enhanced user interactions.',
      image: 'https://www.bluebi.com/wp-content/uploads/2023/05/BBI-x-Chatbot-Andy-1.jpg',
      technologies: ['Python', 'RAG', 'LLMs', 'FastAPI', 'AI Frameworks'],
      // liveUrl: 'https://example.com',
      // githubUrl: 'https://github.com',
      featured: true
    }
  ];
  return (
    <section id="projects" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Featured Projects</h2>
          <p className="text-lg text-zinc-300 max-w-3xl mx-auto">
            Here are some of my recent projects that showcase my skills in Python backend development
            and AI integration.
          </p>
        </div>

        <div className="grid gap-8">
          {/* Featured Projects */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {projects.filter(project => project.featured).map((project, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 overflow-hidden bg-zinc-900 border-zinc-800"
              >
                <div className="relative overflow-hidden bg-zinc-800 h-48 flex items-center justify-center">
                  {project.image && (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-48 w-full object-cover"
                    />
                  )}
                </div>

                <CardHeader>
                  <h3 className="text-xl font-semibold text-blue-300 group-hover:text-white transition-colors">
                    {project.title}
                  </h3>

                </CardHeader>

                <CardContent>
                  <p className="text-zinc-300 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, techIndex) => (
                      <Badge
                        key={techIndex}
                        variant="secondary"
                        className="bg-zinc-800 text-zinc-200 border-zinc-700"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Other Projects */}
          <div>
            {/* <h3 className="text-2xl font-semibold mb-6 text-white">Other Notable Projects</h3> */}
            <div className="grid md:grid-cols-2 gap-6">
              {projects.filter(project => !project.featured).map((project, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow bg-zinc-900 border-zinc-800"
                >
                  <CardHeader className="pb-3">
                    <h4 className="text-lg font-semibold text-white">{project.title}</h4>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-300 text-sm mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.technologies.slice(0, 3).map((tech, techIndex) => (
                        <Badge
                          key={techIndex}
                          variant="outline"
                          className="text-xs border-zinc-600 text-zinc-300"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-xs border-zinc-600 text-zinc-300"
                        >
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline text-sm flex items-center"
                      >
                        View Project <ArrowRight className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}