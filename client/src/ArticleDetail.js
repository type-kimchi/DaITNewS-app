import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    console.log(`Fetching article with ID: ${id}`);
    fetch(`/api/articles/${id}`)
      .then(res => {
        if (!res.ok) {
          console.error(`HTTP error! status: ${res.status}`);
          return res.text().then(text => Promise.reject(text));
        }
        return res.json();
      })
      .then(data => {
        console.log('Received article data:', data);
        setArticle(data);
      })
      .catch(err => {
        console.error('Error fetching article:', err);
        setArticle(null); // Ensure loading state if error
      });
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