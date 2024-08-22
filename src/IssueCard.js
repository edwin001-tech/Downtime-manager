import React, { useState } from 'react';
import './IssueCard.css';
import EditIssueForm from './EditIssueForm';

const IssueCard = ({ issue, onResolve, isResolved, onClose, onUpdateIssue }) => {
  const [showEditForm, setShowEditForm] = useState(false);

  return (
    <div className="card">
      <div className="card-header">
        <h3>{issue.issue}</h3>
        <div className="card-buttons">
          {/* Edit button for ongoing issues */}
          {!isResolved && (
            <button onClick={() => setShowEditForm(true)}>Edit</button>
          )}

          {/* Close button for resolved issues */}
          {isResolved && onClose && (
            <button className="close-button" onClick={() => onClose(issue)}>
              Close
            </button>
          )}

          {/* Resolve button for ongoing issues */}
          {!isResolved && onResolve && (
            <button className="resolve-button" onClick={onResolve}>
              Resolve
            </button>
          )}
        </div>
      </div>

      {/* Edit Form */}
      {showEditForm && (
        <EditIssueForm
          issue={issue}
          onSave={(updatedIssue) => {
            onUpdateIssue(updatedIssue);
            setShowEditForm(false);
          }}
          onCancel={() => setShowEditForm(false)}
        />
      )}

      <p><strong>Since:</strong> {issue.since}</p>
      <p><strong>Affected Service:</strong> {issue.service}</p>
      <p><strong>Cause:</strong> {issue.cause}</p>
      <p><strong>Impact:</strong> {issue.impact}</p>

      {/* New fields added directly to the Issue Form */}
      <p><strong>What are we trying?:</strong> {issue.trying}</p>
      <p><strong>Who is doing it?:</strong> {issue.person}</p>
      <p><strong>Any additional Information?:</strong> {issue.additionalInfo}</p>
    </div>
  );
};

export default IssueCard;
