import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Url, UrlSchema } from '../../database/schemas/url-model.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }])],
  providers: [UrlService],
  exports: [UrlService],
})
export class UrlModule {}
