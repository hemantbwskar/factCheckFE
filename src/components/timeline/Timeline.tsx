import React, { useState, useEffect } from 'react';
import './Timeline.css';
import { TimelineItem, TimelineProps } from '../../interfaces/interfaces';
import TimelineCard from '../cards/TimeLineCard';
import AddCardModal from '../cards/AddCardModal';
import { getItemYear, sortTimelineItems } from '../../utils/dateUtils';
import { API_URLS } from '../../config/api';

const Timeline: React.FC<TimelineProps> = ({
  isAuthenticated = false,
  currentUser,
}) => {
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [activeYear, setActiveYear] = useState<number | null>(null);

  // Filter items based on public/private visibility rules:
  // - All public posts (or posts without explicit visibility tag) are visible to everyone
  // - Private posts are visible ONLY to the logged in user who created them
  const currentUsername = (currentUser?.username || currentUser?.name || '').toLowerCase();

  const visibleItems = timelineData.filter((item) => {
    const isPrivate = item.visibility === 'private';
    if (!isPrivate) return true; // All public posts visible

    // Private post: must be logged in & match post user tag
    if (!isAuthenticated || !currentUsername) return false;
    const postUser = (item.username || '').toLowerCase();
    return !postUser || postUser === currentUsername;
  });

  // Extract unique sorted list of years present in visible timeline
  const availableYears = Array.from(
    new Set(
      visibleItems
        .map((item) => getItemYear(item.date))
        .filter((yr): yr is number => yr !== null)
    )
  ).sort((a, b) => b - a);

  // Set default active year if not set
  useEffect(() => {
    if (availableYears.length > 0 && activeYear === null) {
      setActiveYear(availableYears[0]);
    }
  }, [availableYears, activeYear]);

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

  const scrollToYear = (year: number) => {
    setActiveYear(year);
    const targetEl = document.getElementById(`year-section-${year}`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 1. Fetch items on load & sort chronologically
  useEffect(() => {
    fetch(API_URLS.TIMELINE)
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
      await fetch(API_URLS.TIMELINE_ITEM(updatedItem.id), {
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
      const res = await fetch(API_URLS.TIMELINE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItemData),
      });

      const data = await res.json();

      const createdItem: TimelineItem =
        data.item ||
        (data.id ? (data as TimelineItem) : { id: Date.now(), ...newItemData });

      setTimelineData((prev) => sortTimelineItems([...prev, createdItem]));
      setIsAdding(false);
      scrollToItem(createdItem.id);
    } catch (err) {
      console.error('Failed to save new card to backend:', err);

      const fallbackItem: TimelineItem = { id: Date.now(), ...newItemData };
      setTimelineData((prev) => sortTimelineItems([...prev, fallbackItem]));
      setIsAdding(false);
      scrollToItem(fallbackItem.id);
    }
  };

  if (loading) {
    return (
      <div className="timeline-loading-container">
        <div className="timeline-spinner" aria-label="Loading roadmap" />
        <span className="timeline-loading-text">Loading Timeline...</span>
      </div>
    );
  }

  return (
    <div className="timeline-page-container">
      {/* Left Sidebar for Year Grouping & Quick Scroll */}
      {availableYears.length > 0 && (
        <aside className="timeline-year-sidebar">
          <h3 className="sidebar-heading">Years</h3>
          <div className="year-nav-list">
            {availableYears.map((year) => (
              <button
                key={year}
                className={`year-nav-btn ${activeYear === year ? 'active' : ''}`}
                onClick={() => scrollToYear(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </aside>
      )}

      {/* Main Timeline Column */}
      <div className="timeline-main-content">
        <div className="timeline-header">
          <h2 className="timeline-title">Timeline</h2>
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
          {/* AddCard Component placed at top of list */}
          {isAuthenticated && isAdding && (
            <AddCardModal
              onAdd={handleAddItem}
              onCancel={() => setIsAdding(false)}
              currentUser={currentUser}
            />
          )}

          {/* Timeline Cards grouped with year dividers */}
          {visibleItems.map((item, index) => {
            const currentYear = getItemYear(item.date);
            const prevYear = index > 0 ? getItemYear(visibleItems[index - 1].date) : null;
            const showYearHeader = currentYear !== null && currentYear !== prevYear;

            return (
              <React.Fragment key={item.id}>
                {showYearHeader && (
                  <div
                    className="timeline-year-header"
                    id={`year-section-${currentYear}`}
                  >
                    <span className="year-title">{currentYear}</span>
                  </div>
                )}
                <TimelineCard
                  data={item}
                  isLast={index === visibleItems.length - 1}
                  onUpdate={handleUpdateItem}
                  isAuthenticated={isAuthenticated}
                  isHighlighted={item.id === highlightedId}
                  currentUser={currentUser}
                />
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Timeline;