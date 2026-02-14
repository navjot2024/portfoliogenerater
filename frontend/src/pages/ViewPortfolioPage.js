import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import portfolioService from '../services/portfolioService';
import Loading from '../components/Loading';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ViewPortfolioPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);
  const portfolioRef = useRef(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const response = await portfolioService.getPortfolio(id);
        console.log('Portfolio data received:', response.data);
        setPortfolio(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Portfolio not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [id]);

  const handleExport = async (format) => {
    try {
      setExporting(true);
      let blob;
      
      if (format === 'pdf') {
        // Generate PDF from the portfolio view
        const element = portfolioRef.current;
        if (!element) {
          alert('Portfolio content not found');
          return;
        }

        // Capture the element as canvas
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 0;

        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save(`${portfolio.personalInfo.fullName.replace(/\s+/g, '-')}-Portfolio.pdf`);
        
      } else if (format === 'html') {
        const response = await portfolioService.exportHTML(id);
        blob = new Blob([response], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${portfolio.slug || 'portfolio'}.html`;
        a.click();
      } else if (format === 'json') {
        const response = await portfolioService.exportJSON(id);
        blob = new Blob([JSON.stringify(response, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${portfolio.slug || 'portfolio'}.json`;
        a.click();
      }
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export portfolio: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const copyPublicLink = () => {
    const publicUrl = `${window.location.origin}/p/${portfolio.slug}`;
    navigator.clipboard.writeText(publicUrl);
    alert('Public link copied to clipboard!');
  };

  if (loading) return <Loading />;
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/dashboard" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!portfolio) return null;

  const { projects, analytics, personalInfo, skills, experience, education, certificates } = portfolio;
  const publicUrl = `${window.location.origin}/portfolio/${portfolio.slug}`;

  console.log('Rendering portfolio sections:', {
    skills: skills?.length || 0,
    projects: projects?.length || 0,
    experience: experience?.length || 0,
    education: education?.length || 0,
    certificates: certificates?.length || 0
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header with Actions */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
              >
                ← Back to Dashboard
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-gray-900">{portfolio.title}</h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => window.open(publicUrl, '_blank')}
                className="btn-secondary flex items-center gap-2"
              >
                👁️ View Public
              </button>
              <button
                onClick={copyPublicLink}
                className="btn-secondary flex items-center gap-2"
              >
                🔗 Copy Link
              </button>
              <button
                onClick={() => handleExport('pdf')}
                disabled={exporting}
                className="btn-secondary flex items-center gap-2 bg-red-500 text-white hover:bg-red-600"
              >
                📄 Download PDF
              </button>
              <button
                onClick={() => navigate(`/edit/${id}`)}
                className="btn-primary flex items-center gap-2"
              >
                ✏️ Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Analytics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-100">Total Views</span>
              <span className="text-3xl">👁️</span>
            </div>
            <p className="text-4xl font-bold">{analytics?.views || 0}</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-100">Status</span>
              <span className="text-3xl">📊</span>
            </div>
            <p className="text-2xl font-bold capitalize">{portfolio.status}</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-100">Projects</span>
              <span className="text-3xl">🚀</span>
            </div>
            <p className="text-4xl font-bold">{projects?.length || 0}</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-orange-100">Skills</span>
              <span className="text-3xl">💼</span>
            </div>
            <p className="text-4xl font-bold">{portfolio.skills?.length || 0}</p>
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            📥 Export Options
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <button
              onClick={() => handleExport('pdf')}
              disabled={exporting}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-xl hover:from-red-600 hover:to-red-700 transition shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              <div className="text-3xl mb-2">📄</div>
              <div className="font-bold text-lg">Download PDF</div>
              <div className="text-sm text-red-100 mt-1">Portable document</div>
            </button>
            
            <button
              onClick={() => handleExport('html')}
              disabled={exporting}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              <div className="text-3xl mb-2">🌐</div>
              <div className="font-bold text-lg">Export as HTML</div>
              <div className="text-sm text-blue-100 mt-1">Static website file</div>
            </button>
            
            <button
              onClick={() => handleExport('json')}
              disabled={exporting}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl hover:from-green-600 hover:to-green-700 transition shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              <div className="text-3xl mb-2">📋</div>
              <div className="font-bold text-lg">Export as JSON</div>
              <div className="text-sm text-green-100 mt-1">Raw data format</div>
            </button>
            
            <button
              onClick={() => alert('React export coming soon!')}
              disabled={exporting}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              <div className="text-3xl mb-2">⚛️</div>
              <div className="font-bold text-lg">Export as React</div>
              <div className="text-sm text-purple-100 mt-1">Coming soon</div>
            </button>
          </div>
        </div>

        {/* Portfolio Preview */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            👁️ Portfolio Preview
          </h2>
          
          {/* Actual Portfolio Content */}
          <div ref={portfolioRef} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-8 border-2 border-gray-200">
            {/* Personal Info Section */}
            <div className="text-center mb-8">
              {personalInfo?.profileImage && (
                <img 
                  src={personalInfo.profileImage} 
                  alt={personalInfo.fullName}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg"
                />
              )}
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {personalInfo?.fullName || 'No Name'}
              </h1>
              {personalInfo?.tagline && (
                <p className="text-xl text-gray-600 mb-4">{personalInfo.tagline}</p>
              )}
              <div className="flex flex-wrap justify-center gap-4 text-gray-600">
                {personalInfo?.email && (
                  <span className="flex items-center gap-2">
                    📧 {personalInfo.email}
                  </span>
                )}
                {personalInfo?.phone && (
                  <span className="flex items-center gap-2">
                    📱 {personalInfo.phone}
                  </span>
                )}
                {personalInfo?.location && (
                  <span className="flex items-center gap-2">
                    📍 {personalInfo.location}
                  </span>
                )}
              </div>
            </div>

            {/* Bio Section */}
            {personalInfo?.bio && (
              <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-3">About Me</h3>
                <p className="text-gray-700 leading-relaxed">
                  {personalInfo.aiEnhancedBio || personalInfo.bio}
                </p>
              </div>
            )}

            {/* Skills Section */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">💼 Skills</h3>
              {skills && skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {skill.name} {skill.proficiency && `(${skill.proficiency}%)`}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No skills added yet</p>
              )}
            </div>

            {/* Projects Section */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🚀 Projects</h3>
              {projects && projects.length > 0 ? (
                <div className="grid gap-4">
                  {projects.map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        {project.title}
                      </h4>
                      <p className="text-gray-600 mb-3">
                        {project.aiEnhancedDescription || project.description}
                      </p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {project.technologies.map((tech, techIndex) => (
                            <span 
                              key={techIndex}
                              className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm"
                            >
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
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            🔗 Live Demo
                          </a>
                        )}
                        {project.githubUrl && (
                          <a 
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                          >
                            💻 GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No projects added yet</p>
              )}
            </div>

            {/* Experience Section */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">💼 Work Experience</h3>
              {experience && experience.length > 0 ? (
                <div className="space-y-4">
                  {experience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="text-lg font-bold text-gray-900">{exp.position}</h4>
                      <p className="text-gray-600 font-medium">{exp.company}</p>
                      <p className="text-sm text-gray-500 mb-2">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </p>
                      {exp.description && (
                        <p className="text-gray-700">
                          {exp.aiEnhancedDescription || exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No work experience added yet</p>
              )}
            </div>

            {/* Education Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🎓 Education</h3>
              {education && education.length > 0 ? (
                <div className="space-y-4">
                  {education.map((edu, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4">
                      <h4 className="text-lg font-bold text-gray-900">{edu.degree}</h4>
                      <p className="text-gray-600 font-medium">{edu.institution}</p>
                      {edu.field && (
                        <p className="text-gray-600">{edu.field}</p>
                      )}
                      <p className="text-sm text-gray-500">
                        {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                        {edu.gpa && ` • GPA: ${edu.gpa}`}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No education added yet</p>
              )}
            </div>

            {/* Certificates Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🏆 Certificates & Achievements</h3>
              {certificates && certificates.length > 0 ? (
                <div className="space-y-4">
                  {certificates.map((cert, index) => (
                    <div key={index} className="border-l-4 border-yellow-500 pl-4">
                      <h4 className="text-lg font-bold text-gray-900">{cert.name}</h4>
                      <p className="text-gray-600 font-medium">{cert.issuer}</p>
                      <p className="text-sm text-gray-500">
                        Issued: {cert.issueDate}
                        {cert.credentialId && ` • ID: ${cert.credentialId}`}
                      </p>
                      {cert.credentialUrl && (
                        <a 
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          🔗 View Credential
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No certificates added yet</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4 text-sm text-gray-600">
            <span>🔗 Public URL:</span>
            <code className="flex-1 bg-gray-100 px-4 py-2 rounded-lg font-mono text-xs">
              {publicUrl}
            </code>
            <button
              onClick={copyPublicLink}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Copy
            </button>
            <button
              onClick={() => window.open(publicUrl, '_blank')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Open in New Tab
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPortfolioPage;
