import React, { useState, useEffect } from 'react';
import './Timeline.css';
import { TimelineItem, TimelineProps } from '../../interfaces/interfaces';
import TimelineCard from '../cards/TimeLineCard';
import AddCardModal from '../cards/AddCardModal';
import { sortTimelineItems } from '../../utils/dateUtils';

const API_URL = 'https://factcheckjsbe.onrender.com/api/timeline';

const Timeline: React.FC<TimelineProps> = ({ isAuthenticated = false }) => {
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  const scrollToItem = (id: number) => {
    setHighlightedId(id);
    setTimeout(() => {
      const el = document.getElementById(`timeline-item-${id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);

    setTimeout(() => {
      setHighlightedId(null);
    }, 2500);
  };

  // 1. Fetch items on load & sort chronologically
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTimelineData(sortTimelineItems(data));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching timeline data:', err);
        setLoading(false);
      });
  }, []);

  // 2. Edit existing item handler - re-sort and scroll into view
  const handleUpdateItem = async (updatedItem: TimelineItem) => {
    if (!isAuthenticated) return;

    setTimelineData((prev) =>
      sortTimelineItems(
        prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      )
    );

    scrollToItem(updatedItem.id);

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

  // 3. Add new item handler - insert in sorted position & scroll into view
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

      setTimelineData((prev) => sortTimelineItems([...prev, createdItem]));
      setIsAdding(false);
      scrollToItem(createdItem.id);
    } catch (err) {
      console.error('Failed to save new card to backend:', err);

      // Fallback local update if backend fails
      const fallbackItem: TimelineItem = { id: Date.now(), ...newItemData };
      setTimelineData((prev) => sortTimelineItems([...prev, fallbackItem]));
      setIsAdding(false);
      scrollToItem(fallbackItem.id);
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
            isHighlighted={item.id === highlightedId}
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline;