import { Module } from '@nestjs/common';
import { PagbankService } from './pagbank.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    providers: [PagbankService],
    exports: [PagbankService],
})
export class PaymentModule { }