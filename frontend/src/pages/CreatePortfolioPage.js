import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import portfolioService from '../services/portfolioService';

const CreatePortfolioPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useAI, setUseAI] = useState(true);
  
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

  const [skillInput, setSkillInput] = useState({ 
    name: '', 
    category: 'Programming Languages',
    proficiency: 70 
  });
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
    if (skillInput.name.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, { ...skillInput }]
      }));
      setSkillInput({ 
        name: '', 
        category: 'Programming Languages',
        proficiency: 70 
      });
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
          technologies: projectInput.technologies.split(',').map(t => t.trim()).filter(t => t)
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
      setExperienceInput({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      });
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
      setEducationInput({
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        current: false,
        gpa: ''
      });
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
      setCertificateInput({
        name: '',
        issuer: '',
        issueDate: '',
        credentialId: '',
        credentialUrl: ''
      });
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
    setLoading(true);
    setError('');

    // Validate required fields
    if (!formData.personalInfo.fullName) {
      setError('Full Name is required');
      setLoading(false);
      return;
    }
    if (!formData.personalInfo.email) {
      setError('Email is required');
      setLoading(false);
      return;
    }

    try {
      console.log('Submitting portfolio data:', formData);
      
      let result;
      if (useAI) {
        result = await portfolioService.createPortfolioWithAI(formData);
      } else {
        result = await portfolioService.createPortfolio(formData);
      }
      
      console.log('Portfolio created:', result);
      navigate('/dashboard');
    } catch (err) {
      console.error('Portfolio creation error:', err);
      console.error('Error response:', err.response?.data);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Failed to create portfolio';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Portfolio</h1>
          <p className="text-gray-600 text-lg">Fill in your details and let AI enhance your content</p>
        </div>

        {/* AI Toggle */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">AI Enhancement</h3>
              <p className="text-sm text-gray-600">Let AI improve your bio, projects, and experience descriptions</p>
            </div>
            <button
              onClick={() => setUseAI(!useAI)}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                useAI ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  useAI ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6 shadow-md fade-in">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="bg-white rounded-xl shadow-lg p-6 fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              Personal Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Title (Optional)</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., My Professional Portfolio (will auto-generate if empty)"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate from your name</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={formData.personalInfo.fullName}
                  onChange={(e) => handleChange('personalInfo', 'fullName', e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  className="input-field"
                  value={formData.personalInfo.email}
                  onChange={(e) => handleChange('personalInfo', 'email', e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  className="input-field"
                  value={formData.personalInfo.phone}
                  onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)}
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.personalInfo.location}
                  onChange={(e) => handleChange('personalInfo', 'location', e.target.value)}
                  placeholder="San Francisco, CA"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Professional Tagline *</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={formData.personalInfo.tagline}
                  onChange={(e) => handleChange('personalInfo', 'tagline', e.target.value)}
                  placeholder="Full Stack Developer | AI Enthusiast"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio *</label>
                <textarea
                  required
                  rows="4"
                  className="input-field"
                  value={formData.personalInfo.bio}
                  onChange={(e) => handleChange('personalInfo', 'bio', e.target.value)}
                  placeholder="Tell us about yourself, your experience, and what you do..."
                />
                {useAI && (
                  <p className="text-sm text-blue-600 mt-1">✨ AI will enhance this bio automatically</p>
                )}
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-xl shadow-lg p-6 fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              Skills
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <select
                  className="input-field w-48"
                  value={skillInput.category}
                  onChange={(e) => setSkillInput(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="Programming Languages">Programming Languages</option>
                  <option value="Frameworks & Libraries">Frameworks & Libraries</option>
                  <option value="Tools & Platforms">Tools & Platforms</option>
                  <option value="Databases">Databases</option>
                  <option value="Soft Skills">Soft Skills</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="text"
                  className="input-field flex-1"
                  placeholder="Skill name (e.g., JavaScript, React, Python)"
                  value={skillInput.name}
                  onChange={(e) => setSkillInput(prev => ({ ...prev, name: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <div className="w-32">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="input-field"
                    placeholder="Level %"
                    value={skillInput.proficiency}
                    onChange={(e) => setSkillInput(prev => ({ ...prev, proficiency: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <button
                  type="button"
                  onClick={addSkill}
                  className="btn-primary whitespace-nowrap"
                >
                  Add Skill
                </button>
              </div>
              
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {formData.skills.map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                      {skill.name} ({skill.proficiency}%)
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Projects */}
          <div className="bg-white rounded-xl shadow-lg p-6 fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
              Projects
            </h2>
            <div className="space-y-4">
              <div className="grid gap-4">
                <input
                  type="text"
                  className="input-field"
                  placeholder="Project title"
                  value={projectInput.title}
                  onChange={(e) => setProjectInput(prev => ({ ...prev, title: e.target.value }))}
                />
                <textarea
                  rows="3"
                  className="input-field"
                  placeholder="Project description"
                  value={projectInput.description}
                  onChange={(e) => setProjectInput(prev => ({ ...prev, description: e.target.value }))}
                />
                <input
                  type="text"
                  className="input-field"
                  placeholder="Technologies (comma separated: React, Node.js, MongoDB)"
                  value={projectInput.technologies}
                  onChange={(e) => setProjectInput(prev => ({ ...prev, technologies: e.target.value }))}
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="url"
                    className="input-field"
                    placeholder="Live URL (optional)"
                    value={projectInput.liveUrl}
                    onChange={(e) => setProjectInput(prev => ({ ...prev, liveUrl: e.target.value }))}
                  />
                  <input
                    type="url"
                    className="input-field"
                    placeholder="GitHub URL (optional)"
                    value={projectInput.githubUrl}
                    onChange={(e) => setProjectInput(prev => ({ ...prev, githubUrl: e.target.value }))}
                  />
                </div>
                <button
                  type="button"
                  onClick={addProject}
                  className="btn-secondary"
                >
                  Add Project
                </button>
              </div>

              {formData.projects.length > 0 && (
                <div className="mt-6 space-y-4">
                  {formData.projects.map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{project.title}</h4>
                        <button
                          type="button"
                          onClick={() => removeProject(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {useAI && formData.projects.length > 0 && (
                <p className="text-sm text-blue-600">✨ AI will enhance project descriptions automatically</p>
              )}
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white rounded-xl shadow-lg p-6 fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
              Work Experience
            </h2>
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Company Name"
                    value={experienceInput.company}
                    onChange={(e) => setExperienceInput(prev => ({ ...prev, company: e.target.value }))}
                  />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Position/Role"
                    value={experienceInput.position}
                    onChange={(e) => setExperienceInput(prev => ({ ...prev, position: e.target.value }))}
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
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
                    onChange={(e) => setExperienceInput(prev => ({ ...prev, endDate: e.target.value }))}
                    disabled={experienceInput.current}
                  />
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={experienceInput.current}
                      onChange={(e) => setExperienceInput(prev => ({ ...prev, current: e.target.checked }))}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-gray-700">Currently Working</span>
                  </label>
                </div>
                <textarea
                  className="input-field"
                  rows="3"
                  placeholder="Job description & responsibilities"
                  value={experienceInput.description}
                  onChange={(e) => setExperienceInput(prev => ({ ...prev, description: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={addExperience}
                  className="btn-secondary"
                >
                  Add Experience
                </button>
              </div>

              {formData.experience.length > 0 && (
                <div className="mt-6 space-y-4">
                  {formData.experience.map((exp, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                          <p className="text-sm text-gray-600">{exp.company}</p>
                          <p className="text-xs text-gray-500">
                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExperience(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                      {exp.description && <p className="text-sm text-gray-600">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-xl shadow-lg p-6 fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
              Education
            </h2>
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Institution Name"
                    value={educationInput.institution}
                    onChange={(e) => setEducationInput(prev => ({ ...prev, institution: e.target.value }))}
                  />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Degree (e.g., B.Tech, BCA)"
                    value={educationInput.degree}
                    onChange={(e) => setEducationInput(prev => ({ ...prev, degree: e.target.value }))}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Field of Study (e.g., Computer Science)"
                    value={educationInput.field}
                    onChange={(e) => setEducationInput(prev => ({ ...prev, field: e.target.value }))}
                  />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="GPA/Percentage (optional)"
                    value={educationInput.gpa}
                    onChange={(e) => setEducationInput(prev => ({ ...prev, gpa: e.target.value }))}
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
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
                    onChange={(e) => setEducationInput(prev => ({ ...prev, endDate: e.target.value }))}
                    disabled={educationInput.current}
                  />
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={educationInput.current}
                      onChange={(e) => setEducationInput(prev => ({ ...prev, current: e.target.checked }))}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-gray-700">Currently Studying</span>
                  </label>
                </div>
                <button
                  type="button"
                  onClick={addEducation}
                  className="btn-secondary"
                >
                  Add Education
                </button>
              </div>

              {formData.education.length > 0 && (
                <div className="mt-6 space-y-4">
                  {formData.education.map((edu, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                          <p className="text-sm text-gray-600">{edu.institution}</p>
                          {edu.field && <p className="text-sm text-gray-600">{edu.field}</p>}
                          <p className="text-xs text-gray-500">
                            {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                            {edu.gpa && ` • GPA: ${edu.gpa}`}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeEducation(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">6</span>
              Certificates & Achievements
            </h2>
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Certificate Name"
                    value={certificateInput.name}
                    onChange={(e) => setCertificateInput(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Issuing Organization"
                    value={certificateInput.issuer}
                    onChange={(e) => setCertificateInput(prev => ({ ...prev, issuer: e.target.value }))}
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
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
                    placeholder="Credential ID (optional)"
                    value={certificateInput.credentialId}
                    onChange={(e) => setCertificateInput(prev => ({ ...prev, credentialId: e.target.value }))}
                  />
                  <input
                    type="url"
                    className="input-field"
                    placeholder="Credential URL (optional)"
                    value={certificateInput.credentialUrl}
                    onChange={(e) => setCertificateInput(prev => ({ ...prev, credentialUrl: e.target.value }))}
                  />
                </div>
                <button
                  type="button"
                  onClick={addCertificate}
                  className="btn-secondary"
                >
                  Add Certificate
                </button>
              </div>

              {formData.certificates.length > 0 && (
                <div className="mt-6 space-y-4">
                  {formData.certificates.map((cert, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                          <p className="text-sm text-gray-600">{cert.issuer}</p>
                          <p className="text-xs text-gray-500">
                            Issued: {cert.issueDate}
                            {cert.credentialId && ` • ID: ${cert.credentialId}`}
                          </p>
                          {cert.credentialUrl && (
                            <a 
                              href={cert.credentialUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline"
                            >
                              View Credential
                            </a>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCertificate(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">7</span>
              Social Links
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                <input
                  type="url"
                  className="input-field"
                  value={formData.socialLinks.github}
                  onChange={(e) => handleChange('socialLinks', 'github', e.target.value)}
                  placeholder="https://github.com/yourusername"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                <input
                  type="url"
                  className="input-field"
                  value={formData.socialLinks.linkedin}
                  onChange={(e) => handleChange('socialLinks', 'linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/yourusername"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                <input
                  type="url"
                  className="input-field"
                  value={formData.socialLinks.twitter}
                  onChange={(e) => handleChange('socialLinks', 'twitter', e.target.value)}
                  placeholder="https://twitter.com/yourusername"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
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

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="spinner w-5 h-5 border-2"></div>
                  {useAI ? 'Creating with AI...' : 'Creating...'}
                </>
              ) : (
                <>
                  {useAI && <span>✨</span>}
                  Create Portfolio
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePortfolioPage;
