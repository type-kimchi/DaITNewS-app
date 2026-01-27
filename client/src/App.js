import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import ArticleDetail from './ArticleDetail';

const CategoryPage = lazy(() => import('./CategoryPage'));
const SearchResults = lazy(() => import('./SearchResults'));
const AdminPanel = lazy(() => import('./AdminPanel'));

function Home({ articles }) {
  // Function to get category color for styling
  const getCategoryStyle = (category) => {
    const categoryStyles = {
      'AI/Cloud': {
        backgroundColor: '#3b82f6',
        color: 'white'
      },
      'Daily IT News(데아뉴)': {
        backgroundColor: '#10b981',
        color: 'white'
      },
      'Global Business': {
        backgroundColor: '#8b5cf6',
        color: 'white'
      },
      'News': {
        backgroundColor: '#ef4444',
        color: 'white'
      },
      'AI/Finance': {
        backgroundColor: '#f59e0b',
        color: 'white'
      }
    };

    return categoryStyles[category] || {
      backgroundColor: '#6b7280',
      color: 'white'
    };
  };

  const getCoverUrl = (article) => {
    if (article.images && article.images.length > 0) return article.images[0];
    return article.imageUrl || '';
  };

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h1 className="mb-1 brand-title">Daily IT NewS</h1>
        <div className="brand-subtitle">데아뉴</div>
      </div>
      <div className="row">
        {articles.map(article => (
          <div className="col-md-4 mb-4" key={article.id}>
            <Link to={`/article/${article.id}`} className="text-decoration-none text-dark">
              <div className="card article-card">
                <div className="article-square-img-container">
                  {getCoverUrl(article) ? (
                    <img src={getCoverUrl(article)} className="article-square-img" alt={article.title} />
                  ) : (
                    <div className="article-square-img placeholder-img">No Image</div>
                  )}
                </div>
                
                {/* Keyword Title Below Thumbnail - like dafanew style */}
                <div className="card-body">
                  {/* Short descriptive title */}
                  <p className="card-text" style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#2d3748',
                    lineHeight: '1.4',
                    marginBottom: '0.8rem',
                    minHeight: '2.8rem', // Ensures consistent height
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {article.shortTitle || article.summary}
                  </p>
                  
                  {/* Category badge */}
                  <span 
                    className="badge rounded-pill px-3 py-1"
                    style={{
                      ...getCategoryStyle(article.category),
                      fontSize: '0.75rem',
                      letterSpacing: '0.3px'
                    }}
                  >
                    {article.category}
                  </span>
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
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
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
      setIsNavCollapsed(true);
    }
  };

  const handleNavToggle = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand brand-lockup" to="/" onClick={() => setIsNavCollapsed(true)}>
          <div className="brand-title">Daily IT NewS</div>
          <div className="brand-subtitle">데아뉴</div>
        </Link>
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
          <div className="d-flex align-items-center ms-auto gap-3">
            <a
              href="https://www.instagram.com/daily_itnews/"
              target="_blank"
              rel="noopener noreferrer"
              className="d-inline-flex align-items-center text-decoration-none"
              style={{ color: '#1f2937' }}
              aria-label="Instagram @daily_itnews"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-instagram me-2" viewBox="0 0 16 16">
                <path d="M8 3c1.627 0 1.83.006 2.473.036.644.03 1.086.14 1.34.23.334.12.571.26.82.51.25.249.39.486.51.82.09.254.2.696.23 1.34.03.643.036.846.036 2.473s-.006 1.83-.036 2.473c-.03.644-.14 1.086-.23 1.34-.12.334-.26.571-.51.82-.249.25-.486.39-.82.51-.254.09-.696.2-1.34.23-.643.03-.846.036-2.473.036s-1.83-.006-2.473-.036c-.644-.03-1.086-.14-1.34-.23a2.59 2.59 0 0 1-.82-.51 2.59 2.59 0 0 1-.51-.82c-.09-.254-.2-.696-.23-1.34C3.006 9.83 3 9.627 3 8s.006-1.83.036-2.473c.03-.644.14-1.086.23-1.34.12-.334.26-.571.51-.82.249-.25.486-.39.82-.51.254-.09.696-.2 1.34-.23C6.17 3.006 6.373 3 8 3m0-1.5C6.33 1.5 6.13 1.506 5.46 1.538c-.67.032-1.13.145-1.53.29-.42.152-.78.355-1.13.705-.35.35-.553.71-.705 1.13-.145.4-.258.86-.29 1.53C1.506 6.13 1.5 6.33 1.5 8c0 1.67.006 1.87.038 2.54.032.67.145 1.13.29 1.53.152.42.355.78.705 1.13.35.35.71.553 1.13.705.4.145.86.258 1.53.29.67.032.87.038 2.54.038s1.87-.006 2.54-.038c.67-.032 1.13-.145 1.53-.29.42-.152.78-.355 1.13-.705.35-.35.553-.71.705-1.13.145-.4.258-.86.29-1.53.032-.67.038-.87.038-2.54s-.006-1.87-.038-2.54c-.032-.67-.145-1.13-.29-1.53a3.68 3.68 0 0 0-.705-1.13 3.68 3.68 0 0 0-1.13-.705c-.4-.145-.86-.258-1.53-.29C9.87 1.506 9.67 1.5 8 1.5z"/>
                <path d="M8 5.5A2.5 2.5 0 1 0 8 10.5 2.5 2.5 0 0 0 8 5.5m0-1.5A4 4 0 1 1 8 12a4 4 0 0 1 0-8z"/>
                <path d="M12.5 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
              </svg>
              <span className="d-none d-md-inline">@daily_itnews</span>
            </a>
            <form className="form-inline my-2 my-lg-0 d-flex" onSubmit={handleSearchSubmit}>
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
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home articles={articles} />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/admin" element={<Suspense fallback={<div>Loading...</div>}><AdminPanel /></Suspense>} />
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
          <div className="d-inline-flex align-items-center gap-3">
            <a href="https://www.linkedin.com/in/sangwon-choi-542759176/" target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff', textDecoration: 'none' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-linkedin me-2" viewBox="0 0 16 16" style={{ color: '#ffffff' }}>
              <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542V13.394h2.401zm-1.2-5.33c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 5.33V9.567c0-.288.01-.46.09-.622.186-.349.63-.752 1.33-.752.973 0 1.371.738 1.371 1.817v3.789h2.401V9.567c0-1.954-1.013-2.83-2.398-2.83-1.178 0-1.78.66-2.093 1.185h.016V6.169H6.56v7.225h2.401z"/>
            </svg>
            LinkedIn
            </a>
            <a href="https://www.instagram.com/daily_itnews/" target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff', textDecoration: 'none' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-instagram me-2" viewBox="0 0 16 16" style={{ color: '#ffffff' }}>
                <path d="M8 3c1.627 0 1.83.006 2.473.036.644.03 1.086.14 1.34.23.334.12.571.26.82.51.25.249.39.486.51.82.09.254.2.696.23 1.34.03.643.036.846.036 2.473s-.006 1.83-.036 2.473c-.03.644-.14 1.086-.23 1.34-.12.334-.26.571-.51.82-.249.25-.486.39-.82.51-.254.09-.696.2-1.34.23-.643.03-.846.036-2.473.036s-1.83-.006-2.473-.036c-.644-.03-1.086-.14-1.34-.23a2.59 2.59 0 0 1-.82-.51 2.59 2.59 0 0 1-.51-.82c-.09-.254-.2-.696-.23-1.34C3.006 9.83 3 9.627 3 8s.006-1.83.036-2.473c.03-.644.14-1.086.23-1.34.12-.334.26-.571.51-.82.249-.25.486-.39.82-.51.254-.09.696-.2 1.34-.23C6.17 3.006 6.373 3 8 3m0-1.5C6.33 1.5 6.13 1.506 5.46 1.538c-.67.032-1.13.145-1.53.29-.42.152-.78.355-1.13.705-.35.35-.553.71-.705 1.13-.145.4-.258.86-.29 1.53C1.506 6.13 1.5 6.33 1.5 8c0 1.67.006 1.87.038 2.54.032.67.145 1.13.29 1.53.152.42.355.78.705 1.13.35.35.71.553 1.13.705.4.145.86.258 1.53.29.67.032.87.038 2.54.038s1.87-.006 2.54-.038c.67-.032 1.13-.145 1.53-.29.42-.152.78-.355 1.13-.705.35-.35.553-.71.705-1.13.145-.4.258-.86.29-1.53.032-.67.038-.87.038-2.54s-.006-1.87-.038-2.54c-.032-.67-.145-1.13-.29-1.53a3.68 3.68 0 0 0-.705-1.13 3.68 3.68 0 0 0-1.13-.705c-.4-.145-.86-.258-1.53-.29C9.87 1.506 9.67 1.5 8 1.5z"/>
                <path d="M8 5.5A2.5 2.5 0 1 0 8 10.5 2.5 2.5 0 0 0 8 5.5m0-1.5A4 4 0 1 1 8 12a4 4 0 0 1 0-8z"/>
                <path d="M12.5 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
              </svg>
              @daily_itnews
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
