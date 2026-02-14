const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Import models from parent directory
const User = require(path.join(__dirname, '..', 'models', 'User'));
const Portfolio = require(path.join(__dirname, '..', 'models', 'Portfolio'));

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
        bio: 'Passionate software engineer with 5+ years of experience building scalable web applications. Specialized in React, Node.js, and modern JavaScript frameworks.'
      },
      skills: [
        { category: 'Programming Languages', name: 'JavaScript', proficiency: 90, yearsOfExperience: 5 },
        { category: 'Programming Languages', name: 'TypeScript', proficiency: 85, yearsOfExperience: 3 },
        { category: 'Programming Languages', name: 'Python', proficiency: 80, yearsOfExperience: 4 },
        { category: 'Frameworks & Libraries', name: 'React', proficiency: 95, yearsOfExperience: 5 },
        { category: 'Frameworks & Libraries', name: 'Node.js', proficiency: 90, yearsOfExperience: 5 },
        { category: 'Databases', name: 'MongoDB', proficiency: 85, yearsOfExperience: 4 },
        { category: 'Tools & Platforms', name: 'AWS', proficiency: 75, yearsOfExperience: 3 },
        { category: 'Tools & Platforms', name: 'Docker', proficiency: 80, yearsOfExperience: 3 }
      ],
      projects: [
        {
          title: 'E-Commerce Platform',
          description: 'Built a full-stack e-commerce platform with React and Node.js, featuring real-time inventory management, payment integration, and admin dashboard.',
          technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redis'],
          liveUrl: 'https://example-ecommerce.com',
          githubUrl: 'https://github.com/johndoe/ecommerce',
          featured: true
        },
        {
          title: 'AI Chatbot Assistant',
          description: 'Developed an intelligent chatbot using OpenAI GPT-4 API with context-aware conversations and sentiment analysis.',
          technologies: ['Python', 'OpenAI API', 'FastAPI', 'PostgreSQL'],
          liveUrl: 'https://example-chatbot.com',
          githubUrl: 'https://github.com/johndoe/ai-chatbot',
          featured: true
        }
      ],
      experience: [
        {
          company: 'Tech Innovators Inc.',
          position: 'Senior Full-Stack Developer',
          location: 'San Francisco, CA',
          current: true,
          description: 'Leading development of microservices architecture, mentoring junior developers, and implementing CI/CD pipelines.'
        }
      ],
      education: [
        {
          institution: 'University of California, Berkeley',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          gpa: '3.8/4.0'
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
          accent: '#F59E0B'
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
        bio: 'Creative designer and developer passionate about crafting beautiful, user-centered digital experiences.'
      },
      skills: [
        { category: 'Other', name: 'UI/UX Design', proficiency: 95, yearsOfExperience: 6 },
        { category: 'Other', name: 'Figma', proficiency: 90, yearsOfExperience: 5 },
        { category: 'Frameworks & Libraries', name: 'React', proficiency: 85, yearsOfExperience: 4 },
        { category: 'Programming Languages', name: 'JavaScript', proficiency: 80, yearsOfExperience: 4 },
        { category: 'Other', name: 'Tailwind CSS', proficiency: 90, yearsOfExperience: 3 }
      ],
      projects: [
        {
          title: 'Design System Library',
          description: 'Created a comprehensive design system used across 15+ products, including component library and style guide.',
          technologies: ['React', 'Storybook', 'Figma', 'TypeScript'],
          liveUrl: 'https://design-system.example.com',
          githubUrl: 'https://github.com/sarahchen/design-system',
          featured: true
        },
        {
          title: 'Mobile Banking App',
          description: 'Designed and prototyped a modern mobile banking application with focus on accessibility and user experience.',
          technologies: ['Figma', 'Prototyping', 'User Testing'],
          liveUrl: 'https://banking-app-demo.example.com',
          featured: true
        }
      ],
      experience: [
        {
          company: 'Creative Studios Co.',
          position: 'Senior UI/UX Designer',
          location: 'New York, NY',
          current: true,
          description: 'Leading design for multiple client projects, creating user flows, wireframes, and high-fidelity mockups.'
        }
      ],
      education: [
        {
          institution: 'Parsons School of Design',
          degree: 'Bachelor of Fine Arts',
          field: 'Design',
          gpa: 'Summa Cum Laude'
        }
      ],
      socialLinks: {
        github: 'https://github.com/sarahchen',
        linkedin: 'https://linkedin.com/in/sarahchen',
        twitter: 'https://twitter.com/sarahchen',
        dribbble: 'https://dribbble.com/sarahchen'
      },
      theme: {
        name: 'creative',
        colorScheme: {
          primary: '#EC4899',
          secondary: '#F59E0B',
          accent: '#8B5CF6'
        }
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
      title: "Alex Kumar - Data Scientist",
      personalInfo: {
        fullName: 'Alex Kumar',
        email: 'alex.kumar@example.com',
        phone: '+1 (555) 246-8135',
        location: 'Seattle, WA',
        tagline: 'Data Scientist & ML Engineer',
        bio: 'Data scientist with expertise in machine learning, deep learning, and statistical analysis.'
      },
      skills: [
        { category: 'Programming Languages', name: 'Python', proficiency: 95, yearsOfExperience: 7 },
        { category: 'Other', name: 'Machine Learning', proficiency: 90, yearsOfExperience: 5 },
        { category: 'Other', name: 'Deep Learning', proficiency: 85, yearsOfExperience: 4 },
        { category: 'Other', name: 'TensorFlow', proficiency: 85, yearsOfExperience: 4 },
        { category: 'Databases', name: 'SQL', proficiency: 90, yearsOfExperience: 6 },
        { category: 'Tools & Platforms', name: 'AWS', proficiency: 80, yearsOfExperience: 4 }
      ],
      projects: [
        {
          title: 'Customer Churn Prediction',
          description: 'Built a machine learning model to predict customer churn with 92% accuracy.',
          technologies: ['Python', 'Scikit-learn', 'XGBoost', 'Pandas'],
          githubUrl: 'https://github.com/alexkumar/churn-prediction',
          featured: true
        },
        {
          title: 'Sentiment Analysis System',
          description: 'Developed a real-time sentiment analysis system for social media monitoring using NLP techniques.',
          technologies: ['Python', 'BERT', 'FastAPI', 'PostgreSQL'],
          liveUrl: 'https://sentiment-analyzer.example.com',
          githubUrl: 'https://github.com/alexkumar/sentiment-analysis',
          featured: true
        }
      ],
      experience: [
        {
          company: 'DataTech Solutions',
          position: 'Senior Data Scientist',
          location: 'Seattle, WA',
          current: true,
          description: 'Leading ML projects for Fortune 500 clients. Building predictive models and conducting A/B tests.'
        }
      ],
      education: [
        {
          institution: 'Massachusetts Institute of Technology',
          degree: 'Master of Science',
          field: 'Computer Science',
          gpa: '4.0/4.0'
        }
      ],
      socialLinks: {
        github: 'https://github.com/alexkumar',
        linkedin: 'https://linkedin.com/in/alexkumar',
        twitter: 'https://twitter.com/alexkumar'
      },
      theme: {
        name: 'corporate',
        colorScheme: {
          primary: '#6366F1',
          secondary: '#3B82F6',
          accent: '#10B981'
        }
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
        userId: user._id
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
