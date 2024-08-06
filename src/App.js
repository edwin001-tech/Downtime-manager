import React, { useState } from 'react';
import { Route, Routes, Link, useLocation } from 'react-router-dom';
import './App.css';
import IssueCard from './IssueCard';
import EditIssueForm from './EditIssueForm';
import Home from './Home';

function App() {
  const [formData, setFormData] = useState({
    issue: '',
    since: '',
    service: '',
    cause: '',
    impact: '',
    actions: []
  });

  const [issues, setIssues] = useState([]);
  const [resolvedIssues, setResolvedIssues] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [showAddIssueForm, setShowAddIssueForm] = useState(false);

  const location = useLocation(); // Hook to get current route

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const getCurrentDateTime = () => {
    const currentDate = new Date();
    return currentDate.toLocaleString(); // Formats as 'MM/DD/YYYY, HH:MM:SS AM/PM'
  };

  const handleCreate = () => {
    setIssues([...issues, { ...formData, actions: [] }]);
    setFormData({
      issue: '',
      since: '',
      service: '',
      cause: '',
      impact: '',
      actions: []
    });
    setShowAddIssueForm(false);
  };

  const handleCancel = () => {
    setFormData({
      issue: '',
      since: '',
      service: '',
      cause: '',
      impact: '',
      actions: []
    });
    setShowAddIssueForm(false);
  };

  const handleAddIssueFormToggle = () => {
    setShowAddIssueForm(!showAddIssueForm);
    if (!showAddIssueForm) {
      setFormData({
        ...formData,
        since: getCurrentDateTime() // Auto-fill with current date and time
      });
    }
  };

  const handleResolve = (index) => {
    const issueToResolve = issues[index];
    const newIssues = issues.filter((_, i) => i !== index);
    setIssues(newIssues);
    setResolvedIssues([...resolvedIssues, issueToResolve]);
  };

  const handleCloseIssue = (issueToClose) => {
    setResolvedIssues(resolvedIssues.filter(issue => issue !== issueToClose));
  };

  const handleUpdateIssue = (updatedIssue) => {
    setIssues(issues.map(issue => issue.id === updatedIssue.id ? updatedIssue : issue));
  };

  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/ongoing-issues">Ongoing Issues</Link></li>
            <li><Link to="/resolved-issues">Resolved Issues</Link></li>
          </ul>
        </nav>
      </header>
      <main>
        {/* Conditionally render "Add New Issue" button */}
        {location.pathname !== '/' && location.pathname !== '/resolved-issues' && (
          <button 
            className="toggle-form-button" 
            onClick={handleAddIssueFormToggle}
          >
            {showAddIssueForm ? 'Close Add Issue Form' : 'Add New Issue'}
          </button>
        )}

        {showAddIssueForm && (
          <div className="add-issue-form">
            <h1>Create Incident</h1>
            <form>
              <div>
                <label>
                  What is wrong?
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
                  Since When?
                  <input
                    type="text"
                    name="since"
                    value={formData.since} // Auto-filled with current date and time
                    onChange={handleChange}
                    readOnly // Make this field read-only if you want to prevent manual changes
                  />
                </label>
              </div>
              <div>
                <label>
                  Affected service?
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
                  Cause?
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
                  Impact?
                  <input
                    type="text"
                    name="impact"
                    value={formData.impact}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div>
                <button type="button" onClick={handleCreate}>Create</button>
                <button type="button" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ongoing-issues" element={
            !showAddIssueForm && (
              <div className="issues-container">
                {issues.length > 0 ? (
                  <>
                    <h2>Ongoing Issues</h2>
                    <div className="issue-list">
                      {issues.map((issue, index) =>
                        editIndex === index ? (
                          <EditIssueForm
                            key={index}
                            issue={issue}
                            onSave={(updatedIssue) => handleUpdateIssue(updatedIssue)}
                            onCancel={() => setEditIndex(null)} // Close the form without saving
                          />
                        ) : (
                          <IssueCard
                            key={index}
                            issue={issue}
                            onResolve={() => handleResolve(index)}
                            onUpdateIssue={handleUpdateIssue}
                          />
                        )
                      )}
                    </div>
                  </>
                ) : (
                  <p>No ongoing issues.</p>
                )}
              </div>
            )
          } />

          <Route path="/resolved-issues" element={
            !showAddIssueForm && (
              <div className="resolved-container">
                {resolvedIssues.length > 0 ? (
                  <>
                    <h2>Resolved Issues</h2>
                    <div className="issue-list">
                      {resolvedIssues.map((issue, index) => (
                        <IssueCard
                          key={index}
                          issue={issue}
                          isResolved={true}
                          onClose={handleCloseIssue}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <p>No resolved issues.</p>
                )}
              </div>
            )
          } />

          {/* Default Route */}
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
