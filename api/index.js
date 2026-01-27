try {
  require('dotenv').config();
} catch (error) {
  if (error && error.code !== 'MODULE_NOT_FOUND') {
    throw error;
  }
}
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Article = require('./models/Article'); // Article 모델 불러오기
const Counter = require('./models/Counter');

const app = express();

app.use(cors());
app.use(express.json()); // JSON 파싱을 위해 추가

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected successfully');
    await ensureArticleIds();
  })
  .catch(err => console.error('MongoDB connection error:', err));

const getNextArticleId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'articleId' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};

const ensureArticleIds = async () => {
  const missing = await Article.find({ articleId: { $exists: false } }).sort({ createdAt: 1 });
  if (!missing.length) return;

  for (const doc of missing) {
    const nextId = await getNextArticleId();
    doc.articleId = nextId;
    await doc.save();
  }
};

// 기존의 아티클 데이터는 삭제합니다. 이제 데이터베이스를 사용합니다.

app.get('/', (req, res) => {
  res.send('Hello from the backend! MongoDB connected. Now using database for articles.');
});

// 모든 아티클 가져오기
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 }); // 최신순 정렬
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 특정 아티클 가져오기
app.get('/api/articles/:id', async (req, res) => {
  try {
    const articleId = Number(req.params.id);
    const article = Number.isNaN(articleId)
      ? await Article.findById(req.params.id)
      : await Article.findOne({ articleId });
    if (article) {
      res.json(article);
    } else {
      res.status(404).send('Article not found');
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 새 아티클 생성
app.post('/api/articles', async (req, res) => {
  const newArticle = new Article({
    articleId: await getNextArticleId(),
    title: req.body.title,
    shortTitle: req.body.shortTitle,
    imageUrl: req.body.imageUrl,
    images: req.body.images || [],
    summary: req.body.summary,
    category: req.body.category,
    date: req.body.date,
    content: req.body.content, // 새롭게 추가된 content 필드
  });

  try {
    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 아티클 수정
app.put('/api/articles/:id', async (req, res) => {
  try {
    const articleId = Number(req.params.id);
    const updatedArticle = Number.isNaN(articleId)
      ? await Article.findByIdAndUpdate(req.params.id, req.body, { new: true })
      : await Article.findOneAndUpdate({ articleId }, req.body, { new: true });
    if (updatedArticle) {
      res.json(updatedArticle);
    } else {
      res.status(404).send('Article not found');
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 아티클 삭제
app.delete('/api/articles/:id', async (req, res) => {
  try {
    const articleId = Number(req.params.id);
    const deletedArticle = Number.isNaN(articleId)
      ? await Article.findByIdAndDelete(req.params.id)
      : await Article.findOneAndDelete({ articleId });
    if (deletedArticle) {
      res.json({ message: 'Article deleted', article: deletedArticle });
    } else {
      res.status(404).send('Article not found');
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 검색 API
app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.json([]);
  }

  try {
    const searchTerm = new RegExp(query, 'i'); // 대소문자 구분 없이 검색
    const filteredArticles = await Article.find({
      $or: [
        { title: { $regex: searchTerm } },
        { shortTitle: { $regex: searchTerm } },
        { summary: { $regex: searchTerm } },
        { category: { $regex: searchTerm } },
        { content: { $regex: searchTerm } }, // content 필드도 검색에 포함
      ],
    }).sort({ createdAt: -1 });

    res.json(filteredArticles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = app;
