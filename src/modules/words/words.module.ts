import { Module } from '@nestjs/common';
import { WordsService } from './words.service';
import { DatabaseModule } from '../../database/database.module';
import { UrlModule } from '../url/url.module';

@Module({
  imports: [DatabaseModule, UrlModule],
  providers: [WordsService],
})
export class WordsModule {}
