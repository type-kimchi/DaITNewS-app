import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { uploadToCloudinary } from './utils/cloudinary'; // 위에서 만든 함수

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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageMethod, setImageMethod] = useState('upload');
  const [pasteAreaActive, setPasteAreaActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // 업로드 상태

  const pasteAreaRef = useRef(null);

  const categories = [
    'AI/Cloud',
    'Daily IT News(데아뉴)',
    'Global Business', 
    'News',
    'AI/Finance'
  ];

  // 클립보드 붙여넣기 이벤트 핸들러
  const handlePaste = useCallback((e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = item.getAsFile();
        
        if (file) {
          setImageFile(file);
          
          const reader = new FileReader();
          reader.onload = (e) => {
            const dataUrl = e.target.result;
            setImagePreview(dataUrl);
            setFormData(prevFormData => ({
              ...prevFormData,
              imageUrl: dataUrl
            }));
          };
          reader.readAsDataURL(file);
          
          setPasteAreaActive(false);
          alert('이미지가 붙여넣기되었습니다! 저장 시 Cloudinary에 업로드됩니다.');
        }
        break;
      }
    }
  }, []);

  // 드래그 앤 드롭 핸들러들
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setPasteAreaActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setPasteAreaActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setPasteAreaActive(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      
      if (file.type.startsWith('image/')) {
        setImageFile(file);
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target.result;
          setImagePreview(dataUrl);
          setFormData(prevFormData => ({
            ...prevFormData,
            imageUrl: dataUrl
          }));
        };
        reader.readAsDataURL(file);
        
        alert('이미지가 업로드되었습니다! 저장 시 Cloudinary에 업로드됩니다.');
      } else {
        alert('이미지 파일만 업로드할 수 있습니다.');
      }
    }
  }, []);

  useEffect(() => {
    const handleGlobalPaste = (e) => {
      if (showEditor && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        handlePaste(e);
      }
    };

    document.addEventListener('paste', handleGlobalPaste);
    return () => {
      document.removeEventListener('paste', handleGlobalPaste);
    };
  }, [showEditor, handlePaste]);

  // 이미지 파일 선택 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setImagePreview(dataUrl);
        setFormData(prevFormData => ({
          ...prevFormData,
          imageUrl: dataUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Cloudinary 업로드 함수
  const uploadImageToCloudinary = async (file) => {
    if (!file) return null;
    
    setIsUploading(true);
    
    try {
      const result = await uploadToCloudinary(file);
      
      if (result.success) {
        console.log('Cloudinary 업로드 성공:', result.url);
        return result.url;
      } else {
        throw new Error(result.error || '업로드에 실패했습니다');
      }
    } catch (error) {
      console.error('Cloudinary 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다: ' + error.message);
      return null; // imagePreview 대신 null 반환
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('adminAuth') === 'true') {
      setIsAuthenticated(true);
    }

    if (isAuthenticated) {
      // 로컬스토리지에서 글 목록 불러오기 (임시)
      const savedArticles = JSON.parse(localStorage.getItem('articles') || '[]');
      setArticles(savedArticles);
    }
  }, [isAuthenticated]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '1Q2w3e4r!') { // 실제 비밀번호로 변경
      localStorage.setItem('adminAuth', 'true');
      setIsAuthenticated(true);
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
    setPassword('');
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let finalImageUrl = formData.imageUrl;
    
    // 파일이 있으면 Cloudinary에 업로드
    if (imageFile) {
      const uploadedUrl = await uploadImageToCloudinary(imageFile);
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
      }
    }
    
    const articleData = {
      ...formData,
      imageUrl: finalImageUrl,
      id: editingArticle ? editingArticle.id : Date.now()
    };

    // 현재는 로컬스토리지에 임시 저장 (나중에 Firebase로 교체)
    try {
      const existingArticles = JSON.parse(localStorage.getItem('articles') || '[]');
      
      if (editingArticle) {
        const index = existingArticles.findIndex(a => a.id === editingArticle.id);
        if (index !== -1) {
          existingArticles[index] = articleData;
        }
      } else {
        existingArticles.push(articleData);
      }
      
      localStorage.setItem('articles', JSON.stringify(existingArticles));
      setArticles(existingArticles);
      
      alert(editingArticle ? '글이 수정되었습니다!' : '새 글이 작성되었습니다!');
      resetForm();
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
    setImagePreview(article.imageUrl);
    setShowEditor(true);
  };

  const handleDelete = async (articleId) => {
    if (window.confirm('정말로 이 글을 삭제하시겠습니까?')) {
      try {
        const existingArticles = JSON.parse(localStorage.getItem('articles') || '[]');
        const filteredArticles = existingArticles.filter(article => article.id !== articleId);
        
        localStorage.setItem('articles', JSON.stringify(filteredArticles));
        setArticles(filteredArticles);
        
        alert('글이 삭제되었습니다.');
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
    setImageFile(null);
    setImagePreview('');
    setImageMethod('upload');
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
                      <label className="form-label">키워드 제목 *</label>
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
                      <label className="form-label">
                        이미지 추가
                        {isUploading && <span className="text-primary ms-2">업로드 중...</span>}
                      </label>
                      
                      <div className="btn-group w-100 mb-3" role="group">
                        <input 
                          type="radio" 
                          className="btn-check" 
                          name="imageMethodRadio" 
                          id="uploadMethod" 
                          checked={imageMethod === 'upload'}
                          onChange={() => setImageMethod('upload')}
                        />
                        <label className="btn btn-outline-primary" htmlFor="uploadMethod">파일 선택</label>

                        <input 
                          type="radio" 
                          className="btn-check" 
                          name="imageMethodRadio" 
                          id="pasteMethod" 
                          checked={imageMethod === 'paste'}
                          onChange={() => setImageMethod('paste')}
                        />
                        <label className="btn btn-outline-success" htmlFor="pasteMethod">붙여넣기</label>

                        <input 
                          type="radio" 
                          className="btn-check" 
                          name="imageMethodRadio" 
                          id="urlMethod" 
                          checked={imageMethod === 'url'}
                          onChange={() => setImageMethod('url')}
                        />
                        <label className="btn btn-outline-info" htmlFor="urlMethod">URL</label>
                      </div>
                      
                      {imageMethod === 'upload' && (
                        <div className="mb-2">
                          <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                          <small className="form-text text-success">
                            💡 선택한 이미지는 Cloudinary에 자동 업로드됩니다
                          </small>
                        </div>
                      )}
                      
                      {imageMethod === 'paste' && (
                        <div 
                          ref={pasteAreaRef}
                          className={`border rounded p-4 text-center ${pasteAreaActive ? 'border-success bg-light' : 'border-dashed'}`}
                          style={{ 
                            minHeight: '120px', 
                            borderStyle: pasteAreaActive ? 'solid' : 'dashed',
                            cursor: 'pointer'
                          }}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => pasteAreaRef.current?.focus()}
                          tabIndex={0}
                        >
                          <div className="text-muted">
                            {pasteAreaActive ? (
                              <>
                                <i className="bi bi-download mb-2" style={{ fontSize: '2rem' }}></i>
                                <br />
                                <strong>이미지를 놓으세요!</strong>
                              </>
                            ) : (
                              <>
                                <i className="bi bi-clipboard mb-2" style={{ fontSize: '2rem' }}></i>
                                <br />
                                <strong>Ctrl+V로 이미지 붙여넣기</strong>
                                <br />
                                <small>Cloudinary에 자동 업로드됩니다 ☁️</small>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {imageMethod === 'url' && (
                        <div className="mb-2">
                          <input
                            type="url"
                            className="form-control"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleInputChange}
                            placeholder="https://example.com/image.jpg"
                          />
                          <small className="form-text text-muted">
                            외부 이미지 URL을 직접 입력
                          </small>
                        </div>
                      )}
                      
                      {imagePreview && (
                        <div className="mt-3">
                          <label className="form-label">미리보기</label>
                          <div className="position-relative">
                            <img 
                              src={imagePreview} 
                              alt="미리보기" 
                              className="img-fluid rounded border"
                              style={{maxHeight: '200px', width: '100%', objectFit: 'cover'}}
                            />
                            <button 
                              type="button"
                              className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                              onClick={() => {
                                setImagePreview('');
                                setImageFile(null);
                                setFormData({...formData, imageUrl: ''});
                              }}
                              title="이미지 제거"
                            >
                              ×
                            </button>
                          </div>
                          {imageFile && (
                            <small className="text-success d-block mt-1">
                              ☁️ 저장 시 Cloudinary에 업로드됩니다
                            </small>
                          )}
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
                  <button 
                    type="submit" 
                    className="btn btn-primary me-2"
                    disabled={isUploading}
                  >
                    {isUploading ? '업로드 중...' : (editingArticle ? '수정하기' : '저장하기')}
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