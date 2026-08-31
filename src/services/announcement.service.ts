import { repositories } from '../repositories';
import { ApiError } from '../utils/api-error.util';
import { createChildLogger } from '../config/logger.config';

const logger = createChildLogger('AnnouncementService');

interface CreateAnnouncementInput {
  title: string;
  content: string;
  type?: string;
  priority?: string;
  targetAudience?: string;
  targetClassId?: string;
  expiresAt?: string;
  isImportant?: boolean;
}

export class AnnouncementService {
  async create(input: CreateAnnouncementInput, publishedBy: string) {
    const announcement = await repositories.announcement.create({
      ...input,
      publishedBy,
      isPublished: false,
    });

    logger.info({ announcementId: announcement.id }, 'Announcement created');
    return announcement;
  }

  async publish(id: string, publishedBy: string) {
    const announcement = await repositories.announcement.findById(id);
    if (!announcement) {
      throw ApiError.notFound('Announcement not found');
    }

    const updated = await repositories.announcement.update(id, {
      isPublished: true,
      publishedAt: new Date(),
      publishedBy,
    });

    logger.info({ announcementId: id }, 'Announcement published');
    return updated;
  }

  async findAll(query: { page?: number; limit?: number; type?: string; published?: boolean }) {
    const filters: Record<string, unknown> = {};
    if (query.type) filters.type = query.type;
    if (query.published !== undefined) filters.isPublished = query.published;

    return repositories.announcement.findAll({
      page: query.page || 1,
      limit: query.limit || 20,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      filters,
    });
  }

  async findById(id: string) {
    const announcement = await repositories.announcement.findById(id);
    if (!announcement) {
      throw ApiError.notFound('Announcement not found');
    }
    return announcement;
  }

  async update(id: string, input: Partial<CreateAnnouncementInput>) {
    const announcement = await repositories.announcement.findById(id);
    if (!announcement) {
      throw ApiError.notFound('Announcement not found');
    }

    const updated = await repositories.announcement.update(id, input);
    logger.info({ announcementId: id }, 'Announcement updated');
    return updated;
  }

  async delete(id: string) {
    const announcement = await repositories.announcement.findById(id);
    if (!announcement) {
      throw ApiError.notFound('Announcement not found');
    }

    await repositories.announcement.delete(id);
    logger.info({ announcementId: id }, 'Announcement deleted');
    return { message: 'Announcement deleted successfully' };
  }
}

export const announcementService = new AnnouncementService();