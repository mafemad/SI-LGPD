import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
  ) {}

  async create(user: { id: string }, message: string) {
    const notification = this.notificationRepo.create({
      user,
      message,
    });
    await this.notificationRepo.save(notification);
  }
  

  getByUser(userId: string) {
    return this.notificationRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(notificationId: string) {
    await this.notificationRepo.update(notificationId, { read: true });
    return { message: 'Notificação marcada como lida.' };
  }
}
