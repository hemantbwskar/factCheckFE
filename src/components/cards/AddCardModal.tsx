import React, { useState } from 'react';
import '../timeline/Timeline.css';
import { AddCardProps } from '../../interfaces/interfaces';
import { formatToInputDate, formatToUTC, getTodayInputDate } from '../../utils/dateUtils';

const getInitialState = () => ({
  title: '',
  date: getTodayInputDate(),
  category: '',
  description: '',
  icon: '🚀',
});

const AddCardModal: React.FC<AddCardProps> = ({ onAdd, onCancel }) => {
  const [formData, setFormData] = useState(getInitialState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    const finalData = {
      ...formData,
      date: formatToUTC(formData.date),
    };
    onAdd(finalData);
    setFormData(getInitialState());
  };

  return (
    <div className="timeline-item timeline-add-item">
      {/* Connector Line linking to the next card */}
      <span className="timeline-line" aria-hidden="true" />

      {/* Circle Icon Node */}
      <div className="timeline-icon-node">
        <input
          type="text"
          name="icon"
          className="timeline-icon-input"
          value={formData.icon}
          onChange={handleChange}
          maxLength={2}
          placeholder="🚀"
          required
        />
      </div>

      {/* Card Content Styled Form */}
      <div className="timeline-card">
        <form className="timeline-card-edit-form" onSubmit={handleSubmit}>
          <div className="timeline-card-header">
            <input
              type="text"
              name="category"
              className="timeline-input-small"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category (e.g. Planning)"
              required
            />
            <input
              type="date"
              name="date"
              className="timeline-input-small"
              value={formatToInputDate(formData.date)}
              onChange={handleChange}
              required
            />
          </div>

          <div className="timeline-card-body">
            <input
              type="text"
              name="title"
              className="timeline-input-title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Event Title"
              required
            />
            <textarea
              name="description"
              className="timeline-textarea-description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description details..."
              rows={3}
              required
            />
          </div>

          <div className="timeline-card-actions">
                <button
                  type="submit"
                  className="icon-btn save-btn"
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
                  onClick={onCancel}
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
        </form>
      </div>
    </div>
  );
};

export default AddCardModal;