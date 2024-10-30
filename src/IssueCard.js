import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCopy, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import './IssueCard.css';

const IssueCard = ({ issue, onResolve, isResolved, onClose, onEdit }) => {
  // Function to copy issue to clipboard
  const copyToClipboard = () => {

    const resolvedAt = isResolved && issue.resolved_timestamp 
    ? new Date(issue.resolved_timestamp).toLocaleString() 
    : 'N/A';

    const issueText = `
      Issue: ${issue.issue}
      Since: ${issue.since}
      Affected Service: ${issue.service}
      Cause: ${issue.cause}
      Impact: ${issue.impact}
      Action: ${issue.trying}
      System Admin: ${issue.person}
      Additional Information: ${issue.additionalInfo}
      ${isResolved ? `Resolved At: ${resolvedAt}` : ''}
    `;
    navigator.clipboard.writeText(issueText).then(() => {
      alert('Issue copied to clipboard');
    });
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>{issue.issue}</h3>
        <div className="card-buttons">
          {/* Edit icon for ongoing issues */}
          {!isResolved && (
            <button onClick={() => onEdit(issue)} title="Edit">
              <FontAwesomeIcon icon={faEdit} />
            </button>
          )}

          {/* Close icon for resolved issues */}
          {isResolved && onClose && (
            <button className="close-button" onClick={() => onClose(issue)} title="Close">
              <FontAwesomeIcon icon={faTimesCircle} />
            </button>
          )}

          {/* Resolve icon for ongoing issues */}
          {!isResolved && onResolve && (
            <button className="resolve-button" onClick={() => onResolve(issue)} title="Resolve">
              <FontAwesomeIcon icon={faCheckCircle} />
            </button>
          )}

          {/* Copy button */}
          <button className="copy-button" onClick={copyToClipboard} title="Copy">
            <FontAwesomeIcon icon={faCopy} />
          </button>
        </div>
      </div>

      {/* Display issue details */}
      <p><strong>Since:</strong> {issue.since}</p>
      <p><strong>Affected Service:</strong> {issue.service}</p>
      <p><strong>Cause:</strong> {issue.cause}</p>
      <p><strong>Impact:</strong> {issue.impact}</p>
      <p><strong>Action:</strong> {issue.trying}</p>
      <p><strong>System Admin:</strong> {issue.person}</p>
      <p><strong>Any additional Information:</strong> {issue.additionalInfo}</p>
      
      {/* Conditionally render resolved timestamp if issue is resolved */}
      {isResolved && issue.resolved_timestamp && (
        <p><strong>Resolved At:</strong> {new Date(issue.resolved_timestamp).toLocaleString()}</p>
      )}
    </div>
  );
};

export default IssueCard;
