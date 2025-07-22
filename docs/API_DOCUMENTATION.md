---
id: API_DOCUMENTATION
title: API Reference
---

# Autify Network API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Utility Functions](#utility-functions)
3. [Authentication & User Management](#authentication--user-management)
4. [AI Validation System](#ai-validation-system)
5. [Certificate Generation](#certificate-generation)
6. [IPFS Integration](#ipfs-integration)
7. [Password Validation](#password-validation)
8. [Custom Hooks](#custom-hooks)
9. [UI Components](#ui-components)
10. [Database Integration](#database-integration)
11. [Supabase Functions](#supabase-functions)

## Overview

Autify Network is a comprehensive climate credits platform that enables plastic recycling, carbon credit trading, and renewable energy certification. This documentation covers all public APIs, functions, and components available for developers.

## Utility Functions

### `cn(...inputs: ClassValue[]): string`

**Location:** `src/lib/utils.ts`

**Description:** Utility function for combining CSS classes with Tailwind CSS merge functionality.

**Parameters:**
- `inputs`: Variable number of class values (strings, objects, arrays)

**Returns:** Merged class string

**Example:**
```typescript
import { cn } from '@/lib/utils'

const className = cn(
  'base-class',
  condition && 'conditional-class',
  { 'object-class': true }
)
// Returns: "base-class conditional-class object-class"
```

## Authentication & User Management

### `useAuth()`

**Location:** `src/hooks/useAuth.tsx`

**Description:** Custom hook for managing authentication state and user data.

**Returns:**
```typescript
{
  user: User | null;                    // Supabase user object
  appUser: AppUser | null;              // Extended user data
  loading: boolean;                     // Loading state
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
}
```

**Types:**
```typescript
interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'recycler' | 'buyer' | 'verifier' | 'admin';
  organization_name?: string;
  created_at: string;
  approval_status?: 'pending' | 'approved' | 'rejected';
  verification_status?: 'pending' | 'approved' | 'rejected' | 'under_review';
  assigned_role?: string;
  mobile?: string;
  kyb_document_urls?: string[];
  license_number?: string;
  compliance_certifications?: string[];
  rejection_reason?: string;
  approved_by?: string;
  approved_at?: string;
  sub_role?: 'field_agent' | 'desk_verifier' | 'accredited_auditor';
}

interface SignUpData {
  name: string;
  role: 'recycler' | 'buyer' | 'verifier';
  organization_name?: string;
}
```

**Example:**
```typescript
import { useAuth } from '@/hooks/useAuth'

function MyComponent() {
  const { user, appUser, loading, signIn, signOut } = useAuth()

  if (loading) return <div>Loading...</div>
  
  if (!user) {
    return <button onClick={() => signIn('user@example.com', 'password')}>
      Sign In
    </button>
  }

  return (
    <div>
      <p>Welcome, {appUser?.name}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

## AI Validation System

### `validateBatchWithAI(data: BatchValidationData, apiKey?: string): Promise<AIValidationResult>`

**Location:** `src/lib/aiValidation.ts`

**Description:** Validates batch submissions using AI analysis with fallback to basic validation.

**Parameters:**
- `data`: Batch validation data
- `apiKey`: Optional OpenAI API key

**Types:**
```typescript
interface BatchValidationData {
  standard: string;           // 'APRS' | 'ARCS' | 'AEMAS'
  tons_or_kwh: number;        // Amount in tons or kWh
  location: string;           // Location string
  date_submitted: string;     // ISO date string
  description?: string;       // Optional description
}

interface AIValidationResult {
  flagged: boolean;           // Whether batch should be flagged
  confidence: number;         // Confidence score (0-1)
  issues: string[];           // List of issues found
  summary: string;            // Brief summary
  recommendations: string[];  // List of recommendations
}
```

**Example:**
```typescript
import { validateBatchWithAI } from '@/lib/aiValidation'

const batchData = {
  standard: 'APRS',
  tons_or_kwh: 25.5,
  location: 'San Francisco, CA',
  date_submitted: '2024-01-15',
  description: 'Plastic waste from local recycling center'
}

const result = await validateBatchWithAI(batchData, 'your-openai-key')
console.log(result.flagged) // true/false
console.log(result.issues)  // ['Unusually high tonnage for plastic recycling']
```

## Certificate Generation

### `generateCertificate(data: CertificateData): Promise<Blob>`

**Location:** `src/lib/certificate.ts`

**Description:** Generates a PDF certificate for credit retirement.

**Parameters:**
- `data`: Certificate data object

**Types:**
```typescript
interface CertificateData {
  batch: Batch;               // Batch data from database
  project: Project;           // Project data from database
  buyer: User;                // Buyer user data
  retirement_date: string;    // Retirement date
  certificate_id: string;     // Unique certificate ID
}
```

**Returns:** PDF blob

**Example:**
```typescript
import { generateCertificate } from '@/lib/certificate'

const certificateData = {
  batch: batchRecord,
  project: projectRecord,
  buyer: userRecord,
  retirement_date: '2024-01-15',
  certificate_id: 'CERT-2024-001'
}

const pdfBlob = await generateCertificate(certificateData)
const url = URL.createObjectURL(pdfBlob)
window.open(url)
```

### `CertificateGenerator.generateCertificate(data: CertificateData): Promise<Blob>`

**Location:** `src/lib/certificateGenerator.ts`

**Description:** Advanced certificate generator with enhanced styling and features.

**Parameters:**
- `data`: Extended certificate data

**Types:**
```typescript
interface CertificateData {
  certificateId: string;
  batchId: string;
  batchHash: string;
  retirementDate: string;
  retirementId: string;
  buyerName: string;
  buyerOrganization?: string;
  plasticCredits: number;
  carbonCredits: number;
  projectName: string;
  recyclerName: string;
  recyclerOrganization?: string;
  projectLocation: string;
  standard: string;
  verificationDate?: string;
  verifierName?: string;
  verifierOrganization?: string;
  accreditedAuditor?: {
    name: string;
    firm: string;
    certificateNumber: string;
  };
  registryUrl: string;
  recyclerVerified?: boolean;
  totalPlasticCredits: number;
  totalCarbonCredits: number;
  totalPlasticRetired: number;
  totalCarbonRetired: number;
}
```

**Example:**
```typescript
import { CertificateGenerator } from '@/lib/certificateGenerator'

const data = {
  certificateId: 'CERT-2024-001',
  batchId: 'BATCH-001',
  batchHash: '0x123...',
  retirementDate: '2024-01-15',
  retirementId: 'RET-001',
  buyerName: 'John Doe',
  buyerOrganization: 'Eco Corp',
  plasticCredits: 25.5,
  carbonCredits: 12.3,
  projectName: 'San Francisco Recycling',
  recyclerName: 'Green Recyclers',
  projectLocation: 'San Francisco, CA',
  standard: 'APRS',
  registryUrl: 'https://registry.autify.network',
  totalPlasticCredits: 100,
  totalCarbonCredits: 50,
  totalPlasticRetired: 75.5,
  totalCarbonRetired: 37.8
}

const pdfBlob = await CertificateGenerator.generateCertificate(data)
```

### `CertificateGenerator.generateCertificateId(batchId: string, buyerId: string): string`

**Description:** Generates a unique certificate ID.

**Parameters:**
- `batchId`: Batch identifier
- `buyerId`: Buyer identifier

**Returns:** Unique certificate ID string

**Example:**
```typescript
const certificateId = CertificateGenerator.generateCertificateId('BATCH-001', 'USER-123')
// Returns: "CERT-BATCH-001-USER-123-20240115"
```

## IPFS Integration

### `uploadToIPFS(file: File | Blob, filename?: string): Promise<IPFSFile>`

**Location:** `src/lib/ipfs.ts`

**Description:** Uploads a file to IPFS using Infura gateway.

**Parameters:**
- `file`: File or Blob to upload
- `filename`: Optional filename

**Returns:**
```typescript
interface IPFSFile {
  path: string;    // IPFS path
  hash: string;    // IPFS hash
  size: number;    // File size in bytes
}
```

**Example:**
```typescript
import { uploadToIPFS } from '@/lib/ipfs'

const file = new File(['content'], 'document.pdf', { type: 'application/pdf' })
const result = await uploadToIPFS(file, 'certificate.pdf')
console.log(result.hash) // "QmHash..."
```

### `uploadJSONToIPFS(data: any, filename?: string): Promise<IPFSFile>`

**Description:** Uploads JSON data to IPFS.

**Parameters:**
- `data`: JSON data to upload
- `filename`: Optional filename (defaults to 'metadata.json')

**Example:**
```typescript
import { uploadJSONToIPFS } from '@/lib/ipfs'

const metadata = {
  name: 'Batch Certificate',
  description: 'Plastic recycling certificate',
  date: '2024-01-15'
}

const result = await uploadJSONToIPFS(metadata, 'batch-metadata.json')
```

### `getIPFSUrl(hash: string): string`

**Description:** Generates IPFS gateway URL for a hash.

**Parameters:**
- `hash`: IPFS hash

**Returns:** Full IPFS URL

**Example:**
```typescript
import { getIPFSUrl } from '@/lib/ipfs'

const url = getIPFSUrl('QmHash...')
// Returns: "https://ipfs.io/ipfs/QmHash..."
```

### `pinToIPFS(hash: string): Promise<void>`

**Description:** Pins a file to IPFS to ensure persistence.

**Parameters:**
- `hash`: IPFS hash to pin

**Example:**
```typescript
import { pinToIPFS } from '@/lib/ipfs'

await pinToIPFS('QmHash...')
```

## Password Validation

### `validatePassword(password: string): PasswordValidation`

**Location:** `src/lib/passwordValidation.ts`

**Description:** Validates password strength and requirements.

**Parameters:**
- `password`: Password string to validate

**Returns:**
```typescript
interface PasswordValidation {
  isValid: boolean;
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
  score: number; // 0-5 based on requirements met
}
```

**Example:**
```typescript
import { validatePassword } from '@/lib/passwordValidation'

const result = validatePassword('MyPassword123!')
console.log(result.isValid) // true
console.log(result.score)   // 5
console.log(result.requirements.hasUppercase) // true
```

### `getPasswordStrengthText(score: number): string`

**Description:** Returns human-readable password strength text.

**Parameters:**
- `score`: Password strength score (0-5)

**Returns:** Strength description

**Example:**
```typescript
import { getPasswordStrengthText } from '@/lib/passwordValidation'

const strength = getPasswordStrengthText(4) // "Good"
```

### `getPasswordStrengthColor(score: number): string`

**Description:** Returns Tailwind CSS class for password strength color.

**Parameters:**
- `score`: Password strength score (0-5)

**Returns:** CSS class name

**Example:**
```typescript
import { getPasswordStrengthColor } from '@/lib/passwordValidation'

const colorClass = getPasswordStrengthColor(4) // "text-success"
```

## Custom Hooks

### `useToast()`

**Location:** `src/hooks/use-toast.ts`

**Description:** Custom hook for managing toast notifications.

**Returns:**
```typescript
{
  toasts: ToasterToast[];
  toast: (props: ToastProps) => ToastReturn;
  dismiss: (toastId?: string) => void;
}
```

**Example:**
```typescript
import { useToast } from '@/hooks/use-toast'

function MyComponent() {
  const { toast } = useToast()

  const showSuccess = () => {
    toast({
      title: "Success!",
      description: "Operation completed successfully.",
      variant: "default"
    })
  }

  return <button onClick={showSuccess}>Show Toast</button>
}
```

### `useIsMobile(): boolean`

**Location:** `src/hooks/use-mobile.tsx`

**Description:** Hook to detect mobile screen size (breakpoint: 768px).

**Returns:** Boolean indicating if screen is mobile

**Example:**
```typescript
import { useIsMobile } from '@/hooks/use-mobile'

function ResponsiveComponent() {
  const isMobile = useIsMobile()

  return (
    <div className={isMobile ? 'mobile-layout' : 'desktop-layout'}>
      Content
    </div>
  )
}
```

## UI Components

### `Header`

**Location:** `src/components/Header.tsx`

**Description:** Main application header with navigation and user menu.

**Props:**
```typescript
interface HeaderProps {
  onMenuClick?: () => void;  // Mobile menu toggle callback
}
```

**Example:**
```typescript
import { Header } from '@/components/Header'

function App() {
  const handleMenuClick = () => {
    // Toggle mobile sidebar
  }

  return <Header onMenuClick={handleMenuClick} />
}
```

### `AppSidebar`

**Location:** `src/components/Sidebar.tsx`

**Description:** Application sidebar with role-based navigation.

**Features:**
- Role-based menu items
- Collapsible design
- Active state highlighting
- Mobile responsive

**Example:**
```typescript
import { AppSidebar } from '@/components/Sidebar'

function Layout() {
  return (
    <div className="flex">
      <AppSidebar />
      <main>Content</main>
    </div>
  )
}
```

### `Layout`

**Location:** `src/components/Layout.tsx`

**Description:** Main layout wrapper with header, sidebar, and content area.

**Props:**
```typescript
interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  className?: string;
}
```

**Example:**
```typescript
import { Layout } from '@/components/Layout'

function MyPage() {
  return (
    <Layout showSidebar={true}>
      <h1>My Page Content</h1>
    </Layout>
  )
}
```

### `AuthModal`

**Location:** `src/components/AuthModal.tsx`

**Description:** Modal for user authentication (sign in/sign up).

**Props:**
```typescript
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
}
```

**Example:**
```typescript
import { AuthModal } from '@/components/AuthModal'

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false)

  return (
    <AuthModal 
      isOpen={isAuthOpen} 
      onClose={() => setIsAuthOpen(false)}
      defaultMode="signin"
    />
  )
}
```

## Database Integration

### `supabase`

**Location:** `src/integrations/supabase/client.ts`

**Description:** Supabase client instance for database operations.

**Configuration:**
- URL: `https://wbdmviwabrxzepfriqiy.supabase.co`
- Storage: localStorage
- Auto refresh: enabled

**Example:**
```typescript
import { supabase } from '@/integrations/supabase/client'

// Query data
const { data, error } = await supabase
  .from('batches')
  .select('*')
  .eq('user_id', userId)

// Insert data
const { data, error } = await supabase
  .from('batches')
  .insert({
    user_id: userId,
    standard: 'APRS',
    tons_or_kwh: 25.5,
    location: 'San Francisco, CA'
  })

// Update data
const { data, error } = await supabase
  .from('batches')
  .update({ status: 'approved' })
  .eq('id', batchId)

// Delete data
const { error } = await supabase
  .from('batches')
  .delete()
  .eq('id', batchId)
```

## Supabase Functions

### AI Validation Function

**Location:** `supabase/functions/ai-validation/index.ts`

**Description:** Serverless function for AI-powered batch validation.

**Endpoint:** `POST /functions/v1/ai-validation`

**Request Body:**
```typescript
{
  batch_data: BatchValidationData;
  api_key?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  result: AIValidationResult;
  error?: string;
}
```

### Certificate Generation Function

**Location:** `supabase/functions/generate-certificate/index.ts`

**Description:** Serverless function for generating certificates.

**Endpoint:** `POST /functions/v1/generate-certificate`

**Request Body:**
```typescript
{
  certificate_data: CertificateData;
}
```

**Response:**
```typescript
{
  success: boolean;
  certificate_url?: string;
  error?: string;
}
```

### Payment Functions

**Location:** `supabase/functions/create-payment/index.ts` and `supabase/functions/verify-payment/index.ts`

**Description:** Functions for handling credit purchases and payments.

**Endpoints:**
- `POST /functions/v1/create-payment`
- `POST /functions/v1/verify-payment`

### Webhook Functions

**Location:** `supabase/functions/send-webhook-notification/index.ts`

**Description:** Function for sending webhook notifications to external systems.

**Endpoint:** `POST /functions/v1/send-webhook-notification`

## Environment Variables

The following environment variables are required:

```bash
# Supabase
VITE_SUPABASE_URL=https://wbdmviwabrxzepfriqiy.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# IPFS (Infura)
VITE_INFURA_PROJECT_ID=your-infura-project-id
VITE_INFURA_PROJECT_SECRET=your-infura-project-secret

# OpenAI (for AI validation)
VITE_OPENAI_API_KEY=your-openai-api-key
```

## Error Handling

All functions follow consistent error handling patterns:

```typescript
try {
  const result = await someFunction()
  // Handle success
} catch (error) {
  console.error('Function error:', error)
  // Handle error appropriately
}
```

## TypeScript Support

The project includes comprehensive TypeScript definitions in `src/integrations/supabase/types.ts` for all database tables and relationships.

## Best Practices

1. **Authentication**: Always check user authentication before accessing protected resources
2. **Error Handling**: Implement proper error handling for all async operations
3. **Loading States**: Show loading indicators for better UX
4. **Validation**: Use the provided validation functions for data integrity
5. **Responsive Design**: Use the `useIsMobile` hook for responsive layouts
6. **Toast Notifications**: Use the `useToast` hook for user feedback
7. **File Uploads**: Use IPFS functions for decentralized file storage
8. **Certificate Generation**: Use the certificate generators for official documents

## Getting Started

1. Install dependencies: `npm install`
2. Set up environment variables
3. Start development server: `npm run dev`
4. Access the application at `http://localhost:5173`

## Support

For technical support or questions about the API, please refer to the project documentation or contact the development team. 
