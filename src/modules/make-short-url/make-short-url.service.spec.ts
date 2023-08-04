import { Test } from '@nestjs/testing';
import { MakeShortUrlService } from './make-short-url.service';
import { WordsService } from '../words/words.service';
import { UrlService } from '../url/url.service';
import { BadRequestException } from '@nestjs/common';

describe('MakeShortUrlService', () => {
  let makeShortUrlService: MakeShortUrlService;
  let wordsService: WordsService;
  let urlService: UrlService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MakeShortUrlService,
        {
          provide: WordsService,
          useValue: {
            getRandomUrl: jest.fn().mockReturnValue('random-short-url'),
          },
        },
        {
          provide: UrlService,
          useValue: {
            getByLongUrl: jest.fn().mockReturnValue(null),
            create: jest.fn(),
            getByShortUrl: jest.fn().mockReturnValue(null),
          },
        },
      ],
    }).compile();

    makeShortUrlService =
      moduleRef.get<MakeShortUrlService>(MakeShortUrlService);
    wordsService = moduleRef.get<WordsService>(WordsService);
    urlService = moduleRef.get<UrlService>(UrlService);
  });

  it('should be defined', () => {
    expect(makeShortUrlService).toBeDefined();
  });

  describe('makeShortUrl', () => {
    it('should generate a short URL for a valid long URL', async () => {
      const longUrl = 'https://www.example.com';
      const req = {
        protocol: 'https',
        get: jest.fn().mockReturnValue('example.com'),
      } as any;
      const expectedShortUrl = 'https://example.comrandom-short-url';

      const result = await makeShortUrlService.makeShortUrl(longUrl, req);

      expect(result).toBe(expectedShortUrl);
      expect(wordsService.getRandomUrl).toHaveBeenCalled();
      expect(urlService.create).toHaveBeenCalledWith(
        'random-short-url',
        longUrl,
      );
    });

    it('should return the existing short URL for an already existing long URL', async () => {
      const longUrl = 'https://www.example.com';
      const req = {
        protocol: 'https',
        get: jest.fn().mockReturnValue('example.com'),
      } as any;
      const existingShortUrl = 'https://example.com/existing-short-url';
      urlService.getByLongUrl = jest
        .fn()
        .mockReturnValue({ shortUrl: existingShortUrl });

      const result = await makeShortUrlService.makeShortUrl(longUrl, req);

      expect(result).toBe('https://example.com' + existingShortUrl);
      expect(wordsService.getRandomUrl).not.toHaveBeenCalled();
      expect(urlService.create).not.toHaveBeenCalled();
    });

    it('should throw a BadRequestException for an invalid long URL', async () => {
      const longUrl = 'invalid-url';
      const req = {
        protocol: 'https',
        get: jest.fn().mockReturnValue('example.com'),
      } as any;

      await expect(
        makeShortUrlService.makeShortUrl(longUrl, req),
      ).rejects.toThrowError(BadRequestException);
      expect(wordsService.getRandomUrl).not.toHaveBeenCalled();
      expect(urlService.create).not.toHaveBeenCalled();
    });
  });

  describe('getLongUrlFromDb', () => {
    it('should return the long URL from the database for a valid short URL', async () => {
      const shortUrl = 'https://example.com/some-short-url';
      const longUrl = 'https://www.example.com';
      urlService.getByShortUrl = jest.fn().mockReturnValue({ longUrl });

      const result = await makeShortUrlService.getLongUrlFromDb({
        url: shortUrl,
      } as any);

      expect(result).toBe(longUrl);
    });

    it('should throw a BadRequestException if no matching long URL is found in the database', async () => {
      urlService.getByShortUrl = jest.fn().mockReturnValue(null);

      await expect(
        makeShortUrlService.getLongUrlFromDb({
          url: 'https://example.com/non-existent',
        } as any),
      ).rejects.toThrowError(BadRequestException);
    });
  });
});
