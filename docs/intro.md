---
id: intro
title: Introduction
slug: /
---


# Autify Network - Complete Documentation

## Overview

Autify Network is a comprehensive climate credits platform that enables plastic recycling, carbon credit trading, and renewable energy certification. This documentation provides complete coverage of all APIs, functions, components, and database schemas.

## Documentation Structure

This project includes three comprehensive documentation files:

### 📚 [API Documentation](API_DOCUMENTATION.md)
Complete reference for all public APIs, utility functions, and core libraries.

**Covers:**
- Utility Functions (`cn`, etc.)
- Authentication & User Management (`useAuth`)
- AI Validation System (`validateBatchWithAI`)
- Certificate Generation (`generateCertificate`, `CertificateGenerator`)
- IPFS Integration (`uploadToIPFS`, `uploadJSONToIPFS`)
- Password Validation (`validatePassword`)
- Custom Hooks (`useToast`, `useIsMobile`)
- Database Integration (`supabase` client)
- Supabase Functions (AI validation, certificate generation, payments)

### 🧩 [Component Documentation](COMPONENT_DOCUMENTATION.md)
Detailed documentation for all UI components and their usage.

**Covers:**
- Layout Components (`Layout`, `Header`, `AppSidebar`)
- Authentication Components (`AuthModal`, `PasswordValidationIndicator`)
- Dashboard Components (`EnhancedDashboard`, `RecyclerDashboard`, `BuyerDashboard`)
- Batch Management Components (`BatchCard`, `BatchDetail`, `BatchVerifier`)
- Certificate Components (`CertificateDownload`, `QRCertificate`)
- Admin Components (`AdminDashboard`, `AdminApprovalQueue`)
- Utility Components (`StatsCard`, `FileViewer`, `VerificationBadge`)
- UI Components (shadcn/ui library components)

### 🗄️ [Supabase Documentation](SUPABASE_DOCUMENTATION.md)
Complete backend documentation including database schema and serverless functions.

**Covers:**
- Database Schema (all tables, views, relationships)
- Supabase Functions (AI validation, certificate generation, payments)
- Database Triggers (audit logging, hash generation)
- Row Level Security (RLS policies)
- API Endpoints (REST API usage)
- Webhooks (event system and delivery)
- Storage (file uploads and policies)
- Authentication (user management and roles)

## Quick Start Guide

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key (for AI validation)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd autify-network

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# IPFS (Infura)
VITE_INFURA_PROJECT_ID=your-infura-project-id
VITE_INFURA_PROJECT_SECRET=your-infura-project-secret

# OpenAI (for AI validation)
VITE_OPENAI_API_KEY=your-openai-api-key
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture Overview

### Frontend Architecture

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── Layout.tsx      # Main layout wrapper
│   ├── Header.tsx      # Application header
│   └── Sidebar.tsx     # Navigation sidebar
├── hooks/              # Custom React hooks
│   ├── useAuth.tsx     # Authentication hook
│   ├── useToast.ts     # Toast notifications
│   └── use-mobile.tsx  # Mobile detection
├── lib/                # Utility libraries
│   ├── aiValidation.ts # AI validation system
│   ├── certificate.ts  # Certificate generation
│   ├── ipfs.ts         # IPFS integration
│   └── utils.ts        # General utilities
├── pages/              # Page components
└── integrations/       # External integrations
    └── supabase/       # Supabase client and types
```

### Backend Architecture

```
supabase/
├── functions/          # Serverless functions
│   ├── ai-validation/  # AI batch validation
│   ├── generate-certificate/ # PDF generation
│   ├── create-payment/ # Payment processing
│   └── send-webhook-notification/ # Webhooks
├── migrations/         # Database migrations
└── config.toml        # Supabase configuration
```

## Key Features

### 🔐 Authentication & Authorization
- Multi-role user system (Recycler, Buyer, Verifier, Admin)
- Email verification workflow
- Approval system for verifiers
- Row-level security policies

### 🤖 AI-Powered Validation
- Automated batch validation using OpenAI
- Confidence scoring and issue detection
- Fallback to basic validation rules
- Configurable validation thresholds

### 📄 Certificate Generation
- Professional PDF certificates
- QR code verification
- Multiple certificate templates
- IPFS storage integration

### 🌐 IPFS Integration
- Decentralized file storage
- Photo and document uploads
- Metadata storage
- Permanent file pinning

### 💳 Payment Processing
- Credit purchase workflow
- Payment verification
- Transaction tracking
- Receipt generation

### 🔔 Webhook System
- Event-driven notifications
- Configurable webhook endpoints
- Delivery tracking and retry logic
- Secure webhook signatures

## User Roles & Permissions

### Recycler
- Submit credit batches
- Manage projects
- View sales history
- Download certificates
- Upload documentation

### Buyer
- Browse available credits
- Purchase credits
- Retire credits
- View purchase history
- Download retirement certificates

### Verifier
- Review batch submissions
- Approve/reject batches
- Upload verification documents
- Track verification history
- Quality assurance metrics

### Admin
- User management
- System configuration
- Analytics and reporting
- Webhook management
- Audit log access

## API Examples

### Authentication

```typescript
import { useAuth } from '@/hooks/useAuth'

function LoginForm() {
  const { signIn, loading } = useAuth()
  
  const handleSubmit = async (email: string, password: string) => {
    try {
      await signIn(email, password)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }
}
```

### Batch Submission

```typescript
import { supabase } from '@/integrations/supabase/client'

const submitBatch = async (batchData) => {
  const { data, error } = await supabase
    .from('batches')
    .insert({
      user_id: userId,
      project_id: projectId,
      standard: 'APRS',
      tons_or_kwh: 25.5,
      location: 'San Francisco, CA',
      date_submitted: '2024-01-15',
      description: 'Plastic waste recycling'
    })
    .select()
    .single()
}
```

### AI Validation

```typescript
import { validateBatchWithAI } from '@/lib/aiValidation'

const validateBatch = async (batchData) => {
  const result = await validateBatchWithAI(batchData, apiKey)
  
  if (result.flagged) {
    console.log('Issues found:', result.issues)
  }
}
```

### Certificate Generation

```typescript
import { CertificateGenerator } from '@/lib/certificateGenerator'

const generateCert = async (certificateData) => {
  const pdfBlob = await CertificateGenerator.generateCertificate(certificateData)
  const url = URL.createObjectURL(pdfBlob)
  window.open(url)
}
```

## Database Schema Overview

### Core Entities

```
users (1) ──── (many) projects
projects (1) ──── (many) batches
batches (1) ──── (many) credit_purchases
batches (1) ──── (many) credit_retirements
batches (1) ──── (many) verifications
users (1) ──── (many) webhooks
```

### Key Relationships

- **Users** can have multiple **Projects**
- **Projects** can have multiple **Batches**
- **Batches** can have multiple **Purchases** and **Retirements**
- **Batches** can have multiple **Verifications**
- **Users** can configure multiple **Webhooks**

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages

### Component Development

- Use functional components with hooks
- Implement proper TypeScript interfaces
- Add loading and error states
- Ensure accessibility compliance
- Write unit tests for complex logic

### Database Development

- Use migrations for schema changes
- Implement proper RLS policies
- Add audit logging for sensitive operations
- Test queries with realistic data volumes
- Monitor query performance

### Security Best Practices

- Validate all user inputs
- Use parameterized queries
- Implement proper authentication checks
- Follow OWASP security guidelines
- Regular security audits

## Testing

### Unit Tests

```bash
# Run unit tests
npm test

# Run tests with coverage
npm test -- --coverage
```

### Integration Tests

```bash
# Run integration tests
npm run test:integration
```

### E2E Tests

```bash
# Run end-to-end tests
npm run test:e2e
```

## Deployment

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Supabase Deployment

```bash
# Deploy database changes
supabase db push

# Deploy functions
supabase functions deploy

# Deploy to production
supabase link --project-ref your-project-ref
```

## Monitoring & Analytics

### Performance Monitoring

- Query performance tracking
- Function execution times
- Storage usage monitoring
- Error rate tracking

### Business Analytics

- Credit trading volume
- User activity metrics
- Verification success rates
- Revenue tracking

## Support & Contributing

### Getting Help

- Check the documentation files
- Review existing issues
- Contact the development team
- Join the community discussions

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Review Process

- All changes require review
- Tests must pass
- Documentation must be updated
- Security review for sensitive changes

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Changelog

See the [Changelog](changelog) for a complete list of changes and version history.


---

**Last Updated:** July 2025  
**Version:** 1.1.0  
**Maintainer:** Autify Network Dev Team 
