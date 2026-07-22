import React from 'react';
import './Timeline.css';
import { TimelineItem } from '../interfaces';
import TimelineCard from './TimeLineCard';

const timelineData: TimelineItem[] = [
  {
    id: 1,
    title: "Project Kickoff",
    date: "Jan 10, 2026",
    category: "Planning",
    description: "Initial team meeting to define objectives, scope, and key deliverables for the new application platform.",
    icon: "🚀"
  },
  {
    id: 2,
    title: "UI/UX Design Approved",
    date: "Feb 14, 2026",
    category: "Design",
    description: "Completed interactive prototypes in Figma and received final sign-off from key stakeholders.",
    icon: "🎨"
  },
  {
    id: 3,
    title: "Beta Version Release",
    date: "Apr 02, 2026",
    category: "Development",
    description: "Deployed early build to internal QA testing environment to catch initial bugs and test performance.",
    icon: "⚡"
  },
  {
    id: 4,
    title: "Global Launch",
    date: "May 20, 2026",
    category: "Deployment",
    description: "Successfully released version 1.0 to production with zero downtime during peak traffic hours.",
    icon: "🌍"
  }
];

const Timeline: React.FC = () => {
  return (
    <div className="timeline-container">
      <h2 className="timeline-title">Project Roadmap</h2>
      <div className="timeline-wrapper">
        {timelineData.map((item, index) => (
          <TimelineCard
            key={item.id}
            data={item}
            isLast={index === timelineData.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline;