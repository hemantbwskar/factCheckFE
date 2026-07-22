import React from 'react';
import './Timeline.css'; // Import your extracted styles
import { TimelineCardProps } from '../interfaces';


const TimelineCard: React.FC<TimelineCardProps> = ({ data, isLast }) => {
  const { title, date, category, description, icon } = data;

  return (
    <div className="timeline-item">
      {/* Connector Line */}
      {!isLast && <span className="timeline-line" aria-hidden="true" />}

      {/* Circle Icon Badge */}
      <div className="timeline-icon-node">
        <span className="timeline-icon">{icon}</span>
      </div>

      {/* Card Content */}
      <div className="timeline-card">
        <div className="timeline-card-header">
          <span className="timeline-badge">{category}</span>
          <time className="timeline-date">{date}</time>
        </div>

        <div className="timeline-card-body">
          <h3 className="timeline-card-title">{title}</h3>
          <p className="timeline-card-description">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default TimelineCard;