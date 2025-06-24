import React from 'react';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const Projects = () => {
  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution with React, Node.js, and Stripe integration. Features include user authentication, product management, shopping cart, and order tracking.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Tailwind CSS'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      featured: true
    },
    {
      title: 'Task Management App',
      description: 'A collaborative project management tool with real-time updates, drag-and-drop functionality, and team collaboration features.',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop',
      technologies: ['Vue.js', 'Express', 'Socket.io', 'PostgreSQL'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      featured: true
    },
    {
      title: 'Weather Dashboard',
      description: 'A responsive weather application with location-based forecasts, interactive maps, and historical data visualization.',
      image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&h=400&fit=crop',
      technologies: ['React', 'Chart.js', 'OpenWeather API', 'PWA'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      featured: false
    },
    {
      title: 'Social Media Analytics',
      description: 'Analytics dashboard for social media metrics with data visualization, automated reports, and performance insights.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      technologies: ['Next.js', 'D3.js', 'Python', 'Redis'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      featured: false
    }
  ];

  return (
    <section id="projects" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Here are some of my recent projects that showcase my skills and passion for creating 
            meaningful digital experiences.
          </p>
        </div>

        <div className="grid gap-8">
          {/* Featured Projects */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {projects.filter(project => project.featured).map((project, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <CardHeader>
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="flex gap-2">
                  <Button size="sm" asChild>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      Code
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Other Projects */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">Other Notable Projects</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.filter(project => !project.featured).map((project, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <h4 className="text-lg font-semibold">{project.title}</h4>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.technologies.slice(0, 3).map((tech, techIndex) => (
                        <Badge key={techIndex} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm flex items-center"
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
};
