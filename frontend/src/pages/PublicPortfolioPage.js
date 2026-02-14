import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import portfolioService from '../services/portfolioService';
import Loading from '../components/Loading';

const PublicPortfolioPage = () => {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const data = await portfolioService.getBySlug(slug);
        setPortfolio(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Portfolio not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [slug]);

  if (loading) return <Loading />;
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/" className="btn-primary">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (!portfolio) return null;

  const { personalInfo, skills, projects, experience, education, socialLinks, theme } = portfolio;

  // Theme styles
  const themes = {
    modern: {
      gradient: 'from-blue-600 to-purple-600',
      accent: 'blue',
      bg: 'bg-white'
    },
    minimalist: {
      gradient: 'from-gray-800 to-gray-900',
      accent: 'gray',
      bg: 'bg-white'
    },
    creative: {
      gradient: 'from-pink-500 to-orange-500',
      accent: 'pink',
      bg: 'bg-gradient-to-br from-pink-50 to-orange-50'
    },
    professional: {
      gradient: 'from-indigo-600 to-blue-600',
      accent: 'indigo',
      bg: 'bg-gray-50'
    }
  };

  const currentTheme = themes[theme?.layout || 'modern'];

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      {/* Header Section */}
      <header className={`bg-gradient-to-r ${currentTheme.gradient} text-white py-20 px-4`}>
        <div className="max-w-6xl mx-auto text-center">
          {personalInfo.profilePicture && (
            <img
              src={personalInfo.profilePicture}
              alt={personalInfo.fullName}
              className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white shadow-xl object-cover"
            />
          )}
          <h1 className="text-5xl font-bold mb-4">{personalInfo.fullName}</h1>
          <p className="text-2xl mb-4 text-white/90">{personalInfo.tagline}</p>
          <p className="text-lg max-w-2xl mx-auto text-white/80 leading-relaxed">
            {personalInfo.bio}
          </p>
          
          {/* Contact Info */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-2 hover:text-white/80 transition">
              📧 {personalInfo.email}
            </a>
            <a href={`tel:${personalInfo.phone}`} className="flex items-center gap-2 hover:text-white/80 transition">
              📱 {personalInfo.phone}
            </a>
            <span className="flex items-center gap-2">
              📍 {personalInfo.location}
            </span>
          </div>

          {/* Social Links */}
          {socialLinks && (
            <div className="flex justify-center gap-4 mt-6">
              {socialLinks.github && (
                <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" 
                   className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition">
                  GitHub
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                   className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition">
                  LinkedIn
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                   className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition">
                  Twitter
                </a>
              )}
              {socialLinks.website && (
                <a href={socialLinks.website} target="_blank" rel="noopener noreferrer"
                   className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition">
                  Website
                </a>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Skills Section */}
        {skills && skills.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className={`text-${currentTheme.accent}-600`}>💼</span> Skills & Expertise
            </h2>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className={`px-4 py-2 bg-gradient-to-r ${currentTheme.gradient} text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition transform hover:scale-105`}
                  >
                    {skill.name || skill}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Projects Section */}
        {projects && projects.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className={`text-${currentTheme.accent}-600`}>🚀</span> Featured Projects
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition group">
                  <div className={`h-2 bg-gradient-to-r ${currentTheme.gradient}`}></div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                      {project.title || project.name}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>
                    {project.technologies && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-3">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-${currentTheme.accent}-600 hover:text-${currentTheme.accent}-700 font-medium text-sm flex items-center gap-1`}
                        >
                          🔗 Live Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-${currentTheme.accent}-600 hover:text-${currentTheme.accent}-700 font-medium text-sm flex items-center gap-1`}
                        >
                          💻 Source Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {experience && experience.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className={`text-${currentTheme.accent}-600`}>💼</span> Work Experience
            </h2>
            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
              {experience.map((exp, index) => (
                <div key={index} className="border-l-4 border-blue-600 pl-6 pb-6 last:pb-0">
                  <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                  <p className={`text-${currentTheme.accent}-600 font-semibold mb-2`}>{exp.company}</p>
                  <p className="text-gray-500 text-sm mb-3">
                    {exp.startDate} - {exp.endDate || 'Present'} {exp.location && `• ${exp.location}`}
                  </p>
                  <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {education && education.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className={`text-${currentTheme.accent}-600`}>🎓</span> Education
            </h2>
            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
              {education.map((edu, index) => (
                <div key={index} className="border-l-4 border-green-600 pl-6 pb-6 last:pb-0">
                  <h3 className="text-xl font-bold text-gray-900">{edu.degree}</h3>
                  <p className={`text-${currentTheme.accent}-600 font-semibold mb-2`}>{edu.institution}</p>
                  <p className="text-gray-500 text-sm mb-3">
                    {edu.startDate} - {edu.endDate} {edu.grade && `• ${edu.grade}`}
                  </p>
                  {edu.description && (
                    <p className="text-gray-700 leading-relaxed">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} {personalInfo.fullName}. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Created with AI Portfolio Generator
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicPortfolioPage;
