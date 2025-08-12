import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from '@vuer-ai/react-helmet-async';

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
        setArticle(null);
      });
  }, [id]);

  useEffect(() => {
    if (!commentsContainerRef.current) return;

    const commentsEl = commentsContainerRef.current;

    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', 'type-kimchi/DaITNewS-app');
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('theme', 'github-dark');
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('async', '');

    commentsEl.appendChild(script);

    return () => {
      if (commentsEl && script.parentNode) {
        commentsEl.removeChild(script);
      }
    };
  }, [article]);

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

  if (!article) {
    return (
      <div className="container mt-4 d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading article...</span>
        </div>
      </div>
    );
  }

  console.log('Article data for rendering:', article);
  console.log('Article title:', article.title);

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
      
      {/* Article Image with Keyword Title Below */}
      <div className="article-image-container mb-4">
        <img 
          src={article.imageUrl} 
          className="img-fluid rounded shadow-sm" 
          alt={article.title}
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '400px',
            objectFit: 'cover'
          }}
        />
        
        {/* Short descriptive title below thumbnail - like dafanew style */}
        <div className="keyword-title-container mt-3 mb-4">
          <p style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#2d3748',
            lineHeight: '1.4',
            marginBottom: '0.5rem',
            padding: '0 10px'
          }}>
            {article.shortTitle || article.summary}
          </p>
          
          {/* Category badge */}
          <span 
            className="keyword-title badge rounded-pill px-3 py-2 fw-normal"
            style={{
              ...getCategoryStyle(article.category),
              fontSize: '0.85rem',
              letterSpacing: '0.3px'
            }}
          >
            {article.category}
          </span>
        </div>
      </div>

      {/* Article Content */}
      <div className="article-content">
        <h1 className="article-title mb-3" style={{ 
          fontSize: '2rem',
          fontWeight: '700',
          lineHeight: '1.3',
          color: '#1a1a1a'
        }}>
          {article.title}
        </h1>
        
        <div className="article-meta mb-4">
          <small className="text-muted d-flex align-items-center">
            <svg width="16" height="16" className="me-2" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
            </svg>
            {article.date}
          </small>
        </div>

        <div className="article-summary">
          <p style={{ 
            fontSize: '1.1rem',
            lineHeight: '1.6',
            color: '#4a5568',
            marginBottom: '2rem'
          }}>
            {article.summary}
          </p>
        </div>
      </div>

      {/* Comments Section */}
      <div className="comments-section mt-5 pt-4 border-top">
        <h2 className="h4 mb-4">Comments</h2>
        <div ref={commentsContainerRef} />
      </div>
    </div>
  );
}

export default ArticleDetail;