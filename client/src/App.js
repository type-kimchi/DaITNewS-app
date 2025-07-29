import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import ArticleDetail from './ArticleDetail';
import CategoryPage from './CategoryPage'; // Import the new CategoryPage component
import SearchResults from './SearchResults'; // Import the new SearchResults component

function Home({ articles }) {
  return (
    <div className="container mt-4">
      <h1 className="mb-4">Latest IT News</h1>
      <div className="row">
        {articles.map(article => (
          <div className="col-md-4 mb-4" key={article.id}>
            <div className="card">
              <img src={article.imageUrl} className="card-img-top" alt={article.title} />
              <div className="card-body">
                <h5 className="card-title">{article.title}</h5>
                <p className="card-text">{article.summary}</p>
                <p className="card-text"><small className="text-muted">{article.category} - {article.date}</small></p>
                <Link to={`/article/${article.id}`} className="btn btn-primary">Read More</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => setArticles(data))
      .catch(err => console.error(err));
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">DaITNewS</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item"><Link className="nav-link" to="/ai-cloud">AI/Cloud</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/platform" id="daily-it-news-link">Daily IT News(데아뉴)</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/global-business">Global Business</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/news">News</Link></li>
          </ul>
          <form className="form-inline my-2 my-lg-0 d-flex ms-auto" onSubmit={handleSearchSubmit}>
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
          </form>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home articles={articles} />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/ai-cloud" element={<CategoryPage articles={articles} category="AI/Cloud" />} />
        <Route path="/platform" element={<CategoryPage articles={articles} category="Daily IT News(데아뉴)" />} />
        <Route path="/global-business" element={<CategoryPage articles={articles} category="Global Business" />} />
        <Route path="/news" element={<CategoryPage articles={articles} category="News" />} />
        <Route path="/search" element={<SearchResults articles={articles} />} />
      </Routes>
    </div>
  );
}

export default App;