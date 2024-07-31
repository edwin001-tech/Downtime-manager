import React, { useState, useEffect } from 'react';
import AddActionForm from './AddActionForm';
import './IssueCard.css';

const IssueCard = ({ issue, onResolve, isResolved }) => {
  const [showAddActionForm, setShowAddActionForm] = useState(false);
  const [actions, setActions] = useState(issue.actions || []); // Initialize actions with the issue's existing actions

  useEffect(() => {
    setActions(issue.actions || []);
  }, [issue]);

  const handleAddAction = (actionData) => {
    const updatedActions = [...actions, actionData];
    setActions(updatedActions);
    setShowAddActionForm(false);

    // Also update the issue object with the new actions
    issue.actions = updatedActions;
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
          {!isResolved && onResolve && (
            <button className="resolve-button" onClick={onResolve}>
              Resolve
            </button>
          )}
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

      {!isResolved && (
        <button className="action-button" onClick={() => setShowAddActionForm(true)}>
          Add Action
        </button>
      )}

      {showAddActionForm && (
        <AddActionForm onAdd={handleAddAction} onCancel={handleCancel} />
      )}
    </div>
  );
};

export default IssueCard;



