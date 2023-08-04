import { Module } from '@nestjs/common';
import { MakeShortUrlController } from './make-short-url.controller';
import { MakeShortUrlService } from './make-short-url.service';
import { WordsService } from '../words/words.service';
import { DatabaseModule } from '../../database/database.module';
import { UrlModule } from '../url/url.module';

@Module({
  imports: [DatabaseModule, UrlModule],
  controllers: [MakeShortUrlController],
  providers: [MakeShortUrlService, WordsService],
})
export class MakeShortUrlModule {}
