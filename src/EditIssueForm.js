import React, { useState } from 'react';


const EditIssueForm = ({ issue, onSave, onCancel }) => {
  const [updatedIssue, setUpdatedIssue] = useState(issue);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedIssue({ ...updatedIssue, [name]: value });
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
      <button onClick={() => onSave(updatedIssue)}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default EditIssueForm;
