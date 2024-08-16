import React, { useState } from 'react';
import EditIssueForm from './EditIssueForm';
import './IssueCard.css';

const IssueCard = ({ issue, onResolve, isResolved, onClose, onUpdateIssue }) => {
  const [showEditForm, setShowEditForm] = useState(false);

  return (
    <div className="card">
      {!showEditForm ? (
        <>
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

          <p><strong>Since:</strong> {issue.since}</p>
          <p><strong>Affected Service:</strong> {issue.service}</p>
          <p><strong>Cause:</strong> {issue.cause}</p>
          <p><strong>Impact:</strong> {issue.impact}</p>

          <p><strong>What are we trying?</strong> {issue.trying}</p>
          <p><strong>Who is doing it?</strong> {issue.person}</p>
          <p><strong>Any additional Information?</strong> {issue.additionalInfo}</p>
        </>
      ) : (
        <EditIssueForm
          issue={issue}
          onSave={(updatedIssue) => {
            onUpdateIssue(updatedIssue);
            setShowEditForm(false);
          }}
          onCancel={() => setShowEditForm(false)}
        />
      )}
    </div>
  );
};

export default IssueCard;
