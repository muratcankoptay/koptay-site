import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static dosya sunumu - görsellerin görüntülenmesi için
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Paths
const ARTICLES_PATH = path.join(__dirname, 'articles.json');
const PUBLIC_ARTICLES_PATH = path.join(__dirname, 'public', 'articles.json');
const IMAGES_PATH = path.join(__dirname, 'public', 'images', 'articles');

// Ensure images directory exists
if (!fs.existsSync(IMAGES_PATH)) {
  fs.mkdirSync(IMAGES_PATH, { recursive: true });
}

// Dosya adını SEO-friendly slug'a çevir
const slugifyFilename = (filename) => {
  const ext = path.extname(filename);
  const name = path.basename(filename, ext);
  
  // Türkçe karakterleri dönüştür ve slug oluştur
  const slug = name
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  return slug + ext.toLowerCase();
};

// Aynı isimde dosya varsa numara ekle
const getUniqueFilename = (filename) => {
  let finalName = slugifyFilename(filename);
  let counter = 1;
  const ext = path.extname(finalName);
  const baseName = path.basename(finalName, ext);
  
  while (fs.existsSync(path.join(IMAGES_PATH, finalName))) {
    finalName = `${baseName}-${counter}${ext}`;
    counter++;
  }
  
  return finalName;
};

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, IMAGES_PATH);
  },
  filename: (req, file, cb) => {
    // Orijinal dosya adını SEO-friendly şekilde koru
    const seoFilename = getUniqueFilename(file.originalname);
    cb(null, seoFilename);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Sadece resim dosyaları yüklenebilir!'));
  }
});

// Helper function to read articles
const readArticles = () => {
  try {
    const data = fs.readFileSync(ARTICLES_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading articles:', error);
    return { data: [], meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 0 } } };
  }
};

// Helper function to save articles
const saveArticles = (articles) => {
  try {
    const jsonString = JSON.stringify(articles, null, 2);
    fs.writeFileSync(ARTICLES_PATH, jsonString, 'utf8');
    fs.writeFileSync(PUBLIC_ARTICLES_PATH, jsonString, 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving articles:', error);
    return false;
  }
};

// API Routes

// Get all articles
app.get('/api/articles', (req, res) => {
  const articles = readArticles();
  res.json(articles);
});

// Get single article by id
app.get('/api/articles/:id', (req, res) => {
  const articles = readArticles();
  const article = articles.data.find(a => a.id === parseInt(req.params.id));
  if (article) {
    res.json(article);
  } else {
    res.status(404).json({ error: 'Makale bulunamadı' });
  }
});

// Create new article
app.post('/api/articles', (req, res) => {
  const articles = readArticles();
  const newId = Math.max(...articles.data.map(a => a.id), 0) + 1;
  const now = new Date().toISOString();
  
  // Kullanıcının girdiği yayın tarihi veya bugün
  const publishDate = req.body.publishedat || now.split('T')[0];
  const publishDateTime = new Date(publishDate).toISOString();
  
  const newArticle = {
    id: newId,
    documentId: req.body.slug || `article-${newId}`,
    slug: req.body.slug,
    title: req.body.title,
    excerpt: req.body.excerpt,
    content: req.body.content,
    category: req.body.category,
    author: req.body.author || 'Av. Murat Can Koptay',
    createdAt: publishDateTime, // Yayın tarihini oluşturma tarihi olarak kullan
    updatedAt: now,
    publishedAt: publishDateTime,
    seoTitle: req.body.seoTitle,
    seoDescription: req.body.seoDescription,
    keywords: req.body.keywords,
    readTime: req.body.readTime || '5 dk',
    publishedat: publishDate, // YYYY-MM-DD formatında
    image: req.body.image || null
  };
  
  articles.data.unshift(newArticle);
  articles.meta.pagination.total = articles.data.length;
  
  if (saveArticles(articles)) {
    res.status(201).json(newArticle);
  } else {
    res.status(500).json({ error: 'Makale kaydedilemedi' });
  }
});

// Update article
app.put('/api/articles/:id', (req, res) => {
  const articles = readArticles();
  const index = articles.data.findIndex(a => a.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Makale bulunamadı' });
  }
  
  const updatedArticle = {
    ...articles.data[index],
    ...req.body,
    id: parseInt(req.params.id),
    updatedAt: new Date().toISOString()
  };
  
  articles.data[index] = updatedArticle;
  
  if (saveArticles(articles)) {
    res.json(updatedArticle);
  } else {
    res.status(500).json({ error: 'Makale güncellenemedi' });
  }
});

// Delete article
app.delete('/api/articles/:id', (req, res) => {
  const articles = readArticles();
  const index = articles.data.findIndex(a => a.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Makale bulunamadı' });
  }
  
  articles.data.splice(index, 1);
  articles.meta.pagination.total = articles.data.length;
  
  if (saveArticles(articles)) {
    res.json({ message: 'Makale silindi' });
  } else {
    res.status(500).json({ error: 'Makale silinemedi' });
  }
});

// Upload image
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Dosya yüklenemedi' });
  }
  
  const imageUrl = `/images/articles/${req.file.filename}`;
  res.json({ 
    url: imageUrl,
    filename: req.file.filename,
    message: 'Görsel başarıyla yüklendi'
  });
});

// Get list of uploaded images
app.get('/api/images', (req, res) => {
  try {
    const files = fs.readdirSync(IMAGES_PATH);
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => ({
        filename: file,
        url: `/images/articles/${file}`
      }));
    res.json(images);
  } catch (error) {
    res.json([]);
  }
});

// Delete image
app.delete('/api/images/:filename', (req, res) => {
  const filePath = path.join(IMAGES_PATH, req.params.filename);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'Görsel silindi' });
    } else {
      res.status(404).json({ error: 'Görsel bulunamadı' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Görsel silinemedi' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🎉 Koptay Hukuk Admin API Sunucusu Çalışıyor!           ║
║                                                            ║
║   📍 API Adresi: http://localhost:${PORT}                   ║
║   📁 Görseller:  public/images/articles/                   ║
║                                                            ║
║   Bu pencereyi kapatmayın!                                 ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});
