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

  if (!article) {
    return <div>Loading article...</div>;
  }

  console.log('Article data for rendering:', article);
  console.log('Article title:', article.title);

  const plainDescription = (article.summary || article.content || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const hasRichContent = Boolean(article.content);

  return (
    <div className="container mt-4">
      <Helmet>
        <title>{article.title} | DaITNewS</title>
        <meta name="description" content={plainDescription} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={plainDescription} />
        <meta property="og:image" content={article.imageUrl} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="article" />
      </Helmet>
      
      <h1>{article.title}</h1>
      {hasRichContent ? (
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      ) : (
        <>
          {(article.images && article.images.length > 0) ? (
            <div className="article-gallery mb-3">
              {article.images.map((url, index) => (
                <img key={url + index} src={url} className="img-fluid mb-2" alt={`${article.title} ${index + 1}`} />
              ))}
            </div>
          ) : (
            article.imageUrl && <img src={article.imageUrl} className="img-fluid mb-3" alt={article.title} />
          )}
          <p>{article.summary}</p>
        </>
      )}
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
