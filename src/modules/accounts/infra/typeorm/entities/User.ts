import { Expose } from 'class-transformer';
import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

@Entity('users')
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ name: 'driver_license' })
  driverLicense: string;

  @Column()
  isAdmin: boolean;

  @Column()
  avatar: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'avatarUrl' })
  avatarUrl(): string {
    switch (process.env.DISK) {
      case 'local':
        return `${process.env.API_URL}/avatar/${this.avatar}`;
      case 's3':
        return `${process.env.AWS_BUCKET_URL}/avatar/${this.avatar}`;
      default:
        return null;
    }
  }
  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}
