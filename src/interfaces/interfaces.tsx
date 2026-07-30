export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  category: string;
  description: string;
  visibility?: 'public' | 'private';
  username?: string;
  tags?: string[];
}

export interface TimelineProps {
  isAuthenticated?: boolean;
  currentUser?: User | null;
}

export interface TimelineCardProps {
  data: TimelineItem;
  isLast: boolean;
  onUpdate: (updatedItem: TimelineItem) => void;
  isAuthenticated?: boolean;
  isHighlighted?: boolean;
  currentUser?: User | null;
}

export interface AddCardProps {
  onAdd: (newItem: Omit<TimelineItem, 'id'>) => void;
  onCancel: () => void;
  currentUser?: User | null;
}

export interface NavbarProps {
  user: { email?: string; username?: string; name: string } | null;
  onLogout: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export interface User {
  username?: string;
  email?: string;
  name: string;
  token?: string;
}

export interface UserProfile {
  username: string;
  email?: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  role?: string;
  created_at?: string;
}

export interface UserProfileProps {
  currentUser?: User | null;
}
