export enum RecordType {
  PRESCRIPTION = 'Prescription',
  LAB_RESULT = 'Lab Result',
  VACCINATION = 'Vaccination',
  CHECKUP = 'Checkup',
  SYMPTOM = 'Symptom',
  SURGERY = 'Surgery',
}

export interface MedicalRecord {
  id: string;
  type: RecordType;
  title: string;
  date: string;
  doctor?: string;
  summary?: string;
  imageUrl?: string;
  aiAnalysis?: string;
  riskLevel?: 'Low' | 'Medium' | 'High';
  relevance?: string;
  source?: string;
  createdAt?: string;
  isPending?: boolean; // New: is this record waiting for approval?
}

export interface Reminder {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  type: 'medication' | 'appointment' | 'vaccination' | 'analysis';
  urgent: boolean;
}

export interface PendingValue {
  value: string | number;
  timestamp: string;
  requestedBy: string; // 'user' | 'doctor'
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age: number;
  bloodType: string;
  avatarUrl: string;
  records: MedicalRecord[];
  reminders: Reminder[];
  healthOverview?: string;
  stats: {
    heartRate: number;
    weight: number;
    height: number;
    lastUpdated: string;
    heartRateInsight?: string;
    growthInsight?: string;
    // New: storage for pending critical changes
    pendingWeight?: PendingValue;
    pendingHeight?: PendingValue;
  };
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  familyMembers: FamilyMember[];
}