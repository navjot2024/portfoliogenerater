const OpenAI = require('openai');
const promptTemplates = require('../utils/promptTemplates');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class AIService {
  /**
   * Enhance bio/about section with AI
   */
  async enhanceBio(originalBio, context = {}) {
    try {
      const prompt = promptTemplates.getBioPrompt(originalBio, context);
      
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert professional writer specializing in career branding and portfolio content.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 500,
        temperature: 0.7
      });

      const enhanced = completion.choices[0].message.content.trim();
      
      // Validate response
      if (this.validateEnhancement(originalBio, enhanced)) {
        return enhanced;
      } else {
        console.warn('AI enhancement validation failed, using local enhancement');
        return this.localBioEnhancement(originalBio);
      }
    } catch (error) {
      console.error('OpenAI API Error:', error.message);
      // Fallback to local enhancement
      return this.localBioEnhancement(originalBio);
    }
  }

  /**
   * Enhance project description with AI
   */
  async enhanceProject(projectData, context = {}) {
    try {
      const prompt = promptTemplates.getProjectPrompt(projectData, context);
      
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a technical writer specializing in project portfolio descriptions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 800,
        temperature: 0.7
      });

      const enhanced = completion.choices[0].message.content.trim();
      
      if (this.validateEnhancement(projectData.description, enhanced)) {
        return enhanced;
      } else {
        return this.localProjectEnhancement(projectData);
      }
    } catch (error) {
      console.error('OpenAI API Error:', error.message);
      return this.localProjectEnhancement(projectData);
    }
  }

  /**
   * Enhance work experience description with AI
   */
  async enhanceExperience(experienceData, context = {}) {
    try {
      const prompt = promptTemplates.getExperiencePrompt(experienceData, context);
      
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional resume writer with expertise in achievement-focused descriptions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 800,
        temperature: 0.7
      });

      const enhanced = completion.choices[0].message.content.trim();
      
      if (this.validateEnhancement(experienceData.description, enhanced)) {
        return enhanced;
      } else {
        return this.localExperienceEnhancement(experienceData);
      }
    } catch (error) {
      console.error('OpenAI API Error:', error.message);
      return this.localExperienceEnhancement(experienceData);
    }
  }

  /**
   * Enhance entire portfolio in batch
   */
  async enhancePortfolio(portfolioData) {
    const enhanced = { ...portfolioData };
    
    try {
      // Build context once
      const context = {
        careerLevel: this.determineCareerLevel(portfolioData),
        field: this.inferField(portfolioData),
        topSkills: portfolioData.skills.slice(0, 5).map(s => s.name)
      };

      // Enhance bio if present
      if (portfolioData.personalInfo && portfolioData.personalInfo.bio) {
        enhanced.personalInfo.aiEnhancedBio = await this.enhanceBio(
          portfolioData.personalInfo.bio,
          context
        );
      }

      // Enhance projects in parallel
      if (portfolioData.projects && portfolioData.projects.length > 0) {
        const projectEnhancements = await Promise.all(
          portfolioData.projects.map(project => 
            this.enhanceProject(project, context)
          )
        );
        
        enhanced.projects = portfolioData.projects.map((project, index) => ({
          ...project,
          aiEnhancedDescription: projectEnhancements[index]
        }));
      }

      // Enhance experience in parallel
      if (portfolioData.experience && portfolioData.experience.length > 0) {
        const experienceEnhancements = await Promise.all(
          portfolioData.experience.map(exp => 
            this.enhanceExperience(exp, context)
          )
        );
        
        enhanced.experience = portfolioData.experience.map((exp, index) => ({
          ...exp,
          aiEnhancedDescription: experienceEnhancements[index]
        }));
      }

      // Enhance education descriptions if present
      if (portfolioData.education && portfolioData.education.length > 0) {
        const educationEnhancements = await Promise.all(
          portfolioData.education
            .filter(edu => edu.description)
            .map(edu => this.enhanceEducation(edu, context))
        );
        
        let enhancementIndex = 0;
        enhanced.education = portfolioData.education.map(edu => {
          if (edu.description) {
            return {
              ...edu,
              aiEnhancedDescription: educationEnhancements[enhancementIndex++]
            };
          }
          return edu;
        });
      }

      return enhanced;
    } catch (error) {
      console.error('Error enhancing portfolio:', error);
      throw error;
    }
  }

  /**
   * Recommend theme based on portfolio data
   */
  recommendTheme(portfolioData) {
    const scoring = {
      minimal: 0,
      creative: 0,
      corporate: 0,
      modern: 0,
      dark: 0
    };

    const field = this.inferField(portfolioData);
    const careerLevel = this.determineCareerLevel(portfolioData);

    // Field-based scoring
    const fieldScores = {
      'software-engineering': { minimal: 8, modern: 9, dark: 10 },
      'data-science': { minimal: 9, corporate: 8, dark: 7 },
      'design': { creative: 10, modern: 8, minimal: 6 },
      'business': { corporate: 10, minimal: 8, modern: 6 },
      'creative-arts': { creative: 10, modern: 7, minimal: 5 }
    };

    Object.assign(scoring, fieldScores[field] || fieldScores['software-engineering']);

    // Career level adjustment
    if (careerLevel === 'student' || careerLevel === 'junior') {
      scoring.creative += 3;
      scoring.modern += 2;
    } else if (careerLevel === 'senior') {
      scoring.corporate += 4;
      scoring.minimal += 3;
    }

    // Content richness
    if (portfolioData.projects && portfolioData.projects.length > 5) {
      scoring.modern += 2;
    }

    // Return top 3 recommendations
    return Object.entries(scoring)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([theme, score]) => ({
        theme,
        score,
        confidence: Math.min(score / 10, 1)
      }));
  }

  /**
   * Validate AI enhancement
   */
  validateEnhancement(original, enhanced) {
    // Check if enhancement is reasonable
    const expansionRatio = enhanced.length / original.length;
    
    if (expansionRatio > 5 || expansionRatio < 0.5) {
      return false;
    }

    // Ensure not empty
    if (!enhanced || enhanced.length < 10) {
      return false;
    }

    return true;
  }

  /**
   * Determine career level from portfolio data
   */
  determineCareerLevel(portfolioData) {
    if (!portfolioData.experience || portfolioData.experience.length === 0) {
      return 'student';
    }

    let totalYears = 0;
    portfolioData.experience.forEach(exp => {
      if (exp.startDate) {
        const start = new Date(exp.startDate);
        const end = exp.current ? new Date() : new Date(exp.endDate);
        totalYears += (end - start) / (1000 * 60 * 60 * 24 * 365);
      }
    });

    if (totalYears < 2) return 'junior';
    if (totalYears < 5) return 'mid';
    return 'senior';
  }

  /**
   * Infer field/industry from skills and projects
   */
  inferField(portfolioData) {
    const skills = portfolioData.skills ? portfolioData.skills.map(s => s.name.toLowerCase()) : [];
    
    const fieldKeywords = {
      'software-engineering': ['javascript', 'python', 'java', 'react', 'node', 'backend', 'frontend'],
      'data-science': ['python', 'machine learning', 'data', 'tensorflow', 'pandas', 'analysis'],
      'design': ['figma', 'photoshop', 'ui', 'ux', 'design', 'illustrator'],
      'business': ['management', 'strategy', 'marketing', 'sales', 'business'],
      'creative-arts': ['art', 'creative', 'photography', 'video', 'content']
    };

    let maxScore = 0;
    let detectedField = 'software-engineering';

    Object.entries(fieldKeywords).forEach(([field, keywords]) => {
      const score = keywords.reduce((total, keyword) => {
        return total + (skills.some(skill => skill.includes(keyword)) ? 1 : 0);
      }, 0);

      if (score > maxScore) {
        maxScore = score;
        detectedField = field;
      }
    });

    return detectedField;
  }

  /**
   * Local fallback enhancements (when AI unavailable)
   */
  localBioEnhancement(bio) {
    let enhanced = bio.trim();
    
    // Capitalize first letter of sentences
    enhanced = enhanced.replace(/(?:^|\.\s+)([a-z])/g, (match) => match.toUpperCase());
    
    // Remove excessive whitespace
    enhanced = enhanced.replace(/\s+/g, ' ').trim();
    
    // Ensure professional opening if missing
    const professionalOpeners = [
      'I am', 'Experienced', 'Passionate', 'Innovative', 'Dedicated',
      'Results-driven', 'Creative', 'Skilled'
    ];
    
    const hasGoodOpening = professionalOpeners.some(opener => 
      enhanced.startsWith(opener)
    );
    
    if (!hasGoodOpening) {
      enhanced = `Experienced professional. ${enhanced}`;
    }
    
    return enhanced;
  }

  localProjectEnhancement(projectData) {
    const { title, description, technologies = [] } = projectData;
    
    let enhanced = description.trim();
    enhanced = enhanced.replace(/(?:^|\.\s+)([a-z])/g, (match) => match.toUpperCase());
    
    // Add technology context if not mentioned
    if (technologies.length > 0 && !enhanced.includes('built') && !enhanced.includes('using')) {
      const techList = technologies.slice(0, 3).join(', ');
      enhanced = `${title} is a project built using ${techList}. ${enhanced}`;
    }
    
    return enhanced;
  }

  localExperienceEnhancement(experienceData) {
    const { position, company, description } = experienceData;
    
    let enhanced = description.trim();
    
    // Split into sentences and ensure active voice
    const sentences = enhanced.split(/\.\s+/).filter(s => s.length > 0);
    
    const activeVerbs = [
      'Developed', 'Created', 'Implemented', 'Designed', 'Built',
      'Managed', 'Led', 'Coordinated', 'Optimized', 'Improved'
    ];
    
    const enhancedSentences = sentences.map((sentence, index) => {
      // Add bullet points and ensure strong opening verbs
      let enhanced = sentence.trim();
      
      if (!/^(Developed|Created|Implemented|Designed|Built|Managed|Led)/i.test(enhanced)) {
        enhanced = `${activeVerbs[index % activeVerbs.length]} ${enhanced.toLowerCase()}`;
      }
      
      return `• ${enhanced.charAt(0).toUpperCase()}${enhanced.slice(1)}`;
    });
    
    return enhancedSentences.join('\n');
  }

  async enhanceEducation(educationData, context) {
    // Simple enhancement for education
    if (!educationData.description) return '';
    
    let enhanced = educationData.description.trim();
    enhanced = enhanced.replace(/(?:^|\.\s+)([a-z])/g, (match) => match.toUpperCase());
    
    return enhanced;
  }
}

module.exports = new AIService();
