import React, { useState, useEffect } from 'react';
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
  const [offset, setOffset] = useState(0); // current offset
  const [totalIssues, setTotalIssues] = useState(0); // total issues count

  const location = useLocation();

  // Fetch issues from the backend
  useEffect(() => {
    fetchIssues();
  }, [offset]);

  const fetchIssues = () => {
    fetch(`http://localhost:8000/issues?limit=${limit}&offset=${offset}`)
      .then(response => response.json())
      .then(data => {
        const ongoing = data.filter(issue => issue.status === "ongoing");
        const resolved = data.filter(issue => issue.status === "resolved");
        setIssues(ongoing);
        setResolvedIssues(resolved);
        // Assume backend sends total count of issues
        setTotalIssues(data.totalIssues);
      })
      .catch(error => console.error('Error fetching issues:', error));
  };

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim() === '') {
      fetchIssues();
      return;
    }

    fetch(`http://localhost:8000/search?q=${encodeURIComponent(searchTerm)}&limit=${limit}&offset=${offset}`)
      .then(response => response.json())
      .then(data => {
        const ongoing = data.filter(issue => issue.status === "ongoing");
        const resolved = data.filter(issue => issue.status === "resolved");
        setIssues(ongoing);
        setResolvedIssues(resolved);
        setTotalIssues(data.totalIssues);
      })
      .catch(error => console.error('Error searching issues:', error));
  };

  const handleNextPage = () => {
    setOffset(offset + limit);
  };

  const handlePreviousPage = () => {
    setOffset(Math.max(0, offset - limit));
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

  const handleResolve = (index) => {
    const issueToResolve = issues[index];

    fetch(`http://localhost:8000/issues/${issueToResolve.id}`, {
      method: 'DELETE',
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
                  Systems Admin?
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
                            onCancel={() => setEditIndex(null)}
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
        </Routes>
        <div className="pagination">
          <button onClick={handlePreviousPage} disabled={offset === 0}>
            Previous
          </button>
          <button onClick={handleNextPage} disabled={offset + limit >= totalIssues}>
            Next
          </button>
        </div>
      </main>
    </div>
  );
}