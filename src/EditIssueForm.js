import React, { useState } from 'react';

const EditIssueForm = ({ issue, onSave, onCancel }) => {
  const [updatedIssue, setUpdatedIssue] = useState(issue);
  
  // Highlighted: Initialize actions with the issue's existing actions
  const [updatedActions, setUpdatedActions] = useState(issue.actions || []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedIssue({ ...updatedIssue, [name]: value });
  };

  // Highlighted: Function to handle changes in action fields
  const handleActionChange = (index, field, value) => {
    const newActions = updatedActions.map((action, i) =>
      i === index ? { ...action, [field]: value } : action
    );
    setUpdatedActions(newActions);
  };

  const handleSave = () => {
    // Highlighted: Saving both updated issue details and actions
    onSave({ ...updatedIssue, actions: updatedActions });
  };

  return (
    <div className="edit-issue-form">
      <h3>Edit Issue</h3>
      <input
        name="issue"
        value={updatedIssue.issue}
        onChange={handleChange}
        placeholder="Issue"
      />
      <input
        name="since"
        value={updatedIssue.since}
        onChange={handleChange}
        placeholder="Since"
      />
      <input
        name="service"
        value={updatedIssue.service}
        onChange={handleChange}
        placeholder="Affected Service"
      />

      {/* Highlighted: Adding action edit fields */}
      <h4>Edit Actions:</h4>
      {updatedActions.map((action, index) => (
        <div key={index}>
          <label>
            Action:
            <input
              type="text"
              value={action.action}
              onChange={(e) => handleActionChange(index, 'action', e.target.value)}
            />
          </label>
          <label>
            Person:
            <input
              type="text"
              value={action.person}
              onChange={(e) => handleActionChange(index, 'person', e.target.value)}
            />
          </label>
          <label>
            Additional Info:
            <input
              type="text"
              value={action.additionalInfo}
              onChange={(e) => handleActionChange(index, 'additionalInfo', e.target.value)}
            />
          </label>
        </div>
      ))}

      <button onClick={handleSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default EditIssueForm;
