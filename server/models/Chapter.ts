import { Column, Entity } from 'typeorm';
import { BaseModel } from './BaseModel';

@Entity({ name: 'chapters' })
export class Chapter extends BaseModel {
  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: false })
  description!: string;

  @Column({ nullable: false })
  category!: string;

  @Column({ type: 'json' })
  details!: any;

  constructor(params: {
    name: string;
    description: string;
    category: string;
    details: any;
  }) {
    super();
    if (params) {
      const { name, description, category, details } = params;

      this.name = name;
      this.description = description;
      this.category = category;
      this.details = details;
    }
  }
}
