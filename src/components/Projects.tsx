import React from 'react';
import { ExternalLink, Github, ArrowRight, Store, Hospital, Sparkles } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const Projects = () => {
  const projects = [
    {
      title: 'RAG Chatbot System',
      description: 'Advanced Retrieval-Augmented Generation chatbot with intelligent document processing and context-aware responses for enhanced user interactions.',
      image: 'https://www.bluebi.com/wp-content/uploads/2023/05/BBI-x-Chatbot-Andy-1.jpg',
      technologies: ['Python', 'RAG', 'LLMs', 'FastAPI', 'AI Frameworks'],
      gradient: 'from-orange-500 to-red-500',
      featured: true
    },
    {
      title: 'E-Commerce Platform',
      description: 'A comprehensive e-commerce solution with FastAPI backend, WhatsApp integration for customer communication, and Meta integration for social commerce features.',
      image: 'https://m.media-amazon.com/images/G/31/amazonservices/Blog/What_is_an_E-commerce_business.jpg',
      technologies: ['FastAPI', 'WhatsApp Integration', 'Meta Integration', 'Python', 'PostgreSQL'],
      gradient: 'from-blue-500 to-cyan-500',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/sriharanvj/ecommerce-platform',
      featured: true
    },
    {
      title: 'Healthcare Appointment System',
      description: 'An intelligent healthcare platform with AI-powered chatbot for appointment booking and rescheduling. Streamlines patient-doctor interactions with automated scheduling.',
      image: 'https://media.istockphoto.com/id/1501183871/photo/doctors-registering-patients-at-the-hospital.jpg?s=612x612&w=0&k=20&c=mnjpoSNO69dNWp11zMmbmMx5S0ch4cG_d-8sMvKzKwI=',
      technologies: ['FastAPI', 'AI Chatbot', 'Appointment Booking', 'PostgreSQL', 'LLMs'],
      gradient: 'from-purple-500 to-pink-500',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/sriharanvj/healthcare-appointment-system',
      featured: true
    },
    {
      title: 'Weather Dashboard',
      description: 'A responsive weather application with location-based forecasts, interactive maps, and historical data visualization.',
      image: 'https://s3-alpha.figma.com/hub/file/6422877612/800966cc-495a-4d7f-8afe-e5f2a3e89456-cover.png',
      technologies: ['React', 'Chart.js', 'OpenWeather API', 'PWA'],
      gradient: 'from-green-500 to-emerald-500',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/sriharanvj/weather-dashboard',
      featured: true
    }
  ];

  return (
    <section id="projects" className="py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 mesh-gradient opacity-30" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-2 glass rounded-full text-sm font-medium text-purple-400 mb-6">
            Featured Projects
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-space">
            <span className="gradient-text-blue">Recent</span>
            <span className="text-white"> Work</span>
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            Here are some of my recent projects that showcase my skills in Python backend development
            and AI integration.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {projects.filter(project => project.featured).map((project, index) => (
            <Card
              key={index}
              className="group gradient-border overflow-hidden bg-zinc-900/50 border-0 card-hover"
            >
              {/* Project Image */}
              <div className="relative h-56 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-20 group-hover:opacity-30 transition-opacity`} />
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}
              </div>

              {/* Project Content */}
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:gradient-text-blue transition-all">
                      {project.title}
                    </h3>
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r ${project.gradient} text-white text-xs font-medium`}>
                      <Sparkles size={12} />
                      Featured Project
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-zinc-400 leading-relaxed mb-6">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <Badge
                      key={techIndex}
                      variant="secondary"
                      className="px-3 py-1 glass text-zinc-300 hover:text-white transition-colors border-0"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <Card className="glass max-w-2xl mx-auto">
            <CardContent className="p-8">
              <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Want to see more?
              </h3>
              <p className="text-zinc-400 mb-6">
                Check out my GitHub for more projects and contributions.
              </p>
              <Button
                asChild
                size="lg"
                className="btn-primary rounded-full"
              >
                <a
                  href="https://github.com/sriharanvj"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-5 w-5" />
                  View GitHub Profile
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}