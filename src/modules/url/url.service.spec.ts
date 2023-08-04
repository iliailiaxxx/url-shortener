import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { Url } from '../../database/schemas/url-model.schema';

// Sample test data
const sampleUrlData: Url = {
  shortUrl: 'http://short.url',
  longUrl: 'http://long.url',
};

describe('UrlService', () => {
  let urlService: UrlService;
  let urlModel: Model<Url>;

  const mockUrlModel = {
    findOne: jest.fn().mockReturnThis(),
    save: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: getModelToken(Url.name),
          useValue: mockUrlModel,
        },
      ],
    }).compile();

    urlService = module.get<UrlService>(UrlService);
    urlModel = module.get<Model<Url>>(getModelToken(Url.name));
  });

  it('should be defined', () => {
    expect(urlService).toBeDefined();
  });
});
