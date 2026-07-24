export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  category: string;
  description: string;
  icon: string;
}

export interface TimelineCardProps {
  data: TimelineItem;
  isLast: boolean;
}

export interface TimelineCardProps {
  data: TimelineItem;
  isLast: boolean;
  onUpdate: (updatedItem: TimelineItem) => void;
}