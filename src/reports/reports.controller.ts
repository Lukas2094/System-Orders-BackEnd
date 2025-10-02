import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { FiltroRelatorioDto } from './dto/filter-reports.dto';

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Get()
    async gerar(@Query() filtro: FiltroRelatorioDto) {
        return this.reportsService.gerarRelatorio(filtro);
    }
}
