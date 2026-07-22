// 1. Define the shape of a single timeline item
export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  category: string;
  description: string;
  icon: string;
}

// 2. Define the props accepted by TimelineCard
export interface TimelineCardProps {
  data: TimelineItem;
  isLast: boolean;
}