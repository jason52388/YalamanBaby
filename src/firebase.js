// ─────────────────────────────────────────────────────────────
//  ⭐ Firebase config — paste your project values below.
//
//  Get these from the Firebase Console:
//    Project settings → Your apps → SDK setup and configuration
//
//  All of these values are SAFE to commit to a public repo — they identify
//  the project, they aren't secrets. Access control is enforced server-side
//  by your Firestore security rules.
//
//  Until you fill these in, the Names page falls back to per-device browser
//  storage (still works, just not shared between you and Erika).
// ─────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

export const isConfigured = Boolean(firebaseConfig.projectId);

let _db = null;
export function db() {
  if (!isConfigured) return null;
  if (!_db) {
    const app = initializeApp(firebaseConfig);
    _db = getFirestore(app);
  }
  return _db;
}
