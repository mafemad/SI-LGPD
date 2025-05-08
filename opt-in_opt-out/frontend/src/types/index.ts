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

export interface ConsentTerm {
  id: string;
  version: number;
  content: string;
  active: boolean;
  createdAt: string;
}

export interface HistoryEntry {
  id: string;
  preference: {
    name: string;
    description?: string;
  };
  preferenceName: string;
  action: 'opt-in' | 'opt-out';
  timestamp: string;
  consentTerm?: ConsentTerm | null; // <- adicionado aqui
}


export type Term = {
  id: string;
  version: number;
  content: string;
  preferences: Preference[];
};