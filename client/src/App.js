import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import ArticleDetail from './ArticleDetail';
// import CategoryPage from './CategoryPage'; // Import the new CategoryPage component
// import SearchResults from './SearchResults'; // Import the new SearchResults component

const CategoryPage = lazy(() => import('./CategoryPage'));
const SearchResults = lazy(() => import('./SearchResults'));

function Home({ articles }) {
  return (
    <div className="container mt-4">
      <h1 className="mb-4">DaITNew</h1>
      <div className="row">
        {articles.map(article => (
          <div className="col-md-4 mb-4" key={article.id}>
            <Link to={`/article/${article.id}`} className="text-decoration-none text-dark">
              <div className="card article-card">
                <div className="article-square-img-container">
                  <img src={article.imageUrl} className="article-square-img" alt={article.title} />
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNavCollapsed, setIsNavCollapsed] = useState(true); // State for navbar collapse
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
      setIsNavCollapsed(true); // Collapse navbar after search
    }
  };

  const handleNavToggle = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/" onClick={() => setIsNavCollapsed(true)}>DaITNewS</Link>
        <button className="navbar-toggler" type="button" aria-controls="navbarNav" aria-expanded={!isNavCollapsed} aria-label="Toggle navigation" onClick={handleNavToggle}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={ `${isNavCollapsed ? 'collapse' : ''} navbar-collapse` } id="navbarNav">
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
        <Route path="/ai-cloud" element={<Suspense fallback={<div>Loading...</div>}><CategoryPage articles={articles} category="AI/Cloud" /></Suspense>} />
        <Route path="/platform" element={<Suspense fallback={<div>Loading...</div>}><CategoryPage articles={articles} category="Daily IT News(데아뉴)" /></Suspense>} />
        <Route path="/global-business" element={<Suspense fallback={<div>Loading...</div>}><CategoryPage articles={articles} category="Global Business" /></Suspense>} />
        <Route path="/news" element={<Suspense fallback={<div>Loading...</div>}><CategoryPage articles={articles} category="News" /></Suspense>} />
        <Route path="/search" element={<Suspense fallback={<div>Loading...</div>}><SearchResults articles={articles} /></Suspense>} />
      </Routes>
      <footer className="footer mt-auto py-3" style={{ background: 'linear-gradient(to right, #434343, #000000)', color: '#ffffff' }}>
        <div className="container text-center">
          <p className="mb-1" style={{ color: '#ffffff' }}>Made by Sangwon Choi</p>
          <p className="mb-0">
            <span style={{ background: 'linear-gradient(to right, #ff00ff, #8a2be2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 'bold' }}>Powered by Gemini</span>
          </p>
          <a href="https://www.linkedin.com/in/sangwon-choi-542759176/" target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff', textDecoration: 'none' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-linkedin me-2" viewBox="0 0 16 16" style={{ color: '#ffffff' }}>
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