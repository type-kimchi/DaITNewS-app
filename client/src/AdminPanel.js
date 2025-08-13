import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AdminPanel() {
  const [articles, setArticles] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [editingArticle, setEditingArticle] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    shortTitle: '',
    imageUrl: '',
    summary: '',
    category: 'Daily IT News(데아뉴)',
    date: new Date().toISOString().split('T')[0]
  });
  const [previewMode, setPreviewMode] = useState(false);

  const categories = [
    'AI/Cloud',
    'Daily IT News(데아뉴)',
    'Global Business', 
    'News',
    'AI/Finance'
  ];

  // 간단한 인증 (실제 프로덕션에서는 더 안전한 방법 사용)
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') { // 원하는 비밀번호로 변경하세요
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
    } else {
      alert('잘못된 비밀번호입니다.');
    }
  };

  useEffect(() => {
    // 로그인 상태 확인
    if (localStorage.getItem('adminAuth') === 'true') {
      setIsAuthenticated(true);
    }

    // 아티클 목록 가져오기
    if (isAuthenticated) {
      fetch('/api/articles')
        .then(res => res.json())
        .then(data => setArticles(data))
        .catch(err => console.error(err));
    }
  }, [isAuthenticated]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const articleData = {
      ...formData,
      id: editingArticle ? editingArticle.id : Date.now()
    };

    try {
      const url = editingArticle 
        ? `/api/articles/${editingArticle.id}` 
        : '/api/articles';
      
      const method = editingArticle ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      });

      if (response.ok) {
        alert(editingArticle ? '글이 수정되었습니다!' : '새 글이 작성되었습니다!');
        
        // 목록 새로고침
        const updatedArticles = await fetch('/api/articles').then(res => res.json());
        setArticles(updatedArticles);
        
        // 폼 초기화
        resetForm();
      } else {
        alert('저장 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      shortTitle: article.shortTitle || '',
      imageUrl: article.imageUrl,
      summary: article.summary,
      category: article.category,
      date: article.date
    });
    setShowEditor(true);
  };

  const handleDelete = async (articleId) => {
    if (window.confirm('정말로 이 글을 삭제하시겠습니까?')) {
      try {
        const response = await fetch(`/api/articles/${articleId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('글이 삭제되었습니다.');
          const updatedArticles = await fetch('/api/articles').then(res => res.json());
          setArticles(updatedArticles);
        } else {
          alert('삭제 중 오류가 발생했습니다.');
        }
      } catch (error) {
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      shortTitle: '',
      imageUrl: '',
      summary: '',
      category: 'Daily IT News(데아뉴)',
      date: new Date().toISOString().split('T')[0]
    });
    setEditingArticle(null);
    setShowEditor(false);
    setPreviewMode(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
  };

  // 로그인 화면
  if (!isAuthenticated) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-center mb-4">관리자 로그인</h2>
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label">비밀번호</label>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    로그인
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>관리자 페이지</h1>
        <div>
          <Link to="/" className="btn btn-outline-secondary me-2">
            홈으로
          </Link>
          <button 
            className="btn btn-success me-2"
            onClick={() => setShowEditor(true)}
          >
            새 글 작성
          </button>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </div>

      {/* 글 작성/수정 에디터 */}
      {showEditor && (
        <div className="card mb-4">
          <div className="card-header">
            <h3>{editingArticle ? '글 수정' : '새 글 작성'}</h3>
            <div className="btn-group">
              <button 
                className={`btn btn-sm ${!previewMode ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setPreviewMode(false)}
              >
                편집
              </button>
              <button 
                className={`btn btn-sm ${previewMode ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setPreviewMode(true)}
              >
                미리보기
              </button>
            </div>
          </div>
          <div className="card-body">
            {!previewMode ? (
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-8">
                    <div className="mb-3">
                      <label className="form-label">제목 *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">키워드 제목 (썸네일 하단에 표시) *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="shortTitle"
                        value={formData.shortTitle}
                        onChange={handleInputChange}
                        placeholder="예: AI 기술로 혁신적인 서비스 출시 🚀"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">내용 (마크다운 지원) *</label>
                      <textarea
                        className="form-control"
                        name="summary"
                        rows="10"
                        value={formData.summary}
                        onChange={handleInputChange}
                        placeholder="마크다운 문법을 사용하여 작성하세요..."
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">이미지 URL *</label>
                      <input
                        type="url"
                        className="form-control"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">카테고리 *</label>
                      <select
                        className="form-control"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">날짜 *</label>
                      <input
                        type="date"
                        className="form-control"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <button type="submit" className="btn btn-primary me-2">
                    {editingArticle ? '수정하기' : '저장하기'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    취소
                  </button>
                </div>
              </form>
            ) : (
              // 미리보기
              <div className="preview-content">
                <h2>{formData.title}</h2>
                <p className="text-muted">키워드: {formData.shortTitle}</p>
                <img src={formData.imageUrl} className="img-fluid mb-3" alt="Preview" />
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {formData.summary}
                </div>
                <p className="text-muted mt-3">{formData.category} - {formData.date}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 아티클 목록 */}
      <div className="card">
        <div className="card-header">
          <h3>글 목록 ({articles.length}개)</h3>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>제목</th>
                  <th>키워드</th>
                  <th>카테고리</th>
                  <th>날짜</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {articles.map(article => (
                  <tr key={article.id}>
                    <td>{article.id}</td>
                    <td>
                      <Link to={`/article/${article.id}`} target="_blank">
                        {article.title}
                      </Link>
                    </td>
                    <td className="text-muted small">
                      {article.shortTitle || '없음'}
                    </td>
                    <td>
                      <span className="badge bg-primary">{article.category}</span>
                    </td>
                    <td>{article.date}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => handleEdit(article)}
                      >
                        수정
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(article.id)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;