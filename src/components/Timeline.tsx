import React, { useState, useEffect } from 'react';
import './Timeline.css';
import { TimelineItem, TimelineProps } from '../interfaces';
import TimelineCard from './TimeLineCard';
import AddCardModal from './AddCardModal';

const API_URL = 'https://factcheckjsbe.onrender.com/api/timeline';

const Timeline: React.FC<TimelineProps> = ({ isAuthenticated = false }) => {
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // 1. Fetch items on load
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setTimelineData(data);
        setLoading(false);
      })
      .catch((err) => console.error('Error fetching timeline data:', err));
  }, []);

  // 2. Edit existing item handler
  const handleUpdateItem = async (updatedItem: TimelineItem) => {
    if (!isAuthenticated) return;

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

  // 3. Add new item handler - post to API and immediately display in current page
  const handleAddItem = async (newItemData: Omit<TimelineItem, 'id'>) => {
    if (!isAuthenticated) return;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItemData),
      });

      const data = await res.json();

      // Extract created item from backend response or construct fallback with generated ID
      const createdItem: TimelineItem =
        data.item ||
        (data.id ? (data as TimelineItem) : { id: Date.now(), ...newItemData });

      // Add to current page state to display immediately
      setTimelineData((prev) => [createdItem, ...prev]);
      setIsAdding(false);
    } catch (err) {
      console.error('Failed to save new card to backend:', err);

      // Fallback local update if backend fails
      const fallbackItem: TimelineItem = { id: Date.now(), ...newItemData };
      setTimelineData((prev) => [fallbackItem, ...prev]);
      setIsAdding(false);
    }
  };

  if (loading) return <div className="timeline-loading">Loading roadmap...</div>;

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <h2 className="timeline-title">Project Roadmap</h2>
        {isAuthenticated && !isAdding && (
          <button
            className="timeline-btn add-btn"
            onClick={() => setIsAdding(true)}
          >
            + Add Event
          </button>
        )}
      </div>

      <div className="timeline-wrapper">
        {/* Separated AddCard Component placed directly at top of list */}
        {isAuthenticated && isAdding && (
          <AddCardModal
            onAdd={handleAddItem}
            onCancel={() => setIsAdding(false)}
          />
        )}

        {/* Existing Timeline Cards */}
        {timelineData.map((item, index) => (
          <TimelineCard
            key={item.id}
            data={item}
            isLast={index === timelineData.length - 1}
            onUpdate={handleUpdateItem}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline;