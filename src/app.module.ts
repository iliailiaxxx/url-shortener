import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MakeShortUrlModule } from './modules/make-short-url/make-short-url.module';

@Module({
  imports: [ConfigModule.forRoot(), MakeShortUrlModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
