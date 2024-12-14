import React, { useState, useEffect, useCallback } from "react";
import {
  Route,
  Routes,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import IssueCard from "./IssueCard";
import EditIssueForm from "./EditIssueForm";
import Home from "./Home";
// import Footer from "./Footer";

function App() {
  const [formData, setFormData] = useState({
    issue: "",
    since: "",
    service: "",
    cause: "",
    impact: "",
    trying: "",
    person: "",
    additionalInfo: "",
  });

  const [issues, setIssues] = useState([]);
  const [resolvedIssues, setResolvedIssues] = useState([]);
  // const [editIndex, setEditIndex] = useState(null);
  const [showAddIssueForm, setShowAddIssueForm] = useState(false);
  const [itemsPerPage] = useState(6); // items per page

  // Ongoing issues pagination state
  const [ongoingOffset, setOngoingOffset] = useState(0);
  const [totalOngoingIssues, setTotalOngoingIssues] = useState(0);

  // Resolved issues pagination state
  const [resolvedOffset, setResolvedOffset] = useState(0);
  const [totalResolvedIssues, setTotalResolvedIssues] = useState(0);

  const [isEditing, setIsEditing] = useState(false); // Tracks if edit form is open
  const [selectedIssue, setSelectedIssue] = useState(null); // Tracks the issue being edited

  const [currentOngoingPage, setCurrentOngoingPage] = useState(1);
  const [totalOngoingPages, setTotalOngoingPages] = useState(0);

  const [currentResolvedPage, setCurrentResolvedPage] = useState(1);
  const [totalResolvedPages, setTotalResolvedPages] = useState(0);

  const location = useLocation(); 
  const navigate = useNavigate();

  // Fetch ongoing issues
  const fetchOngoingIssues = useCallback(() => {
    fetch(
      `http://localhost:8000/ongoing-issues?page=${currentOngoingPage}&itemsPerPage=${itemsPerPage}`
    )
      .then((response) => response.json())
      .then((data) => {
        setIssues(data.issues);
        setTotalOngoingPages(data.totalPages);
      })
      .catch((error) => console.error("Error fetching ongoing issues:", error));
  }, [currentOngoingPage, itemsPerPage]);

  // Fetch resolved issues
  const fetchResolvedIssues = useCallback(() => {
    fetch(
      `http://localhost:8000/resolved-issues?page=${currentResolvedPage}&itemsPerPage=${itemsPerPage}`
    )
      .then((response) => response.json())
      .then((data) => {
        setResolvedIssues(data.issues);
        setTotalResolvedPages(data.totalPages);
      })
      .catch((error) =>
        console.error("Error fetching resolved issues:", error)
      );
  }, [currentResolvedPage, itemsPerPage]);

  useEffect(() => {
    fetchOngoingIssues();
    fetchResolvedIssues();
  }, [fetchOngoingIssues, fetchResolvedIssues]);

  // Handle pagination for ongoing issues
  const handleNextOngoingPage = () => {
    setCurrentOngoingPage((prev) => Math.min(prev + 1, totalOngoingPages));
  };

  const handlePreviousOngoingPage = () => {
    setCurrentOngoingPage((prev) => Math.max(1, prev - 1));
  };

  // Handle pagination for resolved issues
  const handleNextResolvedPage = () => {
    setCurrentResolvedPage((prev) => Math.min(prev + 1, totalResolvedPages));
  };

  const handlePreviousResolvedPage = () => {
    setCurrentResolvedPage((prev) => Math.max(1, prev - 1));
  };

  // Handle search functionality
  const handleSearch = (searchTerm) => {
    if (searchTerm.trim() === "") {
      fetchOngoingIssues();
      fetchResolvedIssues();
      return;
    }

    fetch(
      `http://localhost:8000/search?q=${encodeURIComponent(
        searchTerm
      )}&itemsPerPage=${itemsPerPage}`
    )
      .then((response) => response.json())
      .then((data) => {
        const ongoing = data.issues.filter(
          (issue) => issue.status === "ongoing"
        );
        const resolved = data.issues.filter(
          (issue) => issue.status === "resolved"
        );
        setIssues(ongoing);
        setResolvedIssues(resolved);
        // setTotalOngoingIssues(ongoing.length);
        setTotalResolvedIssues(resolved.length);
      })
      .catch((error) => console.error("Error searching issues:", error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getCurrentDateTime = () => {
    const currentDate = new Date();
    return currentDate.toLocaleString();
  };

  const handleCreate = () => {
    fetch("http://localhost:8000/issues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((newIssue) => {
        setIssues([...issues, newIssue]);
        setFormData({
          issue: "",
          since: "",
          service: "",
          cause: "",
          impact: "",
          trying: "",
          person: "",
          additionalInfo: "",
        });
        setShowAddIssueForm(false);
      })
      .catch((error) => console.error("Error creating issue:", error));
  };

  const handleCancel = () => {
    setFormData({
      issue: "",
      since: "",
      service: "",
      cause: "",
      impact: "",
      trying: "",
      person: "",
      additionalInfo: "",
    });
    setShowAddIssueForm(false);
  };

  const handleAddIssueFormToggle = () => {
    setShowAddIssueForm(!showAddIssueForm);
    if (!showAddIssueForm) {
      setFormData({
        ...formData,
        since: getCurrentDateTime(),
      });
    }
  };

  // Resolving an issue (PUT request instead of DELETE)
  const handleResolve = (index) => {
    const issueToResolve = issues[index];

    fetch(`http://localhost:8000/issues/${issueToResolve.id}/resolve`, {
      method: "PUT",
    })
      .then((response) => response.json())
      .then((data) => {
        const newIssues = issues.filter((_, i) => i !== index);
        setIssues(newIssues);
        setResolvedIssues([
          ...resolvedIssues,
          {
            ...issueToResolve,
            status: "resolved",
            resolved_timestamp: data.resolved_timestamp,
          },
        ]);
      })
      .catch((error) => console.error("Error resolving issue:", error));
  };

  const handleUpdateIssue = (updatedIssue) => {
    fetch(`http://localhost:8000/issues/${updatedIssue.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedIssue),
    })
      .then((response) => response.json())
      .then(() => {
        setIssues(
          issues.map((issue) =>
            issue.id === updatedIssue.id ? updatedIssue : issue
          )
        );
        // setEditIndex(null);
        navigate("/ongoing-issues"); // Redirect back to ongoing issues
      })
      .catch((error) => console.error("Error updating issue:", error));
  };

  const handleEditClick = (issue) => {
    setSelectedIssue(issue); // Set the selected issue to be edited
    setIsEditing(true); // Open the Edit form
  };

  const handleCancelEdit = () => {
    setIsEditing(false); // Close the Edit form
    // setEditIndex(null); // Reset the selected issue index
    navigate("/ongoing-issues");
  };

  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/ongoing-issues">Ongoing Issues</Link>
            </li>
            <li>
              <Link to="/resolved-issues">Resolved Issues</Link>
            </li>
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
        {location.pathname !== "/" &&
          location.pathname !== "/resolved-issues" &&
          !isEditing && (
            <button
              className="toggle-form-button"
              onClick={handleAddIssueFormToggle}
            >
              {showAddIssueForm
                ? "Close Add New Incident Form"
                : "Add New Incident"}
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
                  Action?
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
                  System Admin?
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
              <button type="button" onClick={handleCreate}>
                Create Incident
              </button>
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>
            </form>
          </div>
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/ongoing-issues"
            element={
              !showAddIssueForm && (
                <>
                  <div className="issues-container">
                    {issues.length > 0 ? (
                      <>
                        <h2>Ongoing Issues</h2>
                        <div className="issue-list">
                          {issues.map((issue, index) => (
                            <IssueCard
                              key={issue.id}
                              issue={issue}
                              onEdit={() => {
                                // setEditIndex(index);
                                navigate(`/ongoing-issues/edit/${issue.id}`);
                                handleEditClick(issue);
                              }}
                              onResolve={() => handleResolve(index)}
                            />
                          ))}
                        </div>
                        <div className="pagination-controls">
                          <button
                            onClick={handlePreviousOngoingPage}
                            disabled={currentOngoingPage === 1}
                          >
                            Previous
                          </button>
                          <span>
                            Page {currentOngoingPage} of {totalOngoingPages}
                          </span>
                          <button
                            onClick={handleNextOngoingPage}
                            disabled={currentOngoingPage === totalOngoingPages}
                          >
                            Next
                          </button>
                        </div>
                      </>
                    ) : (
                      <h2>No ongoing issues.</h2>
                    )}

                    {/* Display the edit form if editing */}
                    {/* {isEditing && (
                  <EditIssueForm
                    issue={selectedIssue}
                    onUpdate={handleUpdateIssue}
                    onCancel={handleCancelEdit}
                  />
                )} */}
                  </div>
                </>
              )
            }
          />
          <Route
            path="/resolved-issues"
            element={
              <>
                <div className="resolved-container">
                  <h2>Resolved Issues</h2>
                  <div className="issue-list">
                    {resolvedIssues.map((issue, index) => (
                      <IssueCard key={issue.id} issue={issue} isResolved />
                    ))}
                  </div>
                </div>
                <div className="pagination-controls">
                  <button
                    onClick={handlePreviousResolvedPage}
                    disabled={currentResolvedPage === 1}
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentResolvedPage} of {totalResolvedPages}
                  </span>
                  <button
                    onClick={handleNextResolvedPage}
                    disabled={currentResolvedPage === totalResolvedPages}
                  >
                    Next
                  </button>
                </div>
              </>
            }
          />

          <Route
            path="/ongoing-issues/edit/:id"
            element={
              <EditIssueForm
                issue={selectedIssue}
                onSave={handleUpdateIssue}
                onCancel={handleCancelEdit}
              />
            }
          />
        </Routes>
      </main>

      {/* Footer
      <Footer /> */}
    </div>
  );
}

export default App;
