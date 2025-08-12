import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const commentsContainerRef = useRef(null);

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

  useEffect(() => {
    if (!commentsContainerRef.current) return;

    const commentsEl = commentsContainerRef.current; // Capture the current ref value

    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', 'type-kimchi/DaITNewS-app'); // Your GitHub repo
    script.setAttribute('issue-term', 'pathname'); // Map comments to page path
    script.setAttribute('theme', 'github-dark'); // Or 'github-dark', 'preferred-color-scheme', etc.
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('async', '');

    commentsEl.appendChild(script);

    return () => {
      // Cleanup: remove the script when the component unmounts
      if (commentsEl && script.parentNode) {
        commentsEl.removeChild(script);
      }
    };
  }, [article]); // Re-run when article changes to ensure comments load for new article

  if (!article) {
    return <div>Loading article...</div>;
  }

  return (
    <div className="container mt-4">
      <Helmet>
        <title>{article.title} | DaITNewS</title>
        <meta name="description" content={article.summary} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.summary} />
        <meta property="og:image" content={article.imageUrl} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="article" />
      </Helmet>
      <h1>{article.title}</h1>
      <img src={article.imageUrl} className="img-fluid" alt={article.title} />
      <p>{article.summary}</p>
      <p><small className="text-muted">{article.category} - {article.date}</small></p>
      {/* In a real app, you'd have full article content here */}

      <div className="comments-section mt-5">
        <h2>Comments</h2>
        <div ref={commentsContainerRef} />
      </div>
    </div>
  );
}

export default ArticleDetail;

function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const commentsContainerRef = useRef(null);

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

  useEffect(() => {
    if (!commentsContainerRef.current) return;

    const commentsEl = commentsContainerRef.current; // Capture the current ref value

    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', 'type-kimchi/DaITNewS-app'); // Your GitHub repo
    script.setAttribute('issue-term', 'pathname'); // Map comments to page path
    script.setAttribute('theme', 'github-dark'); // Or 'github-dark', 'preferred-color-scheme', etc.
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('async', '');

    commentsEl.appendChild(script);

    return () => {
      // Cleanup: remove the script when the component unmounts
      if (commentsEl && script.parentNode) {
        commentsEl.removeChild(script);
      }
    };
  }, [article]); // Re-run when article changes to ensure comments load for new article

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

      <div className="comments-section mt-5">
        <h2>Comments</h2>
        <div ref={commentsContainerRef} />
      </div>
    </div>
  );
}

export default ArticleDetail;