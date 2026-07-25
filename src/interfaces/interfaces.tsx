export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  category: string;
  description: string;
}

export interface TimelineProps {
  isAuthenticated?: boolean;
}

export interface TimelineCardProps {
  data: TimelineItem;
  isLast: boolean;
  onUpdate: (updatedItem: TimelineItem) => void;
  isAuthenticated?: boolean;
  isHighlighted?: boolean;
}

export interface AddCardProps {
  onAdd: (newItem: Omit<TimelineItem, 'id'>) => void;
  onCancel: () => void;
}

export interface NavbarProps {
  user: { email?: string; username?: string; name: string } | null;
  onLogout: () => void;
}

export interface User {
  username?: string;
  email?: string;
  name: string;
  token?: string;
}
