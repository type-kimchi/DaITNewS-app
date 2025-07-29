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
          ))
        ) : (
          <p>No articles found matching your search.</p>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
