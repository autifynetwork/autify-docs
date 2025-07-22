---
id: SUPABASE_DOCUMENTATION
title: Supabase Architecture
---


# Autify Network Supabase Documentation

## Table of Contents

1. [Database Schema](#database-schema)
2. [Supabase Functions](#supabase-functions)
3. [Database Triggers](#database-triggers)
4. [Row Level Security (RLS)](#row-level-security-rls)
5. [API Endpoints](#api-endpoints)
6. [Webhooks](#webhooks)
7. [Storage](#storage)
8. [Authentication](#authentication)

## Database Schema

### Core Tables

#### `users`
Primary user table with extended profile information.

```sql
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('recycler', 'buyer', 'verifier', 'admin')) NOT NULL,
  organization_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approval_status TEXT CHECK (approval_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  verification_status TEXT CHECK (verification_status IN ('pending', 'approved', 'rejected', 'under_review')) DEFAULT 'pending',
  assigned_role TEXT,
  mobile TEXT,
  kyb_document_urls TEXT[],
  license_number TEXT,
  compliance_certifications TEXT[],
  rejection_reason TEXT,
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  sub_role TEXT CHECK (sub_role IN ('field_agent', 'desk_verifier', 'accredited_auditor')),
  last_login TIMESTAMP WITH TIME ZONE
);
```

#### `projects`
Projects that generate credits.

```sql
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  standard TEXT CHECK (standard IN ('APRS', 'ARCS', 'AEMAS', 'ACCCS', 'AMCAVS', 'PCX')) NOT NULL,
  location TEXT NOT NULL,
  coordinates POINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT CHECK (status IN ('active', 'inactive', 'suspended')) DEFAULT 'active',
  verification_required BOOLEAN DEFAULT true,
  credit_price DECIMAL(10,2),
  total_credits_generated DECIMAL(10,2) DEFAULT 0,
  total_credits_sold DECIMAL(10,2) DEFAULT 0
);
```

#### `batches`
Individual credit batches submitted by recyclers.

```sql
CREATE TABLE batches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  project_id UUID REFERENCES projects(id) NOT NULL,
  batch_hash TEXT UNIQUE NOT NULL,
  standard TEXT CHECK (standard IN ('APRS', 'ARCS', 'AEMAS', 'ACCCS', 'AMCAVS', 'PCX')) NOT NULL,
  tons_or_kwh DECIMAL(10,2) NOT NULL,
  location TEXT NOT NULL,
  date_submitted DATE NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'verified', 'retired')) DEFAULT 'pending',
  calculated_plastic_credits DECIMAL(10,2) DEFAULT 0,
  calculated_carbon_credits DECIMAL(10,2) DEFAULT 0,
  verification_score DECIMAL(3,2),
  verification_notes TEXT,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  photos TEXT[],
  documents TEXT[],
  ai_validation_result JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `credit_purchases`
Records of credit purchases by buyers.

```sql
CREATE TABLE credit_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID REFERENCES users(id) NOT NULL,
  batch_id UUID REFERENCES batches(id) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  price_per_credit DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status TEXT CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  payment_method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `credit_retirements`
Records of credit retirements.

```sql
CREATE TABLE credit_retirements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID REFERENCES users(id) NOT NULL,
  batch_id UUID REFERENCES batches(id) NOT NULL,
  certificate_id TEXT UNIQUE NOT NULL,
  plastic_credits_retired DECIMAL(10,2) NOT NULL,
  carbon_credits_retired DECIMAL(10,2) NOT NULL,
  retirement_date DATE NOT NULL,
  retirement_reason TEXT,
  certificate_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `verifications`
Verification records for batches.

```sql
CREATE TABLE verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id UUID REFERENCES batches(id) NOT NULL,
  verifier_id UUID REFERENCES users(id) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) NOT NULL,
  score DECIMAL(3,2),
  notes TEXT,
  photos TEXT[],
  documents TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `audit_logs`
System audit trail.

```sql
CREATE TABLE audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `webhooks`
Webhook configurations.

```sql
CREATE TABLE webhooks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL,
  secret TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `webhook_deliveries`
Webhook delivery logs.

```sql
CREATE TABLE webhook_deliveries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  webhook_id UUID REFERENCES webhooks(id) NOT NULL,
  event TEXT NOT NULL,
  payload JSONB NOT NULL,
  response_status INTEGER,
  response_body TEXT,
  delivery_time_ms INTEGER,
  success BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Views

#### `batch_summary_view`
Aggregated batch statistics.

```sql
CREATE VIEW batch_summary_view AS
SELECT 
  b.id,
  b.batch_hash,
  b.standard,
  b.status,
  b.tons_or_kwh,
  b.calculated_plastic_credits,
  b.calculated_carbon_credits,
  b.date_submitted,
  u.name as recycler_name,
  u.organization_name as recycler_organization,
  p.name as project_name,
  p.location as project_location,
  COALESCE(cp.total_purchased, 0) as total_purchased,
  COALESCE(cr.total_retired, 0) as total_retired
FROM batches b
JOIN users u ON b.user_id = u.id
JOIN projects p ON b.project_id = p.id
LEFT JOIN (
  SELECT batch_id, SUM(amount) as total_purchased
  FROM credit_purchases
  GROUP BY batch_id
) cp ON b.id = cp.batch_id
LEFT JOIN (
  SELECT batch_id, SUM(plastic_credits_retired + carbon_credits_retired) as total_retired
  FROM credit_retirements
  GROUP BY batch_id
) cr ON b.id = cr.batch_id;
```

## Supabase Functions

### AI Validation Function

**Location:** `supabase/functions/ai-validation/index.ts`

**Purpose:** Validates batch submissions using AI analysis.

**Endpoint:** `POST /functions/v1/ai-validation`

**Request Body:**
```typescript
{
  batch_data: {
    standard: string;
    tons_or_kwh: number;
    location: string;
    date_submitted: string;
    description?: string;
  };
  api_key?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  result: {
    flagged: boolean;
    confidence: number;
    issues: string[];
    summary: string;
    recommendations: string[];
  };
  error?: string;
}
```

**Example Usage:**
```typescript
const response = await fetch('/functions/v1/ai-validation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${supabaseKey}`
  },
  body: JSON.stringify({
    batch_data: {
      standard: 'APRS',
      tons_or_kwh: 25.5,
      location: 'San Francisco, CA',
      date_submitted: '2024-01-15',
      description: 'Plastic waste from local recycling center'
    }
  })
});

const result = await response.json();
```

### Certificate Generation Function

**Location:** `supabase/functions/generate-certificate/index.ts`

**Purpose:** Generates PDF certificates for credit retirements.

**Endpoint:** `POST /functions/v1/generate-certificate`

**Request Body:**
```typescript
{
  certificate_data: {
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
    registryUrl: string;
    // ... other fields
  };
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

#### Create Payment

**Location:** `supabase/functions/create-payment/index.ts`

**Purpose:** Creates payment records for credit purchases.

**Endpoint:** `POST /functions/v1/create-payment`

**Request Body:**
```typescript
{
  buyer_id: string;
  batch_id: string;
  amount: number;
  price_per_credit: number;
  payment_method: string;
}
```

#### Verify Payment

**Location:** `supabase/functions/verify-payment/index.ts`

**Purpose:** Verifies payment completion.

**Endpoint:** `POST /functions/v1/verify-payment`

**Request Body:**
```typescript
{
  transaction_id: string;
  payment_status: 'completed' | 'failed';
}
```

### Webhook Functions

#### Send Webhook Notification

**Location:** `supabase/functions/send-webhook-notification/index.ts`

**Purpose:** Sends webhook notifications to external systems.

**Endpoint:** `POST /functions/v1/send-webhook-notification`

**Request Body:**
```typescript
{
  webhook_id: string;
  event: string;
  payload: any;
}
```

### Support Functions

#### Send Support Email

**Location:** `supabase/functions/send-support-email/index.ts`

**Purpose:** Sends support emails to users.

**Endpoint:** `POST /functions/v1/send-support-email`

**Request Body:**
```typescript
{
  user_id: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
}
```

## Database Triggers

### Audit Log Trigger

Automatically logs changes to important tables.

```sql
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, new_values)
    VALUES (auth.uid(), 'INSERT', TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (auth.uid(), 'UPDATE', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values)
    VALUES (auth.uid(), 'DELETE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply to important tables
CREATE TRIGGER audit_batches_trigger
  AFTER INSERT OR UPDATE OR DELETE ON batches
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_users_trigger
  AFTER INSERT OR UPDATE OR DELETE ON users
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
```

### Batch Hash Generation

Automatically generates batch hashes.

```sql
CREATE OR REPLACE FUNCTION generate_batch_hash()
RETURNS TRIGGER AS $$
BEGIN
  NEW.batch_hash := 'BATCH-' || encode(gen_random_bytes(16), 'hex');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_batch_hash_trigger
  BEFORE INSERT ON batches
  FOR EACH ROW EXECUTE FUNCTION generate_batch_hash();
```

### Updated At Trigger

Automatically updates the `updated_at` timestamp.

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at columns
CREATE TRIGGER update_batches_updated_at
  BEFORE UPDATE ON batches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Row Level Security (RLS)

### Users Table RLS

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can only see their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Batches Table RLS

```sql
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;

-- Recyclers can view their own batches
CREATE POLICY "Recyclers can view own batches" ON batches
  FOR SELECT USING (
    user_id = auth.uid() OR
    status IN ('approved', 'verified', 'retired')
  );

-- Recyclers can insert their own batches
CREATE POLICY "Recyclers can insert own batches" ON batches
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Verifiers can view batches for verification
CREATE POLICY "Verifiers can view batches for verification" ON batches
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'verifier'
    )
  );

-- Admins can view all batches
CREATE POLICY "Admins can view all batches" ON batches
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Projects Table RLS

```sql
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Users can view their own projects
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (user_id = auth.uid());

-- Users can insert their own projects
CREATE POLICY "Users can insert own projects" ON projects
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own projects
CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (user_id = auth.uid());
```

## API Endpoints

### REST API Endpoints

All database operations are available through Supabase's auto-generated REST API:

#### Users
- `GET /rest/v1/users` - List users (admin only)
- `GET /rest/v1/users?id=eq.{id}` - Get specific user
- `PATCH /rest/v1/users?id=eq.{id}` - Update user
- `DELETE /rest/v1/users?id=eq.{id}` - Delete user (admin only)

#### Batches
- `GET /rest/v1/batches` - List batches
- `GET /rest/v1/batches?id=eq.{id}` - Get specific batch
- `POST /rest/v1/batches` - Create new batch
- `PATCH /rest/v1/batches?id=eq.{id}` - Update batch
- `DELETE /rest/v1/batches?id=eq.{id}` - Delete batch

#### Projects
- `GET /rest/v1/projects` - List projects
- `GET /rest/v1/projects?id=eq.{id}` - Get specific project
- `POST /rest/v1/projects` - Create new project
- `PATCH /rest/v1/projects?id=eq.{id}` - Update project
- `DELETE /rest/v1/projects?id=eq.{id}` - Delete project

#### Credit Purchases
- `GET /rest/v1/credit_purchases` - List purchases
- `POST /rest/v1/credit_purchases` - Create purchase
- `PATCH /rest/v1/credit_purchases?id=eq.{id}` - Update purchase

#### Credit Retirements
- `GET /rest/v1/credit_retirements` - List retirements
- `POST /rest/v1/credit_retirements` - Create retirement

### Example API Usage

```typescript
import { supabase } from '@/integrations/supabase/client'

// Get user's batches
const { data: batches, error } = await supabase
  .from('batches')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })

// Create new batch
const { data: batch, error } = await supabase
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

// Update batch status
const { error } = await supabase
  .from('batches')
  .update({ status: 'approved' })
  .eq('id', batchId)
```

## Webhooks

### Webhook Events

The system supports the following webhook events:

- `batch.created` - New batch submitted
- `batch.updated` - Batch status changed
- `batch.approved` - Batch approved
- `batch.rejected` - Batch rejected
- `batch.verified` - Batch verified
- `purchase.completed` - Credit purchase completed
- `retirement.created` - Credits retired
- `user.registered` - New user registered
- `user.approved` - User approved
- `user.rejected` - User rejected

### Webhook Configuration

```typescript
// Create webhook
const { data: webhook, error } = await supabase
  .from('webhooks')
  .insert({
    user_id: userId,
    name: 'My Webhook',
    url: 'https://myapp.com/webhook',
    events: ['batch.created', 'batch.approved'],
    secret: 'webhook-secret-key'
  })
  .select()
  .single()
```

### Webhook Payload Example

```json
{
  "event": "batch.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "id": "batch-uuid",
    "batch_hash": "BATCH-abc123",
    "standard": "APRS",
    "tons_or_kwh": 25.5,
    "status": "pending",
    "user_id": "user-uuid",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

## Storage

### File Storage

Supabase Storage is used for file uploads:

#### Buckets
- `batch-photos` - Batch documentation photos
- `user-documents` - User KYB documents
- `certificates` - Generated certificates
- `verification-docs` - Verification documents

#### Storage Policies

```sql
-- Users can upload to their own batch photos
CREATE POLICY "Users can upload batch photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'batch-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can view their own batch photos
CREATE POLICY "Users can view own batch photos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'batch-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

#### File Upload Example

```typescript
import { supabase } from '@/integrations/supabase/client'

// Upload batch photo
const { data, error } = await supabase.storage
  .from('batch-photos')
  .upload(`${userId}/${batchId}/photo1.jpg`, file)

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('batch-photos')
  .getPublicUrl(`${userId}/${batchId}/photo1.jpg`)
```

## Authentication

### Auth Configuration

Supabase Auth is configured with:

- **Provider**: Email/Password
- **Storage**: localStorage
- **Auto Refresh**: Enabled
- **Session Persistence**: Enabled

### User Roles

The system supports four user roles:

1. **Recycler** - Can submit batches and manage projects
2. **Buyer** - Can purchase and retire credits
3. **Verifier** - Can verify batches
4. **Admin** - Full system access

### Role Assignment

Roles are assigned during user registration and can be changed by admins:

```typescript
// During signup
const { error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
  options: {
    data: {
      name: 'John Doe',
      role: 'recycler',
      organization_name: 'Green Recyclers'
    }
  }
})

// Admin role change
const { error } = await supabase
  .from('users')
  .update({ role: 'verifier' })
  .eq('id', userId)
```

### Approval Workflow

Users go through an approval process:

1. **Registration** - User signs up with role
2. **Pending** - Admin review required
3. **Approved** - User can access system
4. **Rejected** - User access denied

### Session Management

```typescript
// Get current session
const { data: { session } } = await supabase.auth.getSession()

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // User signed in
  } else if (event === 'SIGNED_OUT') {
    // User signed out
  }
})

// Sign out
const { error } = await supabase.auth.signOut()
```

## Database Functions

### Custom SQL Functions

#### `record_user_login(user_id UUID)`

Records user login activity.

```sql
CREATE OR REPLACE FUNCTION record_user_login(user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE users 
  SET last_login = NOW() 
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;
```

#### `calculate_batch_credits(batch_id UUID)`

Calculates credit amounts for a batch.

```sql
CREATE OR REPLACE FUNCTION calculate_batch_credits(batch_id UUID)
RETURNS VOID AS $$
DECLARE
  batch_record RECORD;
BEGIN
  SELECT * INTO batch_record FROM batches WHERE id = batch_id;
  
  UPDATE batches 
  SET 
    calculated_plastic_credits = CASE 
      WHEN standard = 'APRS' THEN tons_or_kwh
      ELSE 0 
    END,
    calculated_carbon_credits = CASE 
      WHEN standard IN ('ARCS', 'AEMAS') THEN tons_or_kwh
      ELSE 0 
    END
  WHERE id = batch_id;
END;
$$ LANGUAGE plpgsql;
```

## Best Practices

### Security

1. **Always use RLS policies** for data access control
2. **Validate input data** before database operations
3. **Use parameterized queries** to prevent SQL injection
4. **Implement rate limiting** for API endpoints
5. **Log all sensitive operations** in audit logs

### Performance

1. **Use indexes** on frequently queried columns
2. **Implement pagination** for large datasets
3. **Use materialized views** for complex aggregations
4. **Optimize queries** with proper joins
5. **Cache frequently accessed data**

### Data Integrity

1. **Use foreign key constraints** to maintain referential integrity
2. **Implement check constraints** for data validation
3. **Use triggers** for automatic data updates
4. **Regular backups** of production data
5. **Test migrations** in staging environment

### Monitoring

1. **Monitor query performance** with pg_stat_statements
2. **Track webhook delivery** success rates
3. **Monitor storage usage** and costs
4. **Alert on system errors** and failures
5. **Regular security audits** of policies and permissions 
