import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Category } from 'src/categories/category.entity';
import { Subcategory } from 'src/subcategories/subcategory.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Category, (category) => category.products, { 
    nullable: false,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'category_id' })
  categoryId: number;

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.products, { 
    nullable: true, // ← Permite null
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'subcategory_id' })
  subcategory: Subcategory | null; // ← Tipo atualizado para permitir null

  @Column({ name: 'subcategory_id', nullable: true })
  subcategoryId: number | null; // ← Tipo atualizado para permitir null

  @Column('decimal', { 
    precision: 10, 
    scale: 2, 
    default: 0 
  })
  price: number;

  @Column('int', { default: 0 })
  stock: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}