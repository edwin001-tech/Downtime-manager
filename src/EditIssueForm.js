import React, { useState } from 'react';
import './EditIssueForm.css';

const EditIssueForm = ({ issue, onSave, onCancel }) => {
  const [updatedIssue, setUpdatedIssue] = useState(issue);
  
  // Initialize actions with the issue's existing actions
  const [updatedActions, setUpdatedActions] = useState(issue.actions || []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedIssue({ ...updatedIssue, [name]: value });
  };

  // Function to handle changes in action fields
  const handleActionChange = (index, field, value) => {
    const newActions = updatedActions.map((action, i) =>
      i === index ? { ...action, [field]: value } : action
    );
    setUpdatedActions(newActions);
  };

  const handleSave = () => {
    // Save both updated issue details and actions
    onSave({ ...updatedIssue, actions: updatedActions });
  };

  return (
    <div className="edit-issue-form">
      <h3>Edit Issue</h3>
  <label>
    Incident:
    <input
      name="incident"
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


      {/* Conditional rendering for Edit Actions header and fields */}
      {updatedActions.length > 0 && (
        <>
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
        </>
      )}

      <button onClick={handleSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default EditIssueForm;
