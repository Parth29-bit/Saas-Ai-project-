import { Request, Response, NextFunction } from 'express';
import { KnowledgeBaseArticle } from '../models/KnowledgeBaseArticle';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const getArticles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, search, publishedOnly = 'true' } = req.query;
    const filter: any = {};

    if (publishedOnly === 'true') {
      filter.isPublished = true;
    }

    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const articles = await KnowledgeBaseArticle.find(filter)
      .populate('authorId', 'name avatar')
      .sort({ views: -1, createdAt: -1 });

    const categories = await KnowledgeBaseArticle.distinct('category');

    res.status(200).json({
      success: true,
      count: articles.length,
      categories,
      articles,
    });
  } catch (error) {
    next(error);
  }
};

export const getArticleBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;
    const article = await KnowledgeBaseArticle.findOne({ slug }).populate('authorId', 'name avatar');

    if (!article) {
      throw new AppError('Knowledge Base article not found', 404);
    }

    // Increment views
    article.views += 1;
    await article.save();

    res.status(200).json({
      success: true,
      article,
    });
  } catch (error) {
    next(error);
  }
};

export const createArticle = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, content, category, tags, isPublished } = req.body;

    if (!title || !content) {
      throw new AppError('Title and content are required', 400);
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const article = await KnowledgeBaseArticle.create({
      title,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      content,
      category: category || 'General',
      tags: tags || [],
      isPublished: isPublished !== undefined ? isPublished : true,
      authorId: req.user?._id,
      organizationId: req.user?.organizationId,
    });

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      article,
    });
  } catch (error) {
    next(error);
  }
};

export const updateArticle = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content, category, tags, isPublished } = req.body;

    const article = await KnowledgeBaseArticle.findById(id);
    if (!article) throw new AppError('Article not found', 404);

    if (title) {
      article.title = title;
      article.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (content) article.content = content;
    if (category) article.category = category;
    if (tags) article.tags = tags;
    if (isPublished !== undefined) article.isPublished = isPublished;

    await article.save();

    res.status(200).json({
      success: true,
      message: 'Article updated successfully',
      article,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteArticle = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await KnowledgeBaseArticle.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Article deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
