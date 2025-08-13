import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function SearchResults({ articles }) {
  const location = useLocation();
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchQuery = new URLSearchParams(location.search).get('query');

  // Function to get category color for styling (same as Home component)
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

  useEffect(() => {
    if (searchQuery) {
      setLoading(true);
      
      // Try to use the backend search API first
      fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => {
          setFilteredArticles(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Backend search failed, using client-side search:', err);
          
          // Fallback to client-side search if backend search fails
          const lowerCaseQuery = searchQuery.toLowerCase();
          const results = articles.filter(
            article =>
              article.title.toLowerCase().includes(lowerCaseQuery) ||
              (article.shortTitle && article.shortTitle.toLowerCase().includes(lowerCaseQuery)) ||
              article.summary.toLowerCase().includes(lowerCaseQuery) ||
              article.category.toLowerCase().includes(lowerCaseQuery)
          );
          setFilteredArticles(results);
          setLoading(false);
        });
    } else {
      setFilteredArticles([]);
      setLoading(false);
    }
  }, [searchQuery, articles]);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Searching...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Search Results for "{searchQuery}"</h1>
      <p className="text-muted mb-4">{filteredArticles.length} article(s) found</p>
      
      <div className="row">
        {filteredArticles.length > 0 ? (
          filteredArticles.map(article => (
            <div className="col-md-4 mb-4" key={article.id}>
              <Link to={`/article/${article.id}`} className="text-decoration-none text-dark">
                <div className="card article-card">
                  <div className="article-square-img-container">
                    <img src={article.imageUrl} className="article-square-img" alt={article.title} />
                  </div>
                  
                  {/* Keyword Title Below Thumbnail - same as Home component */}
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
          ))
        ) : (
          <div className="col-12">
            <div className="text-center py-5">
              <h3 className="text-muted">No articles found</h3>
              <p className="text-muted">Try searching with different keywords</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;