import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Url } from '../../database/schemas/url-model.schema';

@Injectable()
export class UrlService {
  constructor(@InjectModel(Url.name) private readonly urlModel: Model<Url>) {}

  async getByLongUrl(url: string): Promise<Url> {
    try {
      return await this.urlModel.findOne({ longUrl: url }).exec();
    } catch (error) {
      throw new Error('An error occurred while fetching the URL by long URL.');
    }
  }

  async getByShortUrl(url: string): Promise<Url> {
    try {
      return await this.urlModel.findOne({ shortUrl: url }).exec();
    } catch (error) {
      throw new Error('An error occurred while fetching the URL by short URL.');
    }
  }

  async create(shortUrl: string, longUrl: string): Promise<void> {
    try {
      const newRecord = new this.urlModel({ shortUrl, longUrl });
      await newRecord.save();
    } catch (error) {
      throw new Error('An error occurred while creating the URL record.');
    }
  }
}
