export class CreateUserDto {
    name: string;
    pushNotifications?: boolean;
    emailPromotions?: boolean;
    smsMessages?: boolean;
    isAdmin?: boolean;
  }
  