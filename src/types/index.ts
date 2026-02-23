// Authentication
export interface User {
  id: string;
  role: "crew" | "admin";
  fullName: string;
  initials: string;
  jobTitle: string;
  email?: string;
  phoneNumber?: string;
  pin?: string; // Hashed
  biometricEnabled: boolean;
  companyId: string;
  avatarUrl?: string;
  createdAt: number;
  lastLoginAt: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  pinSetup: boolean;
}

// Schedule & Location
export interface JobSite {
  id: string;
  companyId: string;
  name: string;
  address: string;
  coordinates: { latitude: number; longitude: number };
  projectId?: string;
  status: "active" | "upcoming" | "completed";
  createdAt: number;
}

export interface Schedule {
  id: string;
  companyId: string;
  jobSiteId: string;
  date: string; // YYYY-MM-DD
  shiftStart: string; // HH:MM
  shiftEnd: string;
  crewIds: string[];
  foremanId: string;
  supervisorId?: string;
}

// Tasks
export interface Task {
  id: string;
  companyId: string;
  scheduleId: string;
  jobSiteId: string;
  date: string;
  text: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "completed";
  assigneeId?: string;
  scheduledTime?: string;
  completedAt?: number;
  completedBy?: string;
  createdAt: number;
  updatedAt: number;
}

// Inspections
export interface InspectionCheckItem {
  id: string;
  label: string;
  status: "pass" | "fail" | "n/a";
}

export interface Inspection {
  id: string;
  companyId: string;
  scheduleId: string;
  jobSiteId: string;
  date: string;
  equipmentType: string;
  equipmentId?: string;
  status: "pending" | "complete" | "failed";
  assigneeId?: string;
  inspectorId: string;
  checkItems?: InspectionCheckItem[];
  photoUrls?: string[];
  notes?: string;
  createdAt: number;
  completedAt?: number;
}

// Forms
export interface FormStep {
  id: string;
  type:
    | "auto_filled"
    | "multi_select"
    | "checklist"
    | "single_select"
    | "pass_fail"
    | "text_input"
    | "photo_capture"
    | "signature"
    | "attendance";
  title: string;
  subtitle?: string;
  editable: boolean;
  options?: Array<{ id: string; icon?: string; label: string }>;
  items?: Array<{ id: string; label: string; icon?: string }>;
  placeholder?: string;
  multiline?: boolean;
}

export interface FormTemplate {
  id: string;
  companyId: string;
  name: string;
  icon: string;
  templateType: "risk" | "equipment" | "toolbox" | "custom";
  frequency: "daily" | "weekly" | "per_shift" | "as_needed";
  required: boolean;
  visibility: "crew" | "admin_only";
  steps: FormStep[];
  isActive: boolean;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface FormSubmission {
  id: string;
  companyId: string;
  templateId: string;
  scheduleId: string;
  jobSiteId: string;
  date: string;
  submittedBy: string;
  responses: Record<string, any>;
  signatureUrl?: string;
  photoUrls?: string[];
  autoFilledData: {
    date: string;
    time: string;
    site: string;
    weather?: any;
    crew: string[];
  };
  completedAt: number;
}

// Projects
export interface Project {
  id: string;
  companyId: string;
  name: string;
  status: "active" | "upcoming" | "completed";
  progress: number;
  jobSiteIds: string[];
  startDate: string;
  endDate?: string;
  createdAt: number;
  updatedAt: number;
}

// Photos
export interface Photo {
  id: string;
  companyId: string;
  jobSiteId: string;
  projectId?: string;
  uploadedBy: string;
  storageUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  relatedToType?: "task" | "inspection" | "form";
  relatedToId?: string;
  metadata: {
    width: number;
    height: number;
    size: number;
    mimeType: string;
  };
  capturedAt: number;
  uploadedAt: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

// Offline sync
export interface SyncQueueItem {
  id: string;
  collection: string;
  operation: "create" | "update" | "delete";
  documentId: string;
  data: any;
  timestamp: number;
  retryCount: number;
  error?: string;
}
