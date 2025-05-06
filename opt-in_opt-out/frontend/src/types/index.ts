export interface PreferenceMap {
  [key: string]: boolean;
}

export interface Preference {
  id: string;
  name: string;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  isAdmin: boolean;
  preferences: PreferenceMap;
}

export interface HistoryEntry {
  id: string;
  preference: {
    name: string;
    description?: string;
  };
  preferenceName: string,
  action: 'opt-in' | 'opt-out';
  timestamp: string;
}
