import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        // 1. ສ້າງ Pool ໂດຍໃຊ້ DATABASE_URL ຈາກ .env
        const connectionString = process.env.DATABASE_URL;
        const pool = new Pool({ connectionString });

        // 2. ສ້າງ Adapter ຂອງ PostgreSQL ສຳລັບ Prisma 7
        const adapter = new PrismaPg(pool);

        // 3. ສົ່ງ adapter ເຂົ້າໄປໃນ super()
        super({ adapter });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}