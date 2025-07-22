---
id: COMPONENT_DOCUMENTATION
title: Component Guide
---

# Autify Network Component Documentation

## Table of Contents

1. [Layout Components](#layout-components)
2. [Authentication Components](#authentication-components)
3. [Dashboard Components](#dashboard-components)
4. [Batch Management Components](#batch-management-components)
5. [Certificate Components](#certificate-components)
6. [Admin Components](#admin-components)
7. [Utility Components](#utility-components)
8. [UI Components](#ui-components)

## Layout Components

### `Layout`

**Location:** `src/components/Layout.tsx`

**Description:** Main layout wrapper that provides consistent structure across pages.

**Props:**
```typescript
interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  className?: string;
}
```

**Features:**
- Responsive design
- Optional sidebar
- Header integration
- Mobile menu support

**Example:**
```typescript
import { Layout } from '@/components/Layout'

function MyPage() {
  return (
    <Layout showSidebar={true} className="custom-layout">
      <div>Page content goes here</div>
    </Layout>
  )
}
```

### `Header`

**Location:** `src/components/Header.tsx`

**Description:** Application header with navigation, user menu, and branding.

**Props:**
```typescript
interface HeaderProps {
  onMenuClick?: () => void;
}
```

**Features:**
- Responsive navigation
- User authentication status
- Role-based menu items
- Mobile menu toggle
- Live footprint indicators

**Example:**
```typescript
import { Header } from '@/components/Header'

function App() {
  const handleMobileMenu = () => {
    // Toggle mobile sidebar
  }

  return <Header onMenuClick={handleMobileMenu} />
}
```

### `AppSidebar`

**Location:** `src/components/Sidebar.tsx`

**Description:** Application sidebar with role-based navigation menu.

**Features:**
- Role-based menu items
- Collapsible design
- Active state highlighting
- Mobile responsive
- Icon support

**Menu Items by Role:**
- **Recycler**: Overview, Submit Batch, My Batches, Sales History, Certificates
- **Buyer**: Overview, Browse Credits, My Purchases, Retired Credits, Certificates
- **Verifier**: Verification Dashboard, Verification History
- **Admin**: Overview, Admin Dashboard, User Management, Analytics, etc.

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

### `TogglableLayout`

**Location:** `src/components/TogglableLayout.tsx`

**Description:** Layout component with toggleable sidebar functionality.

**Props:**
```typescript
interface TogglableLayoutProps {
  children: React.ReactNode;
  sidebarContent?: React.ReactNode;
  isSidebarOpen?: boolean;
  onSidebarToggle?: () => void;
}
```

## Authentication Components

### `AuthModal`

**Location:** `src/components/AuthModal.tsx`

**Description:** Modal component for user authentication (sign in/sign up).

**Props:**
```typescript
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
}
```

**Features:**
- Toggle between sign in and sign up
- Form validation
- Error handling
- Email verification support
- Role selection for sign up

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

### `PasswordValidationIndicator`

**Location:** `src/components/PasswordValidationIndicator.tsx`

**Description:** Visual indicator for password strength and requirements.

**Props:**
```typescript
interface PasswordValidationIndicatorProps {
  password: string;
  showRequirements?: boolean;
}
```

**Features:**
- Real-time password strength assessment
- Visual progress indicators
- Requirement checklist
- Color-coded feedback

**Example:**
```typescript
import { PasswordValidationIndicator } from '@/components/PasswordValidationIndicator'

function SignUpForm() {
  const [password, setPassword] = useState('')

  return (
    <div>
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <PasswordValidationIndicator password={password} showRequirements={true} />
    </div>
  )
}
```

## Dashboard Components

### `EnhancedDashboard`

**Location:** `src/components/EnhancedDashboard.tsx`

**Description:** Advanced dashboard with analytics, charts, and role-based content.

**Props:**
```typescript
interface EnhancedDashboardProps {
  userRole?: string;
  showAnalytics?: boolean;
  showQuickActions?: boolean;
}
```

**Features:**
- Role-based dashboard content
- Real-time statistics
- Interactive charts
- Quick action buttons
- Recent activity feed

### `RecyclerDashboard`

**Location:** `src/components/RecyclerDashboard.tsx`

**Description:** Specialized dashboard for recycler users.

**Features:**
- Batch submission statistics
- Sales performance metrics
- Credit balance display
- Recent batch status
- Quick submission form

### `BuyerDashboard`

**Location:** `src/components/BuyerDashboard.tsx`

**Description:** Specialized dashboard for credit buyers.

**Features:**
- Available credits overview
- Purchase history
- Retirement tracking
- Certificate management
- Market insights

### `VerifierDashboard`

**Location:** `src/components/VerifierDashboard.tsx`

**Description:** Dashboard for verifier users with batch verification tools.

**Features:**
- Pending verifications
- Verification history
- Quality metrics
- Batch review tools
- Status tracking

### `AccreditedAuditorDashboard`

**Location:** `src/components/AccreditedAuditorDashboard.tsx`

**Description:** Dashboard for accredited auditors with advanced verification tools.

**Features:**
- Advanced verification tools
- Audit trail management
- Compliance checking
- Report generation
- Quality assurance metrics

## Batch Management Components

### `BatchCard`

**Location:** `src/components/BatchCard.tsx`

**Description:** Card component for displaying batch information.

**Props:**
```typescript
interface BatchCardProps {
  batch: Batch;
  showActions?: boolean;
  onAction?: (action: string, batchId: string) => void;
}
```

**Features:**
- Batch status display
- Progress indicators
- Action buttons
- Detailed information
- Responsive design

### `BatchDetail`

**Location:** `src/components/BatchDetail.tsx`

**Description:** Detailed view component for individual batches.

**Props:**
```typescript
interface BatchDetailProps {
  batchId: string;
  showActions?: boolean;
  onUpdate?: () => void;
}
```

**Features:**
- Complete batch information
- Photo gallery
- Verification status
- Audit trail
- Action buttons

### `BatchPhotoGallery`

**Location:** `src/components/BatchPhotoGallery.tsx`

**Description:** Photo gallery component for batch documentation.

**Props:**
```typescript
interface BatchPhotoGalleryProps {
  photos: string[];
  batchId: string;
  allowUpload?: boolean;
  onPhotoUpload?: (file: File) => void;
}
```

**Features:**
- Image carousel
- Upload functionality
- EXIF data display
- Geolocation mapping
- Full-screen view

### `BatchStatusTimeline`

**Location:** `src/components/BatchStatusTimeline.tsx`

**Description:** Timeline component showing batch status progression.

**Props:**
```typescript
interface BatchStatusTimelineProps {
  batch: Batch;
  showDetails?: boolean;
}
```

**Features:**
- Status progression visualization
- Timestamp display
- User attribution
- Status descriptions
- Interactive elements

### `BatchVerifier`

**Location:** `src/components/BatchVerifier.tsx`

**Description:** Component for verifiers to review and approve batches.

**Props:**
```typescript
interface BatchVerifierProps {
  batchId: string;
  onVerificationComplete?: (result: VerificationResult) => void;
}
```

**Features:**
- Verification checklist
- Photo review
- Document validation
- Approval/rejection workflow
- Comments system

### `BatchHash`

**Location:** `src/components/BatchHash.tsx`

**Description:** Component for displaying and verifying batch hashes.

**Props:**
```typescript
interface BatchHashProps {
  hash: string;
  showVerification?: boolean;
  onVerify?: () => void;
}
```

**Features:**
- Hash display
- Copy to clipboard
- Verification tools
- Blockchain integration
- QR code generation

## Certificate Components

### `CertificateDownload`

**Location:** `src/components/CertificateDownload.tsx`

**Description:** Component for downloading and managing certificates.

**Props:**
```typescript
interface CertificateDownloadProps {
  certificateId: string;
  batchId: string;
  showPreview?: boolean;
}
```

**Features:**
- Certificate preview
- Download functionality
- Print support
- QR code verification
- Share options

### `QRCertificate`

**Location:** `src/components/QRCertificate.tsx`

**Description:** QR code component for certificate verification.

**Props:**
```typescript
interface QRCertificateProps {
  certificateId: string;
  batchHash: string;
  size?: number;
  showText?: boolean;
}
```

**Features:**
- QR code generation
- Verification URL encoding
- Customizable size
- Error correction
- Branding integration

## Admin Components

### `AdminDashboard`

**Location:** `src/components/AdminDashboard.tsx`

**Description:** Administrative dashboard with system management tools.

**Features:**
- User management
- System analytics
- Batch oversight
- Verification management
- System status monitoring

### `AdminApprovalQueue`

**Location:** `src/components/AdminApprovalQueue.tsx`

**Description:** Queue management for admin approvals.

**Props:**
```typescript
interface AdminApprovalQueueProps {
  queueType: 'users' | 'batches' | 'verifiers';
  onApproval?: (id: string, approved: boolean) => void;
}
```

**Features:**
- Approval workflow
- Bulk actions
- Filtering options
- Status tracking
- Audit logging

### `UserEditModal`

**Location:** `src/components/UserEditModal.tsx`

**Description:** Modal for editing user information and permissions.

**Props:**
```typescript
interface UserEditModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (userData: UserData) => void;
}
```

**Features:**
- User profile editing
- Role management
- Permission settings
- Approval status
- Activity history

### `EnhancedAdminSettings`

**Location:** `src/components/EnhancedAdminSettings.tsx`

**Description:** Advanced admin settings and configuration panel.

**Features:**
- System configuration
- Webhook management
- API key management
- Notification settings
- Security settings

## Utility Components

### `StatsCard`

**Location:** `src/components/StatsCard.tsx`

**Description:** Reusable card component for displaying statistics.

**Props:**
```typescript
interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon?: React.ReactNode;
  color?: string;
}
```

**Features:**
- Value display
- Change indicators
- Icon support
- Color customization
- Responsive design

### `FileViewer`

**Location:** `src/components/FileViewer.tsx`

**Description:** Component for viewing various file types.

**Props:**
```typescript
interface FileViewerProps {
  fileUrl: string;
  fileType: string;
  fileName?: string;
  allowDownload?: boolean;
}
```

**Features:**
- Multiple file type support
- Preview functionality
- Download options
- Full-screen view
- Error handling

### `VerificationBadge`

**Location:** `src/components/VerificationBadge.tsx`

**Description:** Badge component for displaying verification status.

**Props:**
```typescript
interface VerificationBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}
```

**Features:**
- Status-based styling
- Multiple sizes
- Text labels
- Icon support
- Accessibility features

### `LiveChatWidget`

**Location:** `src/components/LiveChatWidget.tsx`

**Description:** Live chat widget for customer support.

**Props:**
```typescript
interface LiveChatWidgetProps {
  isOpen?: boolean;
  onToggle?: () => void;
  position?: 'bottom-right' | 'bottom-left';
}
```

**Features:**
- Real-time chat
- Message history
- File sharing
- Typing indicators
- Mobile responsive

## UI Components

The project uses a comprehensive set of UI components from the shadcn/ui library. These are located in `src/components/ui/` and include:

### Core Components
- `Button` - Various button styles and variants
- `Input` - Form input fields
- `Card` - Content containers
- `Dialog` - Modal dialogs
- `DropdownMenu` - Dropdown menus
- `Form` - Form components with validation
- `Table` - Data tables
- `Tabs` - Tabbed interfaces
- `Toast` - Notification toasts

### Advanced Components
- `Accordion` - Collapsible content sections
- `Carousel` - Image/content carousels
- `Calendar` - Date picker
- `Command` - Command palette
- `Drawer` - Slide-out panels
- `HoverCard` - Hover-triggered cards
- `NavigationMenu` - Navigation menus
- `Popover` - Popover content
- `Progress` - Progress indicators
- `ScrollArea` - Custom scroll areas
- `Select` - Dropdown selects
- `Separator` - Visual separators
- `Sheet` - Slide-out sheets
- `Skeleton` - Loading placeholders
- `Slider` - Range sliders
- `Switch` - Toggle switches
- `Textarea` - Multi-line text inputs
- `Tooltip` - Hover tooltips

### Usage Example
```typescript
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Form</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter text..." />
        <Button variant="default">Submit</Button>
      </CardContent>
    </Card>
  )
}
```

## Component Best Practices

1. **Props Interface**: Always define TypeScript interfaces for component props
2. **Default Props**: Use default parameter values for optional props
3. **Error Boundaries**: Wrap components in error boundaries where appropriate
4. **Loading States**: Include loading states for async operations
5. **Accessibility**: Ensure components meet accessibility standards
6. **Responsive Design**: Make components mobile-friendly
7. **Performance**: Use React.memo for expensive components
8. **Testing**: Write unit tests for complex components

## Styling Guidelines

1. **Tailwind CSS**: Use Tailwind classes for styling
2. **Component Variants**: Use class-variance-authority for component variants
3. **Dark Mode**: Support dark mode where applicable
4. **Consistent Spacing**: Use consistent spacing scales
5. **Color System**: Follow the established color palette
6. **Typography**: Use consistent font sizes and weights

## Component Composition

Components should be composed to promote reusability:

```typescript
// Good: Composable components
function Dashboard() {
  return (
    <Layout>
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard title="Total Credits" value="1,234" />
        <StatsCard title="Active Batches" value="56" />
        <StatsCard title="Revenue" value="$12,345" />
      </div>
    </Layout>
  )
}
``` 
