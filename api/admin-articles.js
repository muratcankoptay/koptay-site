// Web Admin Panel - Makale CRUD (Vercel API Route)
// GitHub API üzerinden articles.json dosyasını günceller
// Vercel Environment Variables gerekli:
// - ADMIN_SECRET: JWT doğrulama anahtarı
// - GITHUB_TOKEN: GitHub Personal Access Token (repo yetkili)
// - GITHUB_REPO: Repo adı (ör: "kullanici/koptay-site")
// - GITHUB_BRANCH: Branch adı (varsayılan: "main")

import crypto from 'crypto';

// JWT doğrulama
function verifyToken(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

// Auth middleware
function authenticate(req) {
  const ADMIN_SECRET = process.env.ADMIN_SECRET;
  if (!ADMIN_SECRET) return null;

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  return verifyToken(authHeader.replace('Bearer ', ''), ADMIN_SECRET);
}

// GitHub API helper
async function githubAPI(endpoint, options = {}) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const response = await fetch(`https://api.github.com${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...options.headers
    }
  });
  return response;
}

// articles.json'u GitHub'dan oku
async function getArticlesFromGitHub() {
  const GITHUB_REPO = process.env.GITHUB_REPO;
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

  const response = await githubAPI(`/repos/${GITHUB_REPO}/contents/articles.json?ref=${GITHUB_BRANCH}`);
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const data = await response.json();
  const content = Buffer.from(data.content, 'base64').toString('utf8');
  return { articles: JSON.parse(content), sha: data.sha };
}

// articles.json'u GitHub'a yaz (+ public/articles.json)
async function saveArticlesToGitHub(articles, sha, commitMessage) {
  const GITHUB_REPO = process.env.GITHUB_REPO;
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

  const content = Buffer.from(JSON.stringify(articles, null, 2)).toString('base64');

  // Ana articles.json'u güncelle
  const response = await githubAPI(`/repos/${GITHUB_REPO}/contents/articles.json`, {
    method: 'PUT',
    body: JSON.stringify({
      message: commitMessage,
      content: content,
      sha: sha,
      branch: GITHUB_BRANCH
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`GitHub save error: ${JSON.stringify(errorData)}`);
  }

  // public/articles.json'u da güncelle
  try {
    const publicResponse = await githubAPI(`/repos/${GITHUB_REPO}/contents/public/articles.json?ref=${GITHUB_BRANCH}`);
    if (publicResponse.ok) {
      const publicData = await publicResponse.json();
      await githubAPI(`/repos/${GITHUB_REPO}/contents/public/articles.json`, {
        method: 'PUT',
        body: JSON.stringify({
          message: `[sync] ${commitMessage}`,
          content: content,
          sha: publicData.sha,
          branch: GITHUB_BRANCH
        })
      });
    }
  } catch (err) {
    console.warn('public/articles.json sync warning:', err.message);
  }

  return await response.json();
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_REPO = process.env.GITHUB_REPO;

  // GET: Makaleleri oku (auth gerekmez - public veri)
  if (req.method === 'GET') {
    try {
      if (GITHUB_TOKEN && GITHUB_REPO) {
        const { articles } = await getArticlesFromGitHub();
        return res.status(200).json(articles);
      }

      // Yoksa public URL'den oku
      const siteUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';
      if (siteUrl) {
        const response = await fetch(`${siteUrl}/articles.json`);
        const data = await response.json();
        return res.status(200).json(data);
      }

      return res.status(503).json({ error: 'Makale kaynağı yapılandırılmamış' });
    } catch (error) {
      console.error('Read error:', error);
      return res.status(500).json({ error: 'Makaleler okunamadı: ' + error.message });
    }
  }

  // Yazma işlemleri için auth gerekli
  const user = authenticate(req);
  if (!user) {
    return res.status(401).json({ error: 'Yetkilendirme gerekli' });
  }

  // GitHub token kontrolü
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    return res.status(503).json({
      error: 'Yazma işlemleri için GITHUB_TOKEN ve GITHUB_REPO ortam değişkenleri gerekli',
      setup: true
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { id } = req.query;

    // POST: Yeni makale oluştur
    if (req.method === 'POST') {
      const { articles, sha } = await getArticlesFromGitHub();
      const newId = Math.max(...articles.data.map(a => a.id), 0) + 1;
      const now = new Date().toISOString();
      const publishDate = body.publishedat || now.split('T')[0];
      const publishDateTime = new Date(publishDate).toISOString();

      const newArticle = {
        id: newId,
        documentId: body.slug || `article-${newId}`,
        slug: body.slug,
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        category: body.category,
        author: body.author || 'Av. Murat Can Koptay',
        createdAt: publishDateTime,
        updatedAt: now,
        publishedAt: publishDateTime,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
        keywords: body.keywords,
        readTime: body.readTime || '5 dk',
        publishedat: publishDate,
        image: body.image || null,
        focusKeyword: body.focusKeyword || '',
        ogTitle: body.ogTitle || '',
        ogDescription: body.ogDescription || '',
        ogImage: body.ogImage || '',
        canonicalUrl: body.canonicalUrl || '',
        schemaType: body.schemaType || 'Article',
        faqItems: body.faqItems || [],
        noIndex: body.noIndex || false,
        noFollow: body.noFollow || false
      };

      articles.data.unshift(newArticle);
      articles.meta.pagination.total = articles.data.length;

      await saveArticlesToGitHub(articles, sha, `[web-admin] Yeni makale: ${body.title}`);

      return res.status(201).json(newArticle);
    }

    // PUT: Makale güncelle
    if (req.method === 'PUT') {
      const articleId = parseInt(id);
      if (!articleId) {
        return res.status(400).json({ error: 'Makale ID gerekli' });
      }

      const { articles, sha } = await getArticlesFromGitHub();
      const index = articles.data.findIndex(a => a.id === articleId);

      if (index === -1) {
        return res.status(404).json({ error: 'Makale bulunamadı' });
      }

      articles.data[index] = {
        ...articles.data[index],
        ...body,
        id: articleId,
        updatedAt: new Date().toISOString()
      };

      await saveArticlesToGitHub(articles, sha, `[web-admin] Güncellendi: ${articles.data[index].title}`);

      return res.status(200).json(articles.data[index]);
    }

    // DELETE: Makale sil
    if (req.method === 'DELETE') {
      const articleId = parseInt(id);
      if (!articleId) {
        return res.status(400).json({ error: 'Makale ID gerekli' });
      }

      const { articles, sha } = await getArticlesFromGitHub();
      const article = articles.data.find(a => a.id === articleId);

      if (!article) {
        return res.status(404).json({ error: 'Makale bulunamadı' });
      }

      articles.data = articles.data.filter(a => a.id !== articleId);
      articles.meta.pagination.total = articles.data.length;

      await saveArticlesToGitHub(articles, sha, `[web-admin] Silindi: ${article.title}`);

      return res.status(200).json({ success: true, message: 'Makale silindi' });
    }

    return res.status(405).json({ error: 'Desteklenmeyen metod' });

  } catch (error) {
    console.error('Article operation error:', error);
    return res.status(500).json({ error: 'İşlem hatası: ' + error.message });
  }
}
