const mongoose = require('mongoose');
const slugify = require('slugify');

const PortfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  
  // Personal Information
  personalInfo: {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    tagline: {
      type: String,
      maxlength: [150, 'Tagline cannot exceed 150 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required']
    },
    phone: String,
    location: String,
    profileImage: String,
    bio: {
      type: String,
      maxlength: [1000, 'Bio cannot exceed 1000 characters']
    },
    aiEnhancedBio: String
  },
  
  // Education
  education: [{
    institution: {
      type: String,
      required: true
    },
    degree: {
      type: String,
      required: true
    },
    field: String,
    startDate: Date,
    endDate: Date,
    current: {
      type: Boolean,
      default: false
    },
    gpa: String,
    description: String,
    aiEnhancedDescription: String
  }],
  
  // Certificates & Achievements
  certificates: [{
    name: {
      type: String,
      required: true
    },
    issuer: {
      type: String,
      required: true
    },
    issueDate: String,
    expiryDate: String,
    credentialId: String,
    credentialUrl: String,
    description: String
  }],
  
  // Skills
  skills: [{
    category: {
      type: String,
      required: true,
      enum: [
        'Programming Languages',
        'Frameworks & Libraries',
        'Tools & Platforms',
        'Databases',
        'Soft Skills',
        'Other'
      ]
    },
    name: {
      type: String,
      required: true
    },
    proficiency: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },
    yearsOfExperience: {
      type: Number,
      min: 0,
      max: 50
    }
  }],
  
  // Projects
  projects: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    aiEnhancedDescription: String,
    technologies: [String],
    liveUrl: String,
    githubUrl: String,
    images: [String],
    featured: {
      type: Boolean,
      default: false
    },
    startDate: Date,
    endDate: Date,
    orderIndex: {
      type: Number,
      default: 0
    }
  }],
  
  // Experience
  experience: [{
    company: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    },
    location: String,
    startDate: Date,
    endDate: Date,
    current: {
      type: Boolean,
      default: false
    },
    description: String,
    aiEnhancedDescription: String,
    achievements: [String],
    orderIndex: {
      type: Number,
      default: 0
    }
  }],
  
  // Social Links
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String,
    portfolio: String,
    medium: String,
    dribbble: String,
    behance: String,
    stackoverflow: String
  },
  
  // Theme Configuration
  theme: {
    name: {
      type: String,
      enum: ['minimal', 'creative', 'corporate', 'modern', 'dark'],
      default: 'minimal'
    },
    colorScheme: {
      primary: {
        type: String,
        default: '#3B82F6'
      },
      secondary: {
        type: String,
        default: '#10B981'
      },
      accent: {
        type: String,
        default: '#F59E0B'
      },
      background: {
        type: String,
        default: '#FFFFFF'
      },
      text: {
        type: String,
        default: '#1F2937'
      }
    },
    fontFamily: {
      type: String,
      default: 'Inter, sans-serif'
    }
  },
  
  // Section Configuration
  sectionOrder: {
    type: [String],
    default: ['about', 'skills', 'projects', 'experience', 'education', 'contact']
  },
  
  visibleSections: {
    type: Map,
    of: Boolean,
    default: {
      about: true,
      skills: true,
      projects: true,
      experience: true,
      education: true,
      contact: true
    }
  },
  
  // Metadata
  published: {
    type: Boolean,
    default: false
  },
  
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  
  views: {
    type: Number,
    default: 0
  },
  
  version: {
    type: Number,
    default: 1
  },
  
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate unique slug before saving
PortfolioSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('personalInfo.fullName')) {
    try {
      // Create base slug from full name
      const baseSlug = this.personalInfo.fullName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      let slug = baseSlug;
      let counter = 1;
      
      // Ensure uniqueness
      while (await mongoose.models.Portfolio.findOne({ 
        slug, 
        _id: { $ne: this._id } 
      })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      this.slug = slug;
    } catch (error) {
      return next(error);
    }
  }
  
  // Update lastModified
  this.lastModified = Date.now();
  next();
});

// Indexes for faster queries
PortfolioSchema.index({ userId: 1, createdAt: -1 });
PortfolioSchema.index({ slug: 1 });
PortfolioSchema.index({ published: 1, views: -1 });
PortfolioSchema.index({ 'personalInfo.fullName': 'text', 'personalInfo.tagline': 'text' });

// Virtual for portfolio URL
PortfolioSchema.virtual('url').get(function() {
  return `/portfolio/${this.slug}`;
});

// Method to increment views
PortfolioSchema.methods.incrementViews = async function() {
  this.views += 1;
  await this.save();
};

// Method to get career level
PortfolioSchema.methods.getCareerLevel = function() {
  const totalExperience = this.experience.reduce((total, exp) => {
    const start = new Date(exp.startDate);
    const end = exp.current ? new Date() : new Date(exp.endDate);
    const years = (end - start) / (1000 * 60 * 60 * 24 * 365);
    return total + years;
  }, 0);
  
  if (totalExperience === 0) return 'student';
  if (totalExperience < 2) return 'junior';
  if (totalExperience < 5) return 'mid';
  return 'senior';
};

// Pre-save hook to auto-generate title if not provided
PortfolioSchema.pre('save', function(next) {
  if (!this.title && this.personalInfo && this.personalInfo.fullName) {
    this.title = `${this.personalInfo.fullName}'s Portfolio`;
  }
  next();
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
