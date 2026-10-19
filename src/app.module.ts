import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { PaymentsModule } from './payments/payments.module.js';
import { CustomersModule } from './customers/customers.module.js';
import { CarsModule } from './cars/cars.module.js';
import { BookingsModule } from './bookings/bookings.module.js';


@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    PaymentsModule,
    CustomersModule,
    CarsModule,
    BookingsModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
