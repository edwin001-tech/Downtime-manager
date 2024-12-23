import React, { useState } from 'react';
import './EditIssueForm.css';

const EditIssueForm = ({ issue, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: issue.id,
    issue: issue.issue,
    since: issue.since,
    service: issue.service,
    cause: issue.cause,
    impact: issue.impact,
    trying: issue.trying,
    person: issue.person,
    additionalInfo: issue.additionalInfo
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleCancelEdit = () => {
    if (onCancel) {
      onCancel();  
    }
  };

  return (
    <div className="edit-issue-form">
      <h2>Edit Issue</h2>
      <form>
        <div>
          <label>
            Description
            <input
              type="text"
              name="issue"
              value={formData.issue}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Since
            <input
              type="text"
              name="since"
              value={formData.since}
              onChange={handleChange}
              readOnly
            />
          </label>
        </div>
        <div>
          <label>
            Affected Service
            <input
              type="text"
              name="service"
              value={formData.service}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Cause
            <input
              type="text"
              name="cause"
              value={formData.cause}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Impact
            <input
              type="text"
              name="impact"
              value={formData.impact}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Action
            <input
              type="text"
              name="trying"
              value={formData.trying}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Systems Admin
            <input
              type="text"
              name="person"
              value={formData.person}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Any additional Information
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <button type="button" onClick={handleSave}>Save</button>
          <button type="button" onClick={handleCancelEdit}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditIssueForm;
