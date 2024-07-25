// src/IssueCard.js

import React, { useState } from 'react';
import AddActionForm from './AddActionForm';
import './IssueCard.css';

const IssueCard = ({ issue }) => {
  const [showAddActionForm, setShowAddActionForm] = useState(false);
  const [actions, setActions] = useState([]);

  const handleAddAction = (actionData) => {
    setActions([...actions, actionData]);
    setShowAddActionForm(false);
  };

  const handleCancel = () => {
    setShowAddActionForm(false);
  };

  return (
    
    <div className="card">
        
      <div className="card-header">
        <h3>{issue.issue}</h3>
        <div className="card-buttons">
          <button>Edit</button>
          <button>Resolve</button>
        </div>
      </div>
      <p><strong>Since:</strong> {issue.since}</p>
      <p><strong>Affected Service:</strong> {issue.service}</p>

      {actions.length > 0 && (
        <div className="actions-list">
          <h4>Actions:</h4>
          {actions.map((action, index) => (
            <div key={index} className="action-item">
              <p><strong>Action:</strong> {action.action}</p>
              <p><strong>Person:</strong> {action.person}</p>
              <p><strong>Additional Info:</strong> {action.additionalInfo}</p>
            </div>
          ))}
        </div>
      )}

      <button className="action-button" onClick={() => setShowAddActionForm(true)}>Add Action</button>

      {showAddActionForm && (
        <AddActionForm onAdd={handleAddAction} onCancel={handleCancel} />
      )}
    </div>
  );
};

export default IssueCard;
