// Lightweight client-only user/account store (no backend, per project rules).
// All data persists in localStorage so the gating logic survives reloads.

export type Role = "parent" | "student" | "teacher" | "sme";
export type VerifyChannel = "whatsapp" | "sms";
export type Gender = "male" | "female";

export interface EduvestUser {
  firstName: string;
  lastName: string;
  country: string;
  region: string;
  city: string;
  phone: string;
  verifyChannel: VerifyChannel;
  phoneVerified: boolean;
  phoneIsPrimaryPay: boolean;
  email?: string;
  username?: string;
  emailVerified: boolean;
  role?: Role;
  teacherProfileComplete: boolean;
  // KYC fields (synchronised from signup info)
  gender?: Gender;
  dob?: string;
  citizenship?: string;
  residentCountry?: string;
  kycComplete: boolean;
  kybComplete: boolean;
  biometricEnabled: boolean;
  createdAt: number;
}

const KEY = "eduvest_user";

const DEFAULT: EduvestUser = {
  firstName: "",
  lastName: "",
  country: "",
  region: "",
  city: "",
  phone: "",
  verifyChannel: "sms",
  phoneVerified: false,
  phoneIsPrimaryPay: true,
  emailVerified: false,
  teacherProfileComplete: false,
  kycComplete: false,
  kybComplete: false,
  biometricEnabled: false,
  createdAt: Date.now(),
};

export const getUser = (): EduvestUser => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT };
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT };
  }
};

export const setUser = (patch: Partial<EduvestUser>) => {
  const next = { ...getUser(), ...patch };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
};

export const clearUser = () => localStorage.removeItem(KEY);

export const isAuthed = () => !!getUser().phone && getUser().phoneVerified && !!localStorage.getItem("userPin");

// Gating: without KYC users can deposit, save, top up, receive — but
// CANNOT send or withdraw.
export const canSend = () => getUser().kycComplete;
export const canWithdraw = () => getUser().kycComplete;

// Teacher lesson profile
export interface TeacherProfile {
  subject: string;
  levels: string[];
  exams: string;
  modes: string[];
  city: string;
  quarter: string;
  rate: string;
  monthly?: string;
  payTimings: string[];
  bio: string;
}

const TKEY = "eduvest_teacher_profile";
export const getTeacherProfile = (): Partial<TeacherProfile> => {
  try { return JSON.parse(localStorage.getItem(TKEY) || "{}"); } catch { return {}; }
};
export const setTeacherProfile = (p: Partial<TeacherProfile>) => {
  localStorage.setItem(TKEY, JSON.stringify({ ...getTeacherProfile(), ...p }));
};
