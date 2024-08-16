import React, { useState } from 'react';
import './EditIssueForm.css';

const EditIssueForm = ({ issue, onSave, onCancel }) => {
  const [updatedIssue, setUpdatedIssue] = useState(issue);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedIssue({ ...updatedIssue, [name]: value });
  };

  const handleSave = () => {
    onSave(updatedIssue);
  };

  return (
    <div className="edit-issue-form">
      <h3>Edit Issue</h3>
      
      <label>
        Incident:
        <input
          name="issue"
          value={updatedIssue.issue}
          onChange={handleChange}
          placeholder="Incident"
        />
      </label>

      <label>
        Since:
        <input
          name="since"
          value={updatedIssue.since}
          onChange={handleChange}
          placeholder="Since"
        />
      </label>

      <label>
        Affected Service:
        <input
          name="service"
          value={updatedIssue.service}
          onChange={handleChange}
          placeholder="Affected Service"
        />
      </label>

      <label>
        Cause:
        <input
          name="cause"
          value={updatedIssue.cause}
          onChange={handleChange}
          placeholder="Cause"
        />
      </label>

      <label>
        Impact:
        <input
          name="impact"
          value={updatedIssue.impact}
          onChange={handleChange}
          placeholder="Impact"
        />
      </label>

      {/* New Fields Added */}
      <label>
        What are we trying?
        <input
          name="trying"
          value={updatedIssue.trying || ''}
          onChange={handleChange}
          placeholder="What are we trying?"
        />
      </label>

      <label>
        Who is doing it?
        <input
          name="person"
          value={updatedIssue.person || ''}
          onChange={handleChange}
          placeholder="Who is doing it?"
        />
      </label>

      <label>
        Any additional Information?
        <input
          name="additionalInfo"
          value={updatedIssue.additionalInfo || ''}
          onChange={handleChange}
          placeholder="Any additional Information?"
        />
      </label>

      <button onClick={handleSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default EditIssueForm;
