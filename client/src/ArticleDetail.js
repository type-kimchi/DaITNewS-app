import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5001/api/articles/${id}`)
      .then(res => res.json())
      .then(data => setArticle(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!article) {
    return <div>Loading article...</div>;
  }

  return (
    <div className="container mt-4">
      <h1>{article.title}</h1>
      <img src={article.imageUrl} className="img-fluid" alt={article.title} />
      <p>{article.summary}</p>
      <p><small className="text-muted">{article.category} - {article.date}</small></p>
      {/* In a real app, you'd have full article content here */}
    </div>
  );
}

export default ArticleDetail;