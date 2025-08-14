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
  const [imageFile, setImageFile] = useState(null); // 추가: 이미지 파일 상태
  const [imagePreview, setImagePreview] = useState(''); // 추가: 이미지 미리보기

  const categories = [
    'AI/Cloud',
    'Daily IT News(데아뉴)',
    'Global Business', 
    'News',
    'AI/Finance'
  ];

  // 이미지 파일 선택 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // 파일을 읽어서 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setImagePreview(dataUrl);
        setFormData({
          ...formData,
          imageUrl: dataUrl // 임시로 data URL 저장
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 업로드 함수 (실제 서버 구현 필요)
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        return result.imageUrl; // 서버에서 반환한 이미지 URL
      } else {
        throw new Error('이미지 업로드 실패');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      // 업로드 실패 시 data URL 그대로 사용 (임시방편)
      return imagePreview;
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
    } else {
      alert('잘못된 비밀번호입니다.');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('adminAuth') === 'true') {
      setIsAuthenticated(true);
    }

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
    
    let finalImageUrl = formData.imageUrl;
    
    // 파일이 업로드된 경우 서버에 업로드
    if (imageFile) {
      finalImageUrl = await uploadImage(imageFile);
    }
    
    const articleData = {
      ...formData,
      imageUrl: finalImageUrl,
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
        
        const updatedArticles = await fetch('/api/articles').then(res => res.json());
        setArticles(updatedArticles);
        
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
    setImagePreview(article.imageUrl); // 기존 이미지 미리보기 설정
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
    setImageFile(null); // 추가
    setImagePreview(''); // 추가
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
  };

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
                    {/* 이미지 업로드 섹션 수정 */}
                    <div className="mb-3">
                      <label className="form-label">이미지</label>
                      
                      {/* 탭 형식으로 업로드/URL 선택 */}
                      <div className="btn-group w-100 mb-2" role="group">
                        <input type="radio" className="btn-check" name="imageMethod" id="upload" defaultChecked />
                        <label className="btn btn-outline-primary" htmlFor="upload">파일 업로드</label>

                        <input type="radio" className="btn-check" name="imageMethod" id="url" />
                        <label className="btn btn-outline-primary" htmlFor="url">URL 입력</label>
                      </div>
                      
                      {/* 파일 업로드 */}
                      <div className="mb-2">
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </div>
                      
                      {/* URL 입력 (기존) */}
                      <div className="mb-2">
                        <input
                          type="text"
                          className="form-control"
                          name="imageUrl"
                          value={formData.imageUrl}
                          onChange={handleInputChange}
                          placeholder="또는 이미지 URL을 입력하거나 이미지를 복사해서 붙여넣기하세요"
                        />
                      </div>
                      
                      {/* 이미지 미리보기 */}
                      {imagePreview && (
                        <div className="mt-2">
                          <img 
                            src={imagePreview} 
                            alt="미리보기" 
                            className="img-fluid rounded"
                            style={{maxHeight: '200px'}}
                          />
                        </div>
                      )}
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
              <div className="preview-content">
                <h2>{formData.title}</h2>
                <p className="text-muted">키워드: {formData.shortTitle}</p>
                {(imagePreview || formData.imageUrl) && (
                  <img src={imagePreview || formData.imageUrl} className="img-fluid mb-3" alt="Preview" />
                )}
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