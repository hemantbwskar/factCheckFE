import React, { useState } from 'react';
import './../components/Timeline/Timeline.css';
import { TimelineCardProps, TimelineItem } from '../../interfaces/interfaces';
import { formatDateForDisplay, formatToInputDate, formatToUTC } from '../../utils/dateUtils';

const TimelineCard: React.FC<TimelineCardProps> = ({
  data,
  isLast,
  onUpdate,
  isAuthenticated = false,
  isHighlighted = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<TimelineItem>(data);

  // Sync state if props change
  React.useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!isAuthenticated) return;
    const updatedData = {
      ...formData,
      date: formatToUTC(formData.date),
    };
    onUpdate(updatedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(data);
    setIsEditing(false);
  };

  return (
    <div
      className={`timeline-item ${isHighlighted ? 'timeline-item-highlight' : ''}`}
      id={`timeline-item-${data.id}`}
    >
      {/* Connector Line */}
      {!isLast && <span className="timeline-line" aria-hidden="true" />}

      {/* Circle Icon Badge */}
      <div className="timeline-icon-node">
        {isEditing && isAuthenticated ? (
          <input
            type="text"
            name="icon"
            className="timeline-icon-input"
            value={formData.icon}
            onChange={handleChange}
            maxLength={2}
          />
        ) : (
          <span className="timeline-icon">{data.icon}</span>
        )}
      </div>

      {/* Card Content */}
      <div className="timeline-card">
        {isEditing && isAuthenticated ? (
          <div className="timeline-card-edit-form">
            <div className="timeline-card-header">
              <input
                type="text"
                name="category"
                className="timeline-input-small"
                value={formData.category}
                onChange={handleChange}
                placeholder="Category"
              />
              <input
                type="date"
                name="date"
                className="timeline-input-small"
                value={formatToInputDate(formData.date)}
                onChange={handleChange}
              />
            </div>

            <div className="timeline-card-body">
              <input
                type="text"
                name="title"
                className="timeline-input-title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
              />
              <textarea
                name="description"
                className="timeline-textarea-description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Description"
              />

              <div className="timeline-card-actions">
                <button
                  type="button"
                  className="icon-btn save-btn"
                  onClick={handleSave}
                  title="Save changes"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="icon-btn cancel-btn"
                  onClick={handleCancel}
                  title="Cancel editing"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="timeline-card-header">
              <span className="timeline-badge">{data.category}</span>
              <div className="header-right">
                <time className="timeline-date">{formatDateForDisplay(data.date)}</time>
                {isAuthenticated && (
                  <button
                    type="button"
                    className="icon-btn edit-btn"
                    onClick={() => setIsEditing(true)}
                    title="Edit timeline card"
                    aria-label="Edit timeline item"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="timeline-card-body">
              <h3 className="timeline-card-title">{data.title}</h3>
              <p className="timeline-card-description">{data.description}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TimelineCard;