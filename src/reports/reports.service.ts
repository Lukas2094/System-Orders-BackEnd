import { Injectable } from '@nestjs/common';
import { FiltroRelatorioDto } from './dto/filter-reports.dto';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class ReportsService {
    constructor(@InjectDataSource() private readonly dataSource: DataSource) { }

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
          SELECT id, name, price, stock, category_id, subcategory_id, isbn, created_at, updated_at
          FROM products
          WHERE (? IS NULL OR created_at >= ?)
            AND (? IS NULL OR created_at <= ?)
            AND (? IS NULL OR category_id = ?)
            AND (? IS NULL OR subcategory_id = ?)
          ORDER BY created_at DESC
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
