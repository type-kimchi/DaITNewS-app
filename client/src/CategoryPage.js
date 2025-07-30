import React from 'react';
import { Link } from 'react-router-dom';

function CategoryPage({ articles, category }) {
  const filteredArticles = articles.filter(article => article.category === category);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">{category} Articles</h1>
      <div className="row">
        {filteredArticles.length > 0 ? (
          filteredArticles.map(article => (
            <div className="col-md-4 mb-4" key={article.id}>
              <Link to={`/article/${article.id}`} className="text-decoration-none text-dark">
                <div className="card article-card">
                  <div className="article-square-img-container">
                    <img src={article.imageUrl} className="article-square-img" alt={article.title} />
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p>No articles found in this category.</p>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
