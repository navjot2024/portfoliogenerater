import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import portfolioService from '../services/portfolioService';
import Loading from '../components/Loading';

const EditPortfolioPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [useAI, setUseAI] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      tagline: '',
      bio: '',
      profileImage: ''
    },
    skills: [],
    projects: [],
    experience: [],
    education: [],
    certificates: [],
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      website: ''
    }
  });

  const [skillInput, setSkillInput] = useState('');

  const [projectInput, setProjectInput] = useState({
    title: '',
    description: '',
    technologies: '',
    liveUrl: '',
    githubUrl: ''
  });

  const [experienceInput, setExperienceInput] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  const [educationInput, setEducationInput] = useState({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    current: false,
    gpa: ''
  });

  const [certificateInput, setCertificateInput] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    credentialId: '',
    credentialUrl: ''
  });

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const response = await portfolioService.getPortfolio(id);
        const portfolioData = response.data;
        
        // Populate form with existing data
        setFormData({
          title: portfolioData.title || '',
          personalInfo: portfolioData.personalInfo || {},
          skills: portfolioData.skills || [],
          projects: portfolioData.projects || [],
          experience: portfolioData.experience || [],
          education: portfolioData.education || [],
          certificates: portfolioData.certificates || [],
          socialLinks: portfolioData.socialLinks || {}
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [id]);

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, { 
          name: skillInput,
          category: 'Other',
          proficiency: 70 
        }]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addProject = () => {
    if (projectInput.title.trim() && projectInput.description.trim()) {
      setFormData(prev => ({
        ...prev,
        projects: [...prev.projects, {
          ...projectInput,
          technologies: projectInput.technologies.split(',').map(t => t.trim()).filter(Boolean)
        }]
      }));
      setProjectInput({ title: '', description: '', technologies: '', liveUrl: '', githubUrl: '' });
    }
  };

  const removeProject = (index) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const addExperience = () => {
    if (experienceInput.company.trim() && experienceInput.position.trim()) {
      setFormData(prev => ({
        ...prev,
        experience: [...prev.experience, { ...experienceInput }]
      }));
      setExperienceInput({ company: '', position: '', startDate: '', endDate: '', current: false, description: '' });
    }
  };

  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    if (educationInput.institution.trim() && educationInput.degree.trim()) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, { ...educationInput }]
      }));
      setEducationInput({ institution: '', degree: '', field: '', startDate: '', endDate: '', current: false, gpa: '' });
    }
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addCertificate = () => {
    if (certificateInput.name.trim() && certificateInput.issuer.trim()) {
      setFormData(prev => ({
        ...prev,
        certificates: [...prev.certificates, { ...certificateInput }]
      }));
      setCertificateInput({ name: '', issuer: '', issueDate: '', credentialId: '', credentialUrl: '' });
    }
  };

  const removeCertificate = (index) => {
    setFormData(prev => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    // Validate required fields
    if (!formData.personalInfo.fullName) {
      setError('Full Name is required');
      setSaving(false);
      return;
    }
    if (!formData.personalInfo.email) {
      setError('Email is required');
      setSaving(false);
      return;
    }

    try {
      await portfolioService.updatePortfolio(id, formData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Portfolio update error:', err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Failed to update portfolio';
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading message="Loading portfolio..." />;

  if (error && !formData.personalInfo.fullName) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Portfolio</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Portfolio</h1>
              <p className="text-gray-600 text-lg">Update your portfolio information</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-lg p-6 fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio Title</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Frontend Developer Portfolio"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.personalInfo.fullName}
                    onChange={(e) => handleChange('personalInfo', 'fullName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    className="input-field"
                    value={formData.personalInfo.email}
                    onChange={(e) => handleChange('personalInfo', 'email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    className="input-field"
                    value={formData.personalInfo.phone}
                    onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.personalInfo.location}
                    onChange={(e) => handleChange('personalInfo', 'location', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Professional Tagline</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.personalInfo.tagline}
                  onChange={(e) => handleChange('personalInfo', 'tagline', e.target.value)}
                  placeholder="e.g., Full Stack Developer | React Expert"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  className="input-field"
                  rows="4"
                  value={formData.personalInfo.bio}
                  onChange={(e) => handleChange('personalInfo', 'bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-xl shadow-lg p-6 fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">💼 Skills</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  className="input-field flex-1"
                  placeholder="Type skill name (e.g., React, Python, Communication)"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="btn-primary whitespace-nowrap px-6"
                >
                  ➕ Add
                </button>
              </div>
              
              {formData.skills.length > 0 ? (
                <div className="space-y-2 mt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Your Skills:</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                        {skill.name}
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="text-red-600 hover:text-red-800 ml-1 font-bold"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic text-center py-4">No skills added yet. Type and add your skills!</p>
              )}
            </div>
          </div>

          {/* Projects */}
          <div className="bg-white rounded-xl shadow-lg p-6 fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🚀 Projects</h2>
            <div className="space-y-4">
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <input
                  type="text"
                  className="input-field"
                  placeholder="Project Title *"
                  value={projectInput.title}
                  onChange={(e) => setProjectInput(prev => ({ ...prev, title: e.target.value }))}
                />
                <textarea
                  className="input-field"
                  rows="3"
                  placeholder="Project Description *"
                  value={projectInput.description}
                  onChange={(e) => setProjectInput(prev => ({ ...prev, description: e.target.value }))}
                />
                <input
                  type="text"
                  className="input-field"
                  placeholder="Technologies (comma separated)"
                  value={projectInput.technologies}
                  onChange={(e) => setProjectInput(prev => ({ ...prev, technologies: e.target.value }))}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="url"
                    className="input-field"
                    placeholder="Live URL"
                    value={projectInput.liveUrl}
                    onChange={(e) => setProjectInput(prev => ({ ...prev, liveUrl: e.target.value }))}
                  />
                  <input
                    type="url"
                    className="input-field"
                    placeholder="GitHub URL"
                    value={projectInput.githubUrl}
                    onChange={(e) => setProjectInput(prev => ({ ...prev, githubUrl: e.target.value }))}
                  />
                </div>
                <button
                  type="button"
                  onClick={addProject}
                  className="btn-primary w-full"
                >
                  Add Project
                </button>
              </div>
              
              {formData.projects.length > 0 && (
                <div className="space-y-3 mt-4">
                  {formData.projects.map((project, index) => (
                    <div key={index} className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-900">{project.title}</h4>
                          <p className="text-sm text-gray-600">{project.description}</p>
                          {project.technologies && project.technologies.length > 0 && (
                            <p className="text-sm text-blue-600 mt-1">
                              {Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeProject(index)}
                          className="text-red-600 hover:text-red-800 font-bold text-xl"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Work Experience */}
          <div className="bg-white rounded-xl shadow-lg p-6 fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">💼 Work Experience</h2>
            <div className="space-y-4">
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Company *"
                    value={experienceInput.company}
                    onChange={(e) => setExperienceInput(prev => ({ ...prev, company: e.target.value }))}
                  />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Position *"
                    value={experienceInput.position}
                    onChange={(e) => setExperienceInput(prev => ({ ...prev, position: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="month"
                    className="input-field"
                    placeholder="Start Date"
                    value={experienceInput.startDate}
                    onChange={(e) => setExperienceInput(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                  <input
                    type="month"
                    className="input-field"
                    placeholder="End Date"
                    value={experienceInput.endDate}
                    disabled={experienceInput.current}
                    onChange={(e) => setExperienceInput(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={experienceInput.current}
                    onChange={(e) => setExperienceInput(prev => ({ ...prev, current: e.target.checked, endDate: e.target.checked ? '' : prev.endDate }))}
                  />
                  <span className="text-sm text-gray-700">Currently Working</span>
                </label>
                <textarea
                  className="input-field"
                  rows="3"
                  placeholder="Description"
                  value={experienceInput.description}
                  onChange={(e) => setExperienceInput(prev => ({ ...prev, description: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={addExperience}
                  className="btn-primary w-full"
                >
                  Add Experience
                </button>
              </div>
              
              {formData.experience.length > 0 && (
                <div className="space-y-3 mt-4">
                  {formData.experience.map((exp, index) => (
                    <div key={index} className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-900">{exp.position} at {exp.company}</h4>
                          <p className="text-sm text-gray-600">
                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                          </p>
                          {exp.description && <p className="text-sm text-gray-700 mt-1">{exp.description}</p>}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExperience(index)}
                          className="text-red-600 hover:text-red-800 font-bold text-xl"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-xl shadow-lg p-6 fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🎓 Education</h2>
            <div className="space-y-4">
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Institution *"
                    value={educationInput.institution}
                    onChange={(e) => setEducationInput(prev => ({ ...prev, institution: e.target.value }))}
                  />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Degree *"
                    value={educationInput.degree}
                    onChange={(e) => setEducationInput(prev => ({ ...prev, degree: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Field of Study"
                    value={educationInput.field}
                    onChange={(e) => setEducationInput(prev => ({ ...prev, field: e.target.value }))}
                  />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="GPA"
                    value={educationInput.gpa}
                    onChange={(e) => setEducationInput(prev => ({ ...prev, gpa: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="month"
                    className="input-field"
                    placeholder="Start Date"
                    value={educationInput.startDate}
                    onChange={(e) => setEducationInput(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                  <input
                    type="month"
                    className="input-field"
                    placeholder="End Date"
                    value={educationInput.endDate}
                    disabled={educationInput.current}
                    onChange={(e) => setEducationInput(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={educationInput.current}
                    onChange={(e) => setEducationInput(prev => ({ ...prev, current: e.target.checked, endDate: e.target.checked ? '' : prev.endDate }))}
                  />
                  <span className="text-sm text-gray-700">Currently Studying</span>
                </label>
                <button
                  type="button"
                  onClick={addEducation}
                  className="btn-primary w-full"
                >
                  Add Education
                </button>
              </div>
              
              {formData.education.length > 0 && (
                <div className="space-y-3 mt-4">
                  {formData.education.map((edu, index) => (
                    <div key={index} className="bg-green-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-900">{edu.degree} - {edu.field}</h4>
                          <p className="text-sm text-gray-600">{edu.institution}</p>
                          <p className="text-sm text-gray-600">
                            {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                            {edu.gpa && ` • GPA: ${edu.gpa}`}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeEducation(index)}
                          className="text-red-600 hover:text-red-800 font-bold text-xl"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Certificates */}
          <div className="bg-white rounded-xl shadow-lg p-6 fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🏆 Certificates & Achievements</h2>
            <div className="space-y-4">
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Certificate Name *"
                    value={certificateInput.name}
                    onChange={(e) => setCertificateInput(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Issuer *"
                    value={certificateInput.issuer}
                    onChange={(e) => setCertificateInput(prev => ({ ...prev, issuer: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="month"
                    className="input-field"
                    placeholder="Issue Date"
                    value={certificateInput.issueDate}
                    onChange={(e) => setCertificateInput(prev => ({ ...prev, issueDate: e.target.value }))}
                  />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Credential ID"
                    value={certificateInput.credentialId}
                    onChange={(e) => setCertificateInput(prev => ({ ...prev, credentialId: e.target.value }))}
                  />
                  <input
                    type="url"
                    className="input-field"
                    placeholder="Credential URL"
                    value={certificateInput.credentialUrl}
                    onChange={(e) => setCertificateInput(prev => ({ ...prev, credentialUrl: e.target.value }))}
                  />
                </div>
                <button
                  type="button"
                  onClick={addCertificate}
                  className="btn-primary w-full"
                >
                  Add Certificate
                </button>
              </div>
              
              {formData.certificates.length > 0 && (
                <div className="space-y-3 mt-4">
                  {formData.certificates.map((cert, index) => (
                    <div key={index} className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-900">{cert.name}</h4>
                          <p className="text-sm text-gray-600">{cert.issuer}</p>
                          <p className="text-sm text-gray-600">
                            Issued: {cert.issueDate}
                            {cert.credentialId && ` • ID: ${cert.credentialId}`}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCertificate(index)}
                          className="text-red-600 hover:text-red-800 font-bold text-xl"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-xl shadow-lg p-6 fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Social Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                <input
                  type="url"
                  className="input-field"
                  value={formData.socialLinks.github}
                  onChange={(e) => handleChange('socialLinks', 'github', e.target.value)}
                  placeholder="https://github.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                <input
                  type="url"
                  className="input-field"
                  value={formData.socialLinks.linkedin}
                  onChange={(e) => handleChange('socialLinks', 'linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                <input
                  type="url"
                  className="input-field"
                  value={formData.socialLinks.twitter}
                  onChange={(e) => handleChange('socialLinks', 'twitter', e.target.value)}
                  placeholder="https://twitter.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="url"
                  className="input-field"
                  value={formData.socialLinks.website}
                  onChange={(e) => handleChange('socialLinks', 'website', e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition text-lg font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition text-lg font-semibold shadow-lg disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPortfolioPage;
