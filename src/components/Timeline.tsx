import React, { useState, useEffect } from 'react';
import './Timeline.css';
import { TimelineItem } from '../interfaces';
import TimelineCard from './TimeLineCard';

const API_URL = 'https://factcheckjsbe.onrender.com/api/timeline';

const Timeline: React.FC = () => {
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from Express Backend
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setTimelineData(data);
        setLoading(false);
      })
      .catch((err) => console.error('Error fetching timeline data:', err));
  }, []);

  // Sync edits back to Express Backend
  const handleUpdateItem = async (updatedItem: TimelineItem) => {
    // Optimistic UI update
    setTimelineData((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );

    try {
      await fetch(`${API_URL}/${updatedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem),
      });
    } catch (err) {
      console.error('Failed to update backend:', err);
    }
  };

  if (loading) return <div>Loading roadmap...</div>;

  return (
    <div className="timeline-container">
      <h2 className="timeline-title">Project Roadmap</h2>
      <div className="timeline-wrapper">
        {timelineData.map((item, index) => (
          <TimelineCard
            key={item.id}
            data={item}
            isLast={index === timelineData.length - 1}
            onUpdate={handleUpdateItem}
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline;