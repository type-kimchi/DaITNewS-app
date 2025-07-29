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
          <p>No articles found in this category.</p>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
