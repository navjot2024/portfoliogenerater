const asyncHandler = require('../middleware/asyncHandler');
const { ErrorResponse } = require('../middleware/errorHandler');
const Portfolio = require('../models/Portfolio');

/**
 * @desc    Export portfolio as HTML
 * @route   POST /api/export/html/:id
 * @access  Private
 */
const exportHTML = asyncHandler(async (req, res, next) => {
  const portfolio = await Portfolio.findById(req.params.id);

  if (!portfolio) {
    return next(new ErrorResponse('Portfolio not found', 404));
  }

  // Ensure user owns this portfolio
  if (portfolio.userId.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  // Generate HTML (simplified version)
  const html = generateHTML(portfolio);

  res.status(200).json({
    success: true,
    data: {
      html: html,
      filename: `${portfolio.slug}-portfolio.html`
    },
    message: 'HTML generated successfully'
  });
});

/**
 * @desc    Export portfolio data as JSON
 * @route   GET /api/export/json/:id
 * @access  Private
 */
const exportJSON = asyncHandler(async (req, res, next) => {
  const portfolio = await Portfolio.findById(req.params.id);

  if (!portfolio) {
    return next(new ErrorResponse('Portfolio not found', 404));
  }

  // Ensure user owns this portfolio
  if (portfolio.userId.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  res.status(200).json({
    success: true,
    data: portfolio
  });
});

/**
 * Helper function to generate HTML
 */
function generateHTML(portfolio) {
  const theme = portfolio.theme || { name: 'minimal', colorScheme: {} };
  const colors = theme.colorScheme;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${portfolio.personalInfo.tagline || ''}">
    <title>${portfolio.personalInfo.fullName} - Portfolio</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: ${colors.text || '#1F2937'};
            background: ${colors.background || '#FFFFFF'};
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        header {
            text-align: center;
            padding: 60px 20px;
            background: linear-gradient(135deg, ${colors.primary || '#3B82F6'}, ${colors.secondary || '#10B981'});
            color: white;
        }
        header h1 {
            font-size: 3rem;
            margin-bottom: 10px;
        }
        header p {
            font-size: 1.25rem;
            opacity: 0.9;
        }
        section {
            padding: 60px 20px;
        }
        h2 {
            font-size: 2rem;
            color: ${colors.primary || '#3B82F6'};
            margin-bottom: 30px;
            text-align: center;
        }
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }
        .skill-item {
            padding: 15px;
            background: #F3F4F6;
            border-radius: 8px;
        }
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }
        .project-card {
            border: 1px solid #E5E7EB;
            border-radius: 12px;
            padding: 25px;
            transition: transform 0.2s;
        }
        .project-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .tech-badge {
            display: inline-block;
            padding: 5px 12px;
            background: ${colors.primary || '#3B82F6'};
            color: white;
            border-radius: 20px;
            font-size: 0.875rem;
            margin: 5px 5px 5px 0;
        }
        .social-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 20px;
        }
        .social-links a {
            padding: 10px 20px;
            background: ${colors.primary || '#3B82F6'};
            color: white;
            text-decoration: none;
            border-radius: 6px;
            transition: background 0.2s;
        }
        .social-links a:hover {
            background: ${colors.secondary || '#10B981'};
        }
        @media (max-width: 768px) {
            header h1 { font-size: 2rem; }
            h2 { font-size: 1.5rem; }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            ${portfolio.personalInfo.profileImage ? `<img src="${portfolio.personalInfo.profileImage}" alt="${portfolio.personalInfo.fullName}" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover; margin-bottom: 20px;">` : ''}
            <h1>${portfolio.personalInfo.fullName}</h1>
            <p>${portfolio.personalInfo.tagline || ''}</p>
        </div>
    </header>

    <section id="about">
        <div class="container">
            <h2>About Me</h2>
            <p style="text-align: center; max-width: 800px; margin: 0 auto; font-size: 1.125rem;">
                ${portfolio.personalInfo.aiEnhancedBio || portfolio.personalInfo.bio || ''}
            </p>
        </div>
    </section>

    ${portfolio.skills && portfolio.skills.length > 0 ? `
    <section id="skills" style="background: #F9FAFB;">
        <div class="container">
            <h2>Skills</h2>
            <div class="skills-grid">
                ${portfolio.skills.map(skill => `
                    <div class="skill-item">
                        <strong>${skill.name}</strong>
                        <div style="background: #E5E7EB; height: 8px; border-radius: 4px; margin-top: 10px;">
                            <div style="width: ${skill.proficiency || 50}%; height: 100%; background: ${colors.primary || '#3B82F6'}; border-radius: 4px;"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    ${portfolio.projects && portfolio.projects.length > 0 ? `
    <section id="projects">
        <div class="container">
            <h2>Projects</h2>
            <div class="projects-grid">
                ${portfolio.projects.map(project => `
                    <div class="project-card">
                        <h3 style="color: ${colors.primary || '#3B82F6'}; margin-bottom: 15px;">${project.title}</h3>
                        <p style="margin-bottom: 15px;">${project.aiEnhancedDescription || project.description}</p>
                        ${project.technologies && project.technologies.length > 0 ? `
                            <div>
                                ${project.technologies.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                            </div>
                        ` : ''}
                        ${project.liveUrl || project.githubUrl ? `
                            <div style="margin-top: 15px;">
                                ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" style="color: ${colors.primary || '#3B82F6'}; text-decoration: none; margin-right: 15px;">🔗 Live Demo</a>` : ''}
                                ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" style="color: ${colors.primary || '#3B82F6'}; text-decoration: none;">💻 GitHub</a>` : ''}
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    ${portfolio.experience && portfolio.experience.length > 0 ? `
    <section id="experience" style="background: #F9FAFB;">
        <div class="container">
            <h2>Experience</h2>
            ${portfolio.experience.map(exp => `
                <div style="max-width: 800px; margin: 0 auto 40px;">
                    <h3 style="color: ${colors.primary || '#3B82F6'};">${exp.position}</h3>
                    <p style="color: #6B7280; margin-bottom: 10px;"><strong>${exp.company}</strong> | ${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                    <p style="white-space: pre-line;">${exp.aiEnhancedDescription || exp.description || ''}</p>
                </div>
            `).join('')}
        </div>
    </section>
    ` : ''}

    <section id="contact">
        <div class="container">
            <h2>Get In Touch</h2>
            <p style="text-align: center; margin-bottom: 20px;">
                <strong>Email:</strong> ${portfolio.personalInfo.email}<br>
                ${portfolio.personalInfo.phone ? `<strong>Phone:</strong> ${portfolio.personalInfo.phone}<br>` : ''}
                ${portfolio.personalInfo.location ? `<strong>Location:</strong> ${portfolio.personalInfo.location}` : ''}
            </p>
            ${portfolio.socialLinks ? `
                <div class="social-links">
                    ${portfolio.socialLinks.linkedin ? `<a href="${portfolio.socialLinks.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a>` : ''}
                    ${portfolio.socialLinks.github ? `<a href="${portfolio.socialLinks.github}" target="_blank" rel="noopener noreferrer">GitHub</a>` : ''}
                    ${portfolio.socialLinks.twitter ? `<a href="${portfolio.socialLinks.twitter}" target="_blank" rel="noopener noreferrer">Twitter</a>` : ''}
                </div>
            ` : ''}
        </div>
    </section>

    <footer style="background: #1F2937; color: white; text-align: center; padding: 30px 20px;">
        <p>&copy; ${new Date().getFullYear()} ${portfolio.personalInfo.fullName}. All rights reserved.</p>
        <p style="opacity: 0.7; margin-top: 10px; font-size: 0.875rem;">Built with AI Portfolio Generator</p>
    </footer>
</body>
</html>`;
}

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

module.exports = { exportHTML, exportJSON };
