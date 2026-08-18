import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/lib/middleware';
import formidable from 'formidable';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function saveLocally(folder: string, filename: string, buffer: Buffer): Promise<string> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const filePath = path.join(uploadDir, filename);
  fs.writeFileSync(filePath, buffer);
  return `/uploads/${folder}/${filename}`;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);

    const type = Array.isArray(fields.type) ? fields.type[0] : fields.type;
    const uploadedFile = Array.isArray(files.image) ? files.image[0] : files.image;

    if (
      !type ||
      (type !== 'brand' && type !== 'product' && type !== 'document' && type !== 'blog')
    ) {
      return res
        .status(400)
        .json({ error: 'Invalid type. Must be "brand", "product", "blog", or "document"' });
    }

    if (!uploadedFile) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const isPdf = uploadedFile.mimetype === 'application/pdf';

    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!uploadedFile.mimetype || !allowedMimeTypes.includes(uploadedFile.mimetype)) {
      return res.status(400).json({
        error: 'Invalid file type. Only JPEG, PNG, WebP, and PDF are allowed.',
      });
    }

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = path.extname(uploadedFile.originalFilename || (isPdf ? '.pdf' : 'image.jpg'));
    const filename = `${timestamp}-${randomString}${extension}`;

    const folder =
      type === 'brand' ? 'brands' : type === 'document' ? 'documents' : type === 'blog' ? 'blogs' : 'products';

    let url: string;

    if (isPdf) {
      const buffer = fs.readFileSync(uploadedFile.filepath);
      url = await saveLocally(folder, filename, buffer);
      fs.unlinkSync(uploadedFile.filepath);

      return res.status(200).json({
        success: true,
        url,
        filename,
      });
    }

    const buffer = await sharp(uploadedFile.filepath)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toBuffer();

    fs.unlinkSync(uploadedFile.filepath);

    const webpFilename = filename.replace(extension, '.webp');
    url = await saveLocally(folder, webpFilename, buffer);

    return res.status(200).json({
      success: true,
      url,
      filename: webpFilename,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum 10MB allowed.' });
    }
    if (error.message?.includes('unsupported image format') || error.code === 'ERR_UNSUPPORTED') {
      return res.status(400).json({ error: 'Unsupported image format. Use JPEG, PNG, or WebP.' });
    }
    const msg = error?.message || 'Internal server error';
    return res.status(500).json({ error: msg });
  }
}

export default requireAuth(handler);
