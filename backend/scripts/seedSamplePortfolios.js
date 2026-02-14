const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Portfolio = require('./models/Portfolio');

const samplePortfolios = [
  {
    email: 'john.doe@example.com',
    password: 'password123',
    fullName: 'John Doe',
    portfolio: {
      title: "John Doe's Portfolio",
      personalInfo: {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        tagline: 'Full-Stack Developer & AI Enthusiast',
        bio: 'Passionate software engineer with 5+ years of experience building scalable web applications. Specialized in React, Node.js, and modern JavaScript frameworks. Love solving complex problems and creating intuitive user experiences.'
      },
      skills: [
        { category: 'Programming Languages', name: 'JavaScript', proficiency: 90, yearsOfExperience: 5 },
        { category: 'Programming Languages', name: 'TypeScript', proficiency: 85, yearsOfExperience: 3 },
        { category: 'Programming Languages', name: 'Python', proficiency: 80, yearsOfExperience: 4 },
        { category: 'Frameworks & Libraries', name: 'React', proficiency: 95, yearsOfExperience: 5 },
        { category: 'Frameworks & Libraries', name: 'Node.js', proficiency: 90, yearsOfExperience: 5 },
        { category: 'Frameworks & Libraries', name: 'Express.js', proficiency: 90, yearsOfExperience: 4 },
        { category: 'Databases', name: 'MongoDB', proficiency: 85, yearsOfExperience: 4 },
        { category: 'Databases', name: 'PostgreSQL', proficiency: 80, yearsOfExperience: 3 },
        { category: 'Tools & Platforms', name: 'AWS', proficiency: 75, yearsOfExperience: 3 },
        { category: 'Tools & Platforms', name: 'Docker', proficiency: 80, yearsOfExperience: 3 },
        { category: 'Tools & Platforms', name: 'Git', proficiency: 90, yearsOfExperience: 5 }
      ],
      projects: [
        {
          title: 'E-Commerce Platform',
          description: 'Built a full-stack e-commerce platform with React and Node.js, featuring real-time inventory management, payment integration, and admin dashboard. Handles 10,000+ daily users.',
          technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redis'],
          liveUrl: 'https://example-ecommerce.com',
          githubUrl: 'https://github.com/johndoe/ecommerce',
          featured: true,
          startDate: new Date('2023-01-15'),
          endDate: new Date('2023-06-30')
        },
        {
          title: 'AI Chatbot Assistant',
          description: 'Developed an intelligent chatbot using OpenAI GPT-4 API with context-aware conversations, sentiment analysis, and multi-language support. Integrated with Slack and Discord.',
          technologies: ['Python', 'OpenAI API', 'FastAPI', 'PostgreSQL', 'Docker'],
          liveUrl: 'https://example-chatbot.com',
          githubUrl: 'https://github.com/johndoe/ai-chatbot',
          featured: true,
          startDate: new Date('2023-07-01'),
          endDate: new Date('2023-10-15')
        },
        {
          title: 'Real-Time Analytics Dashboard',
          description: 'Created a real-time analytics dashboard for tracking user behavior and application metrics. Features interactive charts, custom alerts, and automated reporting.',
          technologies: ['React', 'D3.js', 'Socket.io', 'Node.js', 'InfluxDB'],
          githubUrl: 'https://github.com/johndoe/analytics-dashboard',
          featured: false,
          startDate: new Date('2023-11-01'),
          endDate: new Date('2024-02-01')
        }
      ],
      experience: [
        {
          company: 'Tech Innovators Inc.',
          position: 'Senior Full-Stack Developer',
          location: 'San Francisco, CA',
          startDate: new Date('2021-03-01'),
          current: true,
          description: 'Leading development of microservices architecture, mentoring junior developers, and implementing CI/CD pipelines. Reduced deployment time by 60% and improved system reliability.'
        },
        {
          company: 'StartupXYZ',
          position: 'Full-Stack Developer',
          location: 'Remote',
          startDate: new Date('2019-06-01'),
          endDate: new Date('2021-02-28'),
          current: false,
          description: 'Developed core features for SaaS platform serving 50,000+ users. Built REST APIs, implemented authentication system, and optimized database queries for better performance.'
        }
      ],
      education: [
        {
          institution: 'University of California, Berkeley',
          degree: 'Bachelor of Science in Computer Science',
          startDate: new Date('2015-09-01'),
          endDate: new Date('2019-05-15'),
          gpa: '3.8/4.0',
          description: 'Focused on algorithms, data structures, and machine learning. Dean\'s List for 6 semesters.'
        }
      ],
      socialLinks: {
        github: 'https://github.com/johndoe',
        linkedin: 'https://linkedin.com/in/johndoe',
        twitter: 'https://twitter.com/johndoe',
        portfolio: 'https://johndoe.dev'
      },
      theme: {
        name: 'modern',
        colorScheme: {
          primary: '#3B82F6',
          secondary: '#8B5CF6',
          accent: '#F59E0B',
          background: '#FFFFFF',
          text: '#1F2937'
        }
      },
      status: 'published',
      isPublic: true
    }
  },
  {
    email: 'sarah.chen@example.com',
    password: 'password123',
    fullName: 'Sarah Chen',
    portfolio: {
      title: "Sarah Chen's Creative Portfolio",
      personalInfo: {
        fullName: 'Sarah Chen',
        email: 'sarah.chen@example.com',
        phone: '+1 (555) 987-6543',
        location: 'New York, NY',
        tagline: 'UI/UX Designer & Frontend Developer',
        bio: 'Creative designer and developer passionate about crafting beautiful, user-centered digital experiences. Expert in modern design tools and frontend technologies with a keen eye for detail and aesthetics.'
      },
      skills: [
        'UI/UX Design', 'Figma', 'Adobe XD', 'React', 'Vue.js',
        'CSS/SCSS', 'Tailwind CSS', 'JavaScript', 'Animation',
        'Prototyping', 'Wireframing', 'User Research', 'Design Systems'
      ],
      projects: [
        {
          name: 'Design System Library',
          description: 'Created a comprehensive design system used across 15+ products, including component library, style guide, and documentation. Improved design consistency by 90%.',
          technologies: ['React', 'Storybook', 'Figma', 'TypeScript'],
          liveUrl: 'https://design-system.example.com',
          githubUrl: 'https://github.com/sarahchen/design-system',
          startDate: '2023-03-01',
          endDate: '2023-08-30'
        },
        {
          name: 'Mobile Banking App',
          description: 'Designed and prototyped a modern mobile banking application with focus on accessibility and user experience. Conducted user testing with 100+ participants.',
          technologies: ['Figma', 'Prototyping', 'User Testing'],
          liveUrl: 'https://banking-app-demo.example.com',
          startDate: '2023-09-15',
          endDate: '2024-01-20'
        },
        {
          name: 'Portfolio Template Collection',
          description: 'Developed a collection of 10+ modern portfolio templates with animations and responsive design. Used by 5,000+ creators.',
          technologies: ['React', 'Framer Motion', 'Tailwind CSS', 'Next.js'],
          liveUrl: 'https://templates.example.com',
          githubUrl: 'https://github.com/sarahchen/portfolio-templates',
          startDate: '2022-11-01',
          endDate: '2023-02-28'
        }
      ],
      experience: [
        {
          company: 'Creative Studios Co.',
          position: 'Senior UI/UX Designer',
          location: 'New York, NY',
          startDate: '2022-01-15',
          endDate: null,
          current: true,
          description: 'Leading design for multiple client projects, creating user flows, wireframes, and high-fidelity mockups. Collaborating with developers to ensure pixel-perfect implementation.'
        },
        {
          company: 'Digital Agency LLC',
          position: 'UI Designer',
          location: 'Brooklyn, NY',
          startDate: '2020-03-01',
          endDate: '2021-12-31',
          current: false,
          description: 'Designed websites and mobile apps for various clients. Created brand identities and marketing materials.'
        }
      ],
      education: [
        {
          institution: 'Parsons School of Design',
          degree: 'Bachelor of Fine Arts in Design',
          startDate: '2016-09-01',
          endDate: '2020-05-15',
          grade: 'Summa Cum Laude',
          description: 'Specialized in digital design and interactive media.'
        }
      ],
      socialLinks: {
        github: 'https://github.com/sarahchen',
        linkedin: 'https://linkedin.com/in/sarahchen',
        twitter: 'https://twitter.com/sarahchen',
        website: 'https://sarahchen.design',
        dribbble: 'https://dribbble.com/sarahchen'
      },
      theme: {
        layout: 'creative',
        colorScheme: 'pink'
      },
      status: 'published',
      isPublic: true
    }
  },
  {
    email: 'alex.kumar@example.com',
    password: 'password123',
    fullName: 'Alex Kumar',
    portfolio: {
      title: "Alex Kumar - Data Scientist Portfolio",
      personalInfo: {
        fullName: 'Alex Kumar',
        email: 'alex.kumar@example.com',
        phone: '+1 (555) 246-8135',
        location: 'Seattle, WA',
        tagline: 'Data Scientist & ML Engineer',
        bio: 'Data scientist with expertise in machine learning, deep learning, and statistical analysis. Experienced in building predictive models and extracting insights from large datasets to drive business decisions.'
      },
      skills: [
        'Python', 'R', 'Machine Learning', 'Deep Learning', 'TensorFlow',
        'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'SQL',
        'Data Visualization', 'Statistics', 'NLP', 'Computer Vision', 'AWS'
      ],
      projects: [
        {
          name: 'Customer Churn Prediction',
          description: 'Built a machine learning model to predict customer churn with 92% accuracy. Helped company reduce churn by 25% through targeted interventions.',
          technologies: ['Python', 'Scikit-learn', 'XGBoost', 'Pandas', 'Flask'],
          githubUrl: 'https://github.com/alexkumar/churn-prediction',
          startDate: '2023-04-01',
          endDate: '2023-07-15'
        },
        {
          name: 'Sentiment Analysis System',
          description: 'Developed a real-time sentiment analysis system for social media monitoring using NLP techniques. Processes 1M+ tweets daily.',
          technologies: ['Python', 'BERT', 'FastAPI', 'PostgreSQL', 'Docker'],
          liveUrl: 'https://sentiment-analyzer.example.com',
          githubUrl: 'https://github.com/alexkumar/sentiment-analysis',
          startDate: '2023-08-01',
          endDate: '2023-11-30'
        },
        {
          name: 'Image Classification API',
          description: 'Created a RESTful API for image classification using transfer learning with ResNet50. Deployed on AWS with auto-scaling.',
          technologies: ['Python', 'TensorFlow', 'FastAPI', 'AWS', 'Docker'],
          liveUrl: 'https://image-api.example.com',
          githubUrl: 'https://github.com/alexkumar/image-classifier',
          startDate: '2024-01-01',
          endDate: '2024-02-28'
        }
      ],
      experience: [
        {
          company: 'DataTech Solutions',
          position: 'Senior Data Scientist',
          location: 'Seattle, WA',
          startDate: '2022-06-01',
          endDate: null,
          current: true,
          description: 'Leading ML projects for Fortune 500 clients. Building predictive models, conducting A/B tests, and presenting insights to stakeholders.'
        },
        {
          company: 'AI Research Lab',
          position: 'Data Scientist',
          location: 'Boston, MA',
          startDate: '2020-07-01',
          endDate: '2022-05-31',
          current: false,
          description: 'Researched and developed NLP models for text classification and named entity recognition. Published 3 papers in ML conferences.'
        }
      ],
      education: [
        {
          institution: 'Massachusetts Institute of Technology',
          degree: 'Master of Science in Computer Science',
          startDate: '2018-09-01',
          endDate: '2020-05-15',
          grade: 'GPA: 4.0/4.0',
          description: 'Specialized in Machine Learning and Artificial Intelligence. Thesis on deep learning for NLP.'
        },
        {
          institution: 'Stanford University',
          degree: 'Bachelor of Science in Mathematics',
          startDate: '2014-09-01',
          endDate: '2018-06-15',
          grade: 'GPA: 3.9/4.0',
          description: 'Minor in Computer Science. Focus on statistics and probability theory.'
        }
      ],
      socialLinks: {
        github: 'https://github.com/alexkumar',
        linkedin: 'https://linkedin.com/in/alexkumar',
        twitter: 'https://twitter.com/alexkumar',
        website: 'https://alexkumar.ai'
      },
      theme: {
        layout: 'professional',
        colorScheme: 'indigo'
      },
      status: 'published',
      isPublic: true
    }
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing sample data...');
    await User.deleteMany({ email: { $in: samplePortfolios.map(p => p.email) } });
    console.log('✅ Cleared existing data\n');

    // Create users and portfolios
    for (const data of samplePortfolios) {
      console.log(`📝 Creating portfolio for ${data.fullName}...`);
      
      // Create user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);
      
      const user = await User.create({
        name: data.fullName,
        email: data.email,
        password: hashedPassword
      });
      
      console.log(`   ✅ User created: ${user.email}`);
      
      // Create portfolio
      const portfolio = await Portfolio.create({
        ...data.portfolio,
        user: user._id
      });
      
      console.log(`   ✅ Portfolio created: ${portfolio.slug}`);
      console.log(`   🔗 Public URL: http://localhost:3000/p/${portfolio.slug}\n`);
    }

    console.log('🎉 Sample portfolios created successfully!\n');
    console.log('📋 Login Credentials:');
    console.log('==========================================');
    samplePortfolios.forEach(data => {
      console.log(`Email: ${data.email}`);
      console.log(`Password: ${data.password}`);
      console.log(`Name: ${data.fullName}`);
      console.log('------------------------------------------');
    });
    console.log('\n✨ You can now login with any of these accounts!\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit(0);
  }
};

seedDatabase();
