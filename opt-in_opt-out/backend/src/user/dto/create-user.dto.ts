export class CreateUserDto {
  name: string;
  isAdmin?: boolean;
  preferences?: Record<string, boolean>;
}