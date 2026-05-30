// ─────────────────────────────────────────────────────────────
//  ⭐ Firebase config — paste your project values below.
//
//  Get these from the Firebase Console:
//    Project settings → Your apps → SDK setup and configuration
//
//  Because we use the REALTIME DATABASE, you MUST include `databaseURL`
//  (it looks like https://<project>-default-rtdb.firebaseio.com — shown in
//  Build → Realtime Database, and in the SDK config snippet).
//
//  All of these values are SAFE to commit to a public repo — they identify
//  the project, they aren't secrets. Access is governed by your database
//  rules (and, here, by the site's password gate).
//
//  Until projectId + databaseURL are filled in, the Names page falls back to
//  per-device browser storage.
// ─────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

export const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  databaseURL: '', // ← required for Realtime Database
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

export const isConfigured = Boolean(firebaseConfig.databaseURL && firebaseConfig.projectId);

let _db = null;
export function rtdb() {
  if (!isConfigured) return null;
  if (!_db) {
    const app = initializeApp(firebaseConfig);
    _db = getDatabase(app);
  }
  return _db;
}
