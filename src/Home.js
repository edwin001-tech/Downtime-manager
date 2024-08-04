import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Import the CSS file for Home component

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome!</h1>
      <p>
        This Incident Commander tool helps you keep track of everything that's going on when you're managing an incident including:
      </p>
      <ul>
        <li>Keeping track of all the current issues affecting your systems</li>
        <li>Managing a list of actions per issue</li>
        <li>Keeping track of a timeline of notes for each action</li>
        <li>Tracking who is working on what action(s)</li>
        <li>Reminding you when to ask for updates from people</li>
        <li>Making it easy to copy business & tech summaries to your clipboard so you can keep others updated</li>
        <li>Providing a shared notes area for free-form (also multiplayer-compatible) organization and collaboration</li>
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
