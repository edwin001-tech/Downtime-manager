import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Import the CSS file for Home component

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome!</h1>
      <p>
        This Incident tool helps you keep track of everything that's going on when you're managing an incident including:
      </p>
      <ul>
        <li>Keeping track of all the current issues affecting the systems</li>
        <li>Managing a list of actions per issue</li>
        <li>Separate ongoing issues from resolved issues</li>
        <li>Tracking who is working on what issue(s)</li>
        <li>Edit issues where there are updates</li>
        <li>Making it easy to copy business & tech summaries to your clipboard so you can keep others updated</li>
        <li>Issues and their status(resolved/ongoing) are persisted in the database</li>
      </ul>
      <div className="home-footer">
        <Link to="/ongoing-issues">
          <button className="toggle-form-button">Manage Incident</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
