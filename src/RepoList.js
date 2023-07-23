
import React, { useState, useEffect } from "react";
import axios from "axios";

const RepoList = ({ onRepoSelect }) => {
  const [repos, setRepos] = useState([]);
  const [timePeriod, setTimePeriod] = useState("1 month");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchRepos = async () => {
      const timePeriodMap = {
        "1 week": 7,
        "2 weeks": 14,
        "1 month": 30,
      };
      const daysAgo = timePeriodMap[timePeriod];

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - daysAgo);

      const formattedDate = thirtyDaysAgo.toISOString().split("T")[0];

      try {
        const response = await axios.get(
          `https://api.github.com/search/repositories?q=created:>${formattedDate}&sort=stars&order=desc&page=${page}`
        );
        setRepos((prevRepos) => [...prevRepos, ...response.data.items]);
      } catch (error) {
        console.error("Error fetching repos:", error);
      }
    };

    fetchRepos();
  }, [timePeriod, page]);

  const handleTimePeriodChange = (event) => {
    setTimePeriod(event.target.value);
    setPage(1); // Reset page number when changing time period
    setRepos([]); // Clear the previous list of repositories
  };

  const handleRepoClick = (repoName) => {
    onRepoSelect(repoName);
  };

  return (
    <div className="repo-list-container">
      <h2 className="header">Most Starred Repos</h2>
      <div className="select-container">
        <label htmlFor="timePeriod">Select Time Period:</label>
        <select
          id="timePeriod"
          value={timePeriod}
          onChange={handleTimePeriodChange}
        >
          <option value="1 week">1 week</option>
          <option value="2 weeks">2 weeks</option>
          <option value="1 month">1 month</option>
        </select>
      </div>
      <ul className="repo-list">
        {repos.map((repo) => (
          <li key={repo.id} onClick={() => handleRepoClick(repo.full_name)}>
            <div className="repo-info">
              <h3>{repo.full_name}</h3>
              <p>{repo.description}</p>
            </div>
            <div className="repo-stats">
              <p className="stars">Stars: {repo.stargazers_count}</p>
              <p className="issues">Issues: {repo.open_issues}</p>
              <div className="owner-info">
                <img src={repo.owner.avatar_url} alt="Owner Avatar" />
                <p>{repo.owner.login}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {repos.length > 0 && (
        <div className="pagination">
          <button onClick={() => setPage((prevPage) => prevPage - 1)} disabled={page === 1}>Previous</button>
          <button onClick={() => setPage((prevPage) => prevPage + 1)}>Next</button>
        </div>
      )}
    </div>
  );
};

export default RepoList;
