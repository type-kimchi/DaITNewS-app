import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function SearchResults({ articles }) {
  const location = useLocation();
  const [filteredArticles, setFilteredArticles] = useState([]);
  const searchQuery = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const results = articles.filter(
        article =>
          article.title.toLowerCase().includes(lowerCaseQuery) ||
          article.summary.toLowerCase().includes(lowerCaseQuery) ||
          article.category.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredArticles(results);
    } else {
      setFilteredArticles([]);
    }
  }, [searchQuery, articles]);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Search Results for "{searchQuery}"</h1>
      <div className="row">
        {filteredArticles.length > 0 ? (
          filteredArticles.map(article => (
            <div className="col-md-4 mb-4" key={article.id}>
              <Link to={`/article/${article.id}`} className="text-decoration-none text-dark">
                <div className="card article-card">
                  <img src={article.imageUrl} className="card-img-top article-square-img" alt={article.title} />
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p>No articles found matching your search.</p>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
