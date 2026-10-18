import type { Candidate } from '../../../shared/types/candidate';

export type StoredResume = {
  key: string;
  candidateId?: number;
  fileName: string;
  fileSize: number;
  fileType: string;
  dataUrl: string;
  updatedAt: string;
};

const DB_NAME = 'janapost_resumes_db';
const DB_VERSION = 1;
const STORE_NAME = 'resumes';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save resume file to IndexedDB with localStorage fallback
 */
export async function saveResume(
  key: string,
  data: {
    fileName: string;
    fileSize: number;
    fileType: string;
    dataUrl: string;
    candidateId?: number;
  }
): Promise<void> {
  const record: StoredResume = {
    key,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB save failed, falling back to localStorage', err);
    try {
      localStorage.setItem(`janapost_resume_${key}`, JSON.stringify(record));
    } catch {
      // ignore quota errors
    }
  }
}

/**
 * Retrieve resume from storage by key or candidate ID
 */
export async function getResume(keyOrId: string | number): Promise<StoredResume | null> {
  const key = String(keyOrId);
  try {
    const db = await openDb();
    return await new Promise<StoredResume | null>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => {
        if (req.result) {
          resolve(req.result as StoredResume);
        } else {
          // Check localStorage fallback
          const raw = localStorage.getItem(`janapost_resume_${key}`);
          resolve(raw ? JSON.parse(raw) : null);
        }
      };
      req.onerror = () => {
        const raw = localStorage.getItem(`janapost_resume_${key}`);
        resolve(raw ? JSON.parse(raw) : null);
      };
    });
  } catch {
    const raw = localStorage.getItem(`janapost_resume_${key}`);
    return raw ? JSON.parse(raw) : null;
  }
}

/**
 * Find resume for a candidate using several possible identifiers:
 * 1. candidate_${candidate.id}
 * 2. candidate.resumeUrl (if it's a storage key)
 * 3. candidate_${candidate.email}
 */
export async function findResumeForCandidate(candidate: Candidate): Promise<StoredResume | null> {
  // 1. Try by ID
  let res = await getResume(`candidate_${candidate.id}`);
  if (res) return res;

  // 2. Try by resumeUrl as key
  if (candidate.resumeUrl) {
    res = await getResume(candidate.resumeUrl);
    if (res) return res;
  }

  // 3. Try by email
  if (candidate.email) {
    res = await getResume(`email_${candidate.email}`);
    if (res) return res;
  }

  return null;
}

/**
 * Convert a File object to Data URL string
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Format bytes to readable size (e.g. "450 KB", "1.2 MB")
 */
export function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Download a data URL or blob as a file
 */
export function downloadResumeFile(filename: string, dataUrl: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Candidate basic summary containing only actual data
 */
export type CandidateSummary = {
  fullName: string;
  position: string;
  email: string;
  phone: string;
  notes?: string | null;
};

export function getCandidateSummary(
  candidate: Candidate,
  vacancyTitle?: string
): CandidateSummary {
  return {
    fullName: `${candidate.firstName} ${candidate.lastName}`,
    position: vacancyTitle || 'Вакансия',
    email: candidate.email || 'Не указан',
    phone: candidate.phone || 'Не указан',
    notes: candidate.notes || null,
  };
}

