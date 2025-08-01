const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Enable CORS for frontend to access

const articles = [
  {
    id: 1,
    title: '네이버, AI 및 클라우드 기술 강화',
    imageUrl: 'https://picsum.photos/seed/article1/700/400',
    summary: "Naver Cloud's AI voice recognition service 'Clova Speech' passed the Financial Security Institute's 'Innovative Financial Service CSP Evaluation'.",
    category: 'AI/Cloud',
    date: '2025-07-24'
  },
  {
    id: 2,
    title: '네이버, 크리에이터 수익 창출 확대',
    imageUrl: 'https://picsum.photos/seed/article2/700/400',
    summary: "네이버는 크리에이터 제휴 솔루션 '쇼핑 커넥트'를 정식 출시하여 크리에이터들이 스마트스토어 사업자와 협업하여 상품을 홍보하고 수익을 창출할 수 있도록 지원합니다.",
    category: 'Daily IT News(데아뉴)',
    date: '2025-07-23'
  },
  {
    id: 3,
    title: '네이버, 글로벌 시장 진출 가속화',
    imageUrl: 'https://picsum.photos/seed/article3/700/400',
    summary: "네이버는 북미 시장을 겨냥한 소셜 네트워크 서비스 플랫폼 '싱스북'을 곧 선보일 예정입니다.",
    category: 'Global Business',
    date: '2025-07-22'
  },
  {
    id: 4,
    title: '네이버, 뉴스 서비스 개편',
    imageUrl: 'https://picsum.photos/seed/article4/700/400',
    summary: "네이버는 뉴스제휴위원회 정책위원회를 발족하고 학계, 법조계, 언론계 등 전문가 11인으로 구성하여 뉴스 제휴 및 퇴출 심사 기준을 새롭게 정립할 예정입니다.",
    category: 'News',
    date: '2025-07-21'
  },
  {
    id: 5,
    title: 'AI 에이전트, 금융권 도입 기반 마련',
    imageUrl: 'https://picsum.photos/seed/article5/700/400',
    summary: "네이버클라우드의 AI 음성인식 서비스 '클로바 스피치'가 금융보안원의 '혁신금융서비스 CSP 평가'를 통과했습니다.",
    category: 'AI/Finance',
    date: '2025-07-20'
  },
  {
    id: 6,
    title: '새로운 모바일 결제 시스템 출시',
    imageUrl: 'https://picsum.photos/seed/article6/700/400',
    summary: "혁신적인 모바일 결제 시스템이 출시되어 사용자들에게 더욱 편리하고 안전한 결제 경험을 제공합니다.",
    category: 'Daily IT News(데아뉴)',
    date: '2025-07-28'
  },
  {
    id: 7,
    title: '클라우드 보안, 최신 위협 동향 분석',
    imageUrl: 'https://picsum.photos/seed/article7/700/400',
    summary: "클라우드 환경에서의 보안 위협이 증가함에 따라, 최신 동향을 분석하고 대응 방안을 모색하는 보고서가 발표되었습니다.",
    category: 'AI/Cloud',
    date: '2025-07-27'
  },
  {
    id: 8,
    title: '글로벌 IT 기업, 신흥 시장 투자 확대',
    imageUrl: 'https://picsum.photos/seed/article8/700/400',
    summary: "주요 글로벌 IT 기업들이 아시아 및 아프리카 신흥 시장에 대한 투자를 확대하며 새로운 성장 동력을 찾고 있습니다.",
    category: 'Global Business',
    date: '2025-07-26'
  },
  {
    id: 9,
    title: '인공지능 기반 의료 진단 시스템 개발',
    imageUrl: 'https://picsum.photos/seed/article9/700/400',
    summary: "인공지능 기술을 활용한 새로운 의료 진단 시스템이 개발되어 질병의 조기 발견 및 치료에 기여할 것으로 기대됩니다.",
    category: 'AI/Cloud',
    date: '2025-07-25'
  },
  {
    id: 10,
    title: '차세대 웹 기술, 사용자 경험 혁신',
    imageUrl: 'https://picsum.photos/seed/article10/700/400',
    summary: "웹 기술의 발전이 사용자 경험을 혁신하고 있으며, 더욱 빠르고 인터랙티브한 웹 애플리케이션 개발이 가능해지고 있습니다.",
    category: 'Daily IT News(데아뉴)',
    date: '2025-07-24'
  }
];

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.get('/api/articles', (req, res) => {
  res.json(articles);
});

app.get('/api/articles/:id', (req, res) => {
  console.log(`Received request for article ID: ${req.params.id}`);
  const articleId = parseInt(req.params.id);
  const article = articles.find(a => a.id === articleId);
  if (article) {
    console.log(`Found article: ${article.title}`);
    res.json(article);
  } else {
    console.log(`Article with ID ${articleId} not found.`);
    res.status(404).send('Article not found');
  }
});

module.exports = app;
