require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

function assignCategories(title) {
  const lowerTitle = title.toLowerCase();
  const categories = [];

  if (lowerTitle.includes('wood') || lowerTitle.includes('polish') || lowerTitle.includes('pu') || lowerTitle.includes('melamine')) {
    categories.push('Wood Services', 'Wood Polishing');
  }
  if (lowerTitle.includes('texture') || lowerTitle.includes('stucco') || lowerTitle.includes('oikos')) {
    categories.push('Texture Painting');
  }
  if (lowerTitle.includes('graffiti') || lowerTitle.includes('stencil') || lowerTitle.includes('wallpaper')) {
    categories.push('Wall Decor');
  }
  if (lowerTitle.includes('exterior')) {
    categories.push('Exterior Painting');
  }
  if (lowerTitle.includes('interior') || lowerTitle.includes('living room') || lowerTitle.includes('bedroom') || lowerTitle.includes('kitchen')) {
    categories.push('Interior Painting');
  }
  if (lowerTitle.includes('asian paint')) {
    categories.push('Paint Brands', 'Asian Paints');
  }
  if (categories.length === 0) {
    categories.push('Paint Tips');
  }
  return [...new Set(categories)];
}

function estimateReadTime(title) {
  return "5";
}

function generateDate(index, totalArticles) {
  const baseDate = new Date('2025-11-01');
  const daysToSubtract = Math.floor((index / totalArticles) * 365 * 2);
  const date = new Date(baseDate);
  date.setDate(date.getDate() - daysToSubtract);
  return date;
}

async function main() {
  const jsonPath = path.join(__dirname, '../public/uploads/blogs/blog-articles.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ JSON file not found:', jsonPath);
    process.exit(1);
  }

  const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const articles = jsonData.articles;

  console.log(`🚀 Populating ${articles.length} blogs into MongoDB Atlas...`);

  let imported = 0;
  let skipped = 0;

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];

    const existing = await prisma.blogPost.findUnique({
      where: { slug: article.slug }
    });

    if (existing) {
      skipped++;
      continue;
    }

    const categories = assignCategories(article.title);
    const publishedAt = generateDate(i, articles.length);
    const excerpt = `${article.title}. Complete professional guide and insights by Home Glazer expert painting team.`;
    const dummyContent = `<p>${article.title}</p><p>When it comes to home painting and wooden polishing, choosing the right products and techniques makes all the difference. Home Glazer brings you expert guidance on ${article.title}.</p><p>Contact Home Glazer today for professional painting and wood polishing services tailored to your needs.</p>`;

    await prisma.blogPost.create({
      data: {
        slug: article.slug,
        title: article.title,
        excerpt: excerpt,
        content: dummyContent,
        coverImage: article.thumbnail || '/uploads/blogs/default.jpg',
        author: 'Home Glazer Team',
        readTime: estimateReadTime(article.title),
        categories: categories,
        published: true,
        publishedAt: publishedAt,
      }
    });

    imported++;
  }

  console.log('=' .repeat(50));
  console.log(`✅ Finished blog import!`);
  console.log(`   Imported: ${imported}`);
  console.log(`   Skipped (already exists): ${skipped}`);
  console.log('=' .repeat(50));
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
