import { Injectable } from '@nestjs/common';
import { FiltroRelatorioDto } from './dto/filter-reports.dto';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class ReportsService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async gerarRelatorio(filtro: FiltroRelatorioDto) {
    const { tipo, dataInicio, dataFim, status, category_id, subcategory_id, role_id } = filtro;
    let query = '';
    const params: any[] = [];

    switch (tipo) {
      case 'pedidos':
        query = `
          SELECT id, customerName, customerPhone, status, createdAt
          FROM orders
          WHERE (? IS NULL OR createdAt >= ?)
            AND (? IS NULL OR createdAt <= ?)
            AND (? IS NULL OR status = ?)
          ORDER BY createdAt DESC
        `;
        params.push(
          dataInicio ?? null, dataInicio ?? null,
          dataFim ?? null, dataFim ?? null,
          status ?? null, status ?? null
        );
        break;

      case 'produtos':
        query = `
          SELECT 
            p.id, 
            p.name, 
            p.price, 
            p.stock, 
            p.isbn, 
            p.created_at, 
            p.updated_at,
            c.id AS category_id,
            c.name AS category_name,
            s.id AS subcategory_id,
            s.name AS subcategory_name
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          LEFT JOIN subcategories s ON p.subcategory_id = s.id
          WHERE (? IS NULL OR p.created_at >= ?)
            AND (? IS NULL OR p.created_at <= ?)
            AND (? IS NULL OR p.category_id = ?)
            AND (? IS NULL OR p.subcategory_id = ?)
          ORDER BY p.created_at DESC
        `;
        params.push(
          dataInicio ?? null, dataInicio ?? null,
          dataFim ?? null, dataFim ?? null,
          category_id ?? null, category_id ?? null,
          subcategory_id ?? null, subcategory_id ?? null
        );
        break;

      case 'usuarios':
        query = `
          SELECT id, name, email, role_id, phone, createdAt, updatedAt
          FROM users
          WHERE (? IS NULL OR createdAt >= ?)
            AND (? IS NULL OR createdAt <= ?)
            AND (? IS NULL OR role_id = ?)
          ORDER BY createdAt DESC
        `;
        params.push(
          dataInicio ?? null, dataInicio ?? null,
          dataFim ?? null, dataFim ?? null,
          role_id ?? null, role_id ?? null
        );
        break;

      default:
        throw new Error('Tipo de relatório inválido');
    }

    return this.dataSource.query(query, params);
  }
}