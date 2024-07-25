import React, { useState } from 'react';
import './App.css';
import IssueCard from './IssueCard';

function App() {
  const [formData, setFormData] = useState({
    issue: '',
    since: '',
    service: ''
  });

  const [issues, setIssues] = useState([]);
  const [showAddIssueForm, setShowAddIssueForm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCreate = () => {
    setIssues([...issues, formData]);
    setFormData({
      issue: '',
      since: '',
      service: ''
    });
    setShowAddIssueForm(false);
  };

  const handleCancel = () => {
    setFormData({
      issue: '',
      since: '',
      service: ''
    });
    setShowAddIssueForm(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <ul>
            <li>Home</li>
            <li>Manage Issue</li>
          </ul>
        </nav>
      </header>
      <main>
        <button 
          className="toggle-form-button" 
          onClick={() => setShowAddIssueForm(!showAddIssueForm)}
        >
          {showAddIssueForm ? 'Close Add Issue Form' : 'Add New Issue'}
        </button>

        {showAddIssueForm && (
          <div className="add-issue-form">
            <h1>Create Issue</h1>
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
                    value={formData.since}
                    onChange={handleChange}
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
                <button type="button" onClick={handleCreate}>Create</button>
                <button type="button" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          </div>
        )}
        <div className="issues-container">
        <h2>Ongoing Issues</h2>
        <div className="issue-list">
          {issues.map((issue, index) => (
            <IssueCard key={index} issue={issue} />
          ))}
        </div>
        </div>
      </main>
    </div>
  );
}

export default App;
