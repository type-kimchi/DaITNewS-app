import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import ArticleDetail from './ArticleDetail';
import CategoryPage from './CategoryPage'; // Import the new CategoryPage component
import SearchResults from './SearchResults'; // Import the new SearchResults component

function Home({ articles }) {
  return (
    <div className="container mt-4">
      <h1 className="mb-4">DaITNew</h1>
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
      <footer className="footer mt-auto py-3" style={{ background: 'linear-gradient(to right, #434343, #000000)', color: '#ffffff' }}>
        <div className="container text-center">
          <p className="text-muted mb-1">Made by Sangwon Choi</p>
          <p className="mb-0">
            <span style={{ background: 'linear-gradient(to right, #ff00ff, #8a2be2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 'bold' }}>Powered by Gemini</span>
          </p>
          <a href="https://www.linkedin.com/in/sangwon-choi-542759176/" target="_blank" rel="noopener noreferrer" className="text-muted text-decoration-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-linkedin me-2" viewBox="0 0 16 16">
              <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542V13.394h2.401zm-1.2-5.33c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 5.33V9.567c0-.288.01-.46.09-.622.186-.349.63-.752 1.33-.752.973 0 1.371.738 1.371 1.817v3.789h2.401V9.567c0-1.954-1.013-2.83-2.398-2.83-1.178 0-1.78.66-2.093 1.185h.016V6.169H6.56v7.225h2.401z"/>
            </svg>
            LinkedIn
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;