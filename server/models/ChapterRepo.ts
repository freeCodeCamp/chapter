import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Entity,
} from 'typeorm';

@Entity({ name: 'chapters' })
export class ChapterRepo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: false })
  description!: string;

  @Column({ nullable: false })
  category!: string;

  @Column({ type: 'json' })
  details!: any;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  constructor(params: {
    name: string;
    description: string;
    category: string;
    details: any;
  }) {
    if (params) {
      const { name, description, category, details } = params;

      this.name = name;
      this.description = description;
      this.category = category;
      this.details = details;
    }
  }
}
