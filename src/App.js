import React, { useState, useEffect, useCallback } from 'react';
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
    trying: '',
    person: '',
    additionalInfo: ''
  });

  const [issues, setIssues] = useState([]);
  const [resolvedIssues, setResolvedIssues] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [showAddIssueForm, setShowAddIssueForm] = useState(false);
  
  const [limit] = useState(6); // items per page

  // Ongoing issues pagination state
  const [ongoingOffset, setOngoingOffset] = useState(0); 
  const [totalOngoingIssues, setTotalOngoingIssues] = useState(0);

  // Resolved issues pagination state
  const [resolvedOffset, setResolvedOffset] = useState(0);
  const [totalResolvedIssues, setTotalResolvedIssues] = useState(0);

  const location = useLocation();

  // Fetch ongoing issues
  const fetchOngoingIssues = useCallback(() => {
    fetch(`http://localhost:8000/ongoing-issues?limit=${limit}&offset=${ongoingOffset}`)
      .then(response => response.json())
      .then(data => {
        setIssues(data.issues);
        setTotalOngoingIssues(data.totalIssues);
        // Reset offset if necessary
        if (ongoingOffset >= data.totalIssues) {
          setOngoingOffset(0);
        }
      })
      .catch(error => console.error('Error fetching ongoing issues:', error));
  }, [limit, ongoingOffset]);

  // Fetch resolved issues
  const fetchResolvedIssues = useCallback(() => {
    fetch(`http://localhost:8000/resolved-issues?limit=${limit}&offset=${resolvedOffset}`)
      .then(response => response.json())
      .then(data => {
        setResolvedIssues(data.issues);
        setTotalResolvedIssues(data.totalIssues);
        // Reset offset if necessary
        if (resolvedOffset >= data.totalIssues) {
          setResolvedOffset(0);
        }
      })
      .catch(error => console.error('Error fetching resolved issues:', error));
  }, [limit, resolvedOffset]);

  useEffect(() => {
    fetchOngoingIssues();
    fetchResolvedIssues();
  }, [fetchOngoingIssues, fetchResolvedIssues]);

  // Handle pagination for ongoing issues
  const handleNextOngoingPage = () => {
    setOngoingOffset(prev => prev + limit);
  };

  const handlePreviousOngoingPage = () => {
    setOngoingOffset(prev => Math.max(0, prev - limit));
  };

  // Handle pagination for resolved issues
  const handleNextResolvedPage = () => {
    setResolvedOffset(prev => prev + limit);
  };

  const handlePreviousResolvedPage = () => {
    setResolvedOffset(prev => Math.max(0, prev - limit));
  };

  // Handle search functionality
  const handleSearch = (searchTerm) => {
    if (searchTerm.trim() === '') {
      fetchOngoingIssues();
      fetchResolvedIssues();
      return;
    }

    fetch(`http://localhost:8000/search?q=${encodeURIComponent(searchTerm)}&limit=${limit}`)
      .then(response => response.json())
      .then(data => {
        const ongoing = data.issues.filter(issue => issue.status === "ongoing");
        const resolved = data.issues.filter(issue => issue.status === "resolved");
        setIssues(ongoing);
        setResolvedIssues(resolved);
        setTotalOngoingIssues(ongoing.length);
        setTotalResolvedIssues(resolved.length);
      })
      .catch(error => console.error('Error searching issues:', error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const getCurrentDateTime = () => {
    const currentDate = new Date();
    return currentDate.toLocaleString();
  };

  const handleCreate = () => {
    fetch('http://localhost:8000/issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(newIssue => {
        setIssues([...issues, newIssue]);
        setFormData({
          issue: '',
          since: '',
          service: '',
          cause: '',
          impact: '',
          trying: '',
          person: '',
          additionalInfo: ''
        });
        setShowAddIssueForm(false);
      })
      .catch(error => console.error('Error creating issue:', error));
  };

  const handleCancel = () => {
    setFormData({
      issue: '',
      since: '',
      service: '',
      cause: '',
      impact: '',
      trying: '',
      person: '',
      additionalInfo: ''
    });
    setShowAddIssueForm(false);
  };

  const handleAddIssueFormToggle = () => {
    setShowAddIssueForm(!showAddIssueForm);
    if (!showAddIssueForm) {
      setFormData({
        ...formData,
        since: getCurrentDateTime()
      });
    }
  };

  // Resolving an issue (PUT request instead of DELETE)
  const handleResolve = (index) => {
    const issueToResolve = issues[index];

    fetch(`http://localhost:8000/issues/${issueToResolve.id}/resolve`, {
      method: 'PUT',
    })
      .then(() => {
        const newIssues = issues.filter((_, i) => i !== index);
        setIssues(newIssues);
        setResolvedIssues([...resolvedIssues, { ...issueToResolve, status: "resolved" }]);
      })
      .catch(error => console.error('Error resolving issue:', error));
  };

  const handleUpdateIssue = (updatedIssue) => {
    fetch(`http://localhost:8000/issues/${updatedIssue.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedIssue),
    })
      .then(response => response.json())
      .then(() => {
        setIssues(issues.map(issue => issue.id === updatedIssue.id ? updatedIssue : issue));
        setEditIndex(null);
      })
      .catch(error => console.error('Error updating issue:', error));
  };

  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/ongoing-issues">Ongoing Issues</Link></li>
            <li><Link to="/resolved-issues">Resolved Issues</Link></li>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search issues..."
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </ul>
        </nav>
      </header>
      <main>
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
                  Description?
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
                    value={formData.since}
                    onChange={handleChange}
                    readOnly
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
                <label>
                  What are we trying?
                  <input
                    type="text"
                    name="trying"
                    value={formData.trying}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div>
                <label>
                  Who is doing it?
                  <input
                    type="text"
                    name="person"
                    value={formData.person}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div>
                <label>
                  Any additional Information?
                  <textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <button type="button" onClick={handleCreate}>Create Issue</button>
              <button type="button" onClick={handleCancel}>Cancel</button>
            </form>
          </div>
        )}
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/ongoing-issues"
            element={
              <div className='issues-container'>
                <h2>Ongoing Issues</h2>
                <div className='issue-list'>
                {issues.length === 0 ? (
                  <p>No ongoing issues</p>
                ) : (
                  issues.map((issue, index) => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      onResolve={() => handleResolve(index)}
                      onEdit={() => setEditIndex(index)}
                    />
                  ))
                )}
                </div>
                <div className="pagination-controls">
                  {ongoingOffset > 0 && <button onClick={handlePreviousOngoingPage}>Previous</button>}
                  {ongoingOffset + limit < totalOngoingIssues && <button onClick={handleNextOngoingPage}>Next</button>}
                </div>
              </div>
            }
          />
          <Route
            path="/resolved-issues"
            element={

              <div className='issues-container'>
                <h2>Resolved Issues</h2>
                <div className="issue-list">
                {resolvedIssues.length === 0 ? (
                  <p>No resolved issues</p>
                ) : (
                  resolvedIssues.map((issue, index) => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                    />
                  ))
                )}
                </div>
                <div className="pagination-controls">
                  {resolvedOffset > 0 && <button onClick={handlePreviousResolvedPage}>Previous</button>}
                  {resolvedOffset + limit < totalResolvedIssues && <button onClick={handleNextResolvedPage}>Next</button>}
                </div>
              </div>
            }
          />
          <Route
            path="/edit-issue/:index"
            element={
              <EditIssueForm
                issue={issues[editIndex]}
                onSave={handleUpdateIssue}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
