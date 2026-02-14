/**
 * AI Prompt Templates for Portfolio Content Enhancement
 */

class PromptTemplates {
  /**
   * Generate bio/about section prompt
   */
  getBioPrompt(originalBio, context = {}) {
    const {
      careerLevel = 'mid',
      field = 'software-engineering',
      topSkills = []
    } = context;

    return `You are an expert professional writer specializing in career branding.

Context:
- Career Level: ${careerLevel} (student/junior/mid/senior)
- Field/Industry: ${field}
- Key Skills: ${topSkills.join(', ')}
- Target Audience: Recruiters, hiring managers, and industry professionals

Original Bio:
"${originalBio}"

Task:
Transform this bio into a compelling 2-3 sentence professional summary that:

Requirements:
1. Start with a strong professional identifier (e.g., "Passionate Software Engineer" or "Results-Driven Data Scientist")
2. Highlight 2-3 core competencies or unique strengths
3. Include quantifiable achievements if available in the original
4. Convey personality while maintaining professionalism
5. Use active voice and powerful action verbs
6. Keep length to 50-75 words
7. Avoid clichés like "hardworking," "team player," "thinking outside the box"
8. Do NOT fabricate information not present in original

CRITICAL RULES:
- DO NOT add metrics, achievements, or details not in the original input
- If original lacks specific numbers, use qualitative descriptions instead
- Maintain factual accuracy; enhancement means better writing, not added facts
- When in doubt, be conservative rather than exaggerative

Style:
- Confident but not arrogant
- Specific not generic
- Achievement-focused not responsibility-focused

Output:
Return ONLY the enhanced bio text, no additional commentary or quotes.`;
  }

  /**
   * Generate project description prompt
   */
  getProjectPrompt(projectData, context = {}) {
    const {
      title,
      description,
      technologies = []
    } = projectData;

    const { careerLevel = 'mid' } = context;

    return `You are a technical writer specializing in project portfolio descriptions.

Context:
- Project Title: ${title}
- Technologies: ${technologies.join(', ')}
- Career Level: ${careerLevel}
- Original Description: "${description}"
- Target Audience: Technical recruiters and hiring managers

Task:
Rewrite this project description to be compelling and professional.

Structure (follow this format):
1. Opening sentence: What is it? (1 sentence, clear value proposition)
2. Technical implementation: How was it built? (1-2 sentences with specific technologies)
3. Impact/Results: What was achieved? (1 sentence with metrics if available)
4. Optional: Challenges overcome or unique features

Requirements:
- Use strong action verbs (Developed, Architected, Implemented, Engineered)
- Include specific technologies prominently
- Quantify impact where possible (users, performance, scale)
- Keep total length to 4-6 sentences (80-120 words)
- Maintain technical accuracy
- Do NOT exaggerate or fabricate features
- Avoid marketing jargon

CRITICAL RULES:
- DO NOT add metrics, features, or user numbers not in the original
- If no metrics provided, describe functionality without inventing numbers
- Enhancement means clearer writing, not fictional achievements

Example Structure:
"[Project Name] is a [type] application that [value proposition]. Built with [technologies], the system features [key technical aspects]. Successfully [achievement with metrics if available]. Notable implementations include [unique features]."

Output:
Return ONLY the enhanced description, no additional commentary or quotes.`;
  }

  /**
   * Generate experience description prompt
   */
  getExperiencePrompt(experienceData, context = {}) {
    const {
      company,
      position,
      description,
      location
    } = experienceData;

    const { careerLevel = 'mid' } = context;

    return `You are a professional resume writer with expertise in achievement-focused descriptions.

Context:
- Company: ${company}
- Position: ${position}
- Location: ${location || 'N/A'}
- Career Level: ${careerLevel}
- Original Description: "${description}"

Task:
Transform this job description into achievement-focused bullet points.

Format:
Return 3-5 bullet points, each following the STAR framework:
[Action Verb] + [Specific Task] + [Technologies/Methods] + [Quantifiable Result if available]

Requirements:
1. Start each bullet with strong action verbs (Spearheaded, Orchestrated, Engineered, Optimized)
2. Include specific technologies, tools, or methodologies
3. Quantify achievements with metrics (%, $, time saved, users impacted) IF present in original
4. Focus on impact and results, not just responsibilities
5. Use past tense for completed roles, present tense for current roles
6. Keep each bullet to 1-2 lines (20-30 words)
7. Avoid generic statements ("Responsible for...", "Worked on...")
8. Do NOT fabricate metrics not in original

CRITICAL RULES:
- Only include metrics that were in the original description
- If no numbers provided, focus on qualitative achievements and technologies used
- Enhancement means better phrasing, not invented statistics
- Be specific about technologies and methods, vague about invented metrics

Power Verb Categories:
- Leadership: Spearheaded, Orchestrated, Directed, Mentored
- Technical: Engineered, Architected, Developed, Implemented
- Improvement: Optimized, Streamlined, Enhanced, Accelerated
- Achievement: Delivered, Achieved, Exceeded, Generated

Output Format:
• [Bullet point 1]
• [Bullet point 2]
• [Bullet point 3]
...

Return ONLY the bullet points, no additional commentary.`;
  }

  /**
   * Generate theme recommendation prompt (alternative AI-based approach)
   */
  getThemeRecommendationPrompt(portfolioData) {
    return `Analyze this portfolio and recommend the most suitable theme:

Portfolio Data:
- Career Level: ${this.determineCareerLevel(portfolioData)}
- Field: ${this.inferField(portfolioData)}
- Number of Projects: ${portfolioData.projects?.length || 0}
- Skills: ${portfolioData.skills?.map(s => s.name).join(', ') || 'N/A'}

Available Themes:
1. Minimal - Clean, content-focused, ideal for developers and technical professionals
2. Creative - Bold colors, asymmetric layouts, ideal for designers and artists
3. Corporate - Professional, structured, ideal for business professionals
4. Modern - Trendy UI, glassmorphism, ideal for startups and digital marketers
5. Dark - Dark mode, high contrast, ideal for developers and tech professionals

Recommend the top 3 most suitable themes with reasoning. Format:
1. [Theme Name] - [Reason]
2. [Theme Name] - [Reason]
3. [Theme Name] - [Reason]`;
  }

  /**
   * Utility: Determine career level from portfolio
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
   * Utility: Infer field from skills
   */
  inferField(portfolioData) {
    const skills = portfolioData.skills ? 
      portfolioData.skills.map(s => s.name.toLowerCase()) : [];
    
    if (skills.some(s => s.includes('design') || s.includes('figma') || s.includes('photoshop'))) {
      return 'design';
    }
    if (skills.some(s => s.includes('data') || s.includes('machine learning'))) {
      return 'data-science';
    }
    if (skills.some(s => s.includes('business') || s.includes('management'))) {
      return 'business';
    }
    
    return 'software-engineering';
  }
}

module.exports = new PromptTemplates();
