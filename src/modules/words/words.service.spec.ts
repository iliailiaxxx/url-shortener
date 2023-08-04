import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { WordsService } from './words.service';
import { UrlService } from '../url/url.service';

describe('WordsService', () => {
  let wordsService: WordsService;
  let urlService: UrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WordsService,
        {
          provide: UrlService,
          useValue: {
            getByShortUrl: jest.fn(),
          },
        },
      ],
    }).compile();

    wordsService = module.get<WordsService>(WordsService);
    urlService = module.get<UrlService>(UrlService);
  });

  describe('randomElement', () => {
    it('should return a random element from the input array', () => {
      const colorsArray = ['red', 'blue', 'green', 'yellow', 'orange'];
      const randomElement = wordsService['randomElement'](colorsArray);
      expect(colorsArray).toContain(randomElement);
    });
  });

  describe('alreadyExist', () => {
    it('should return true if the short URL exists in the database', async () => {
      const mockShortUrl = '/mock-url';
      jest
        .spyOn(urlService, 'getByShortUrl')
        .mockResolvedValue({ shortUrl: mockShortUrl } as any);

      const result = await wordsService['alreadyExist'](mockShortUrl);

      expect(result).toBe(true);
      expect(urlService.getByShortUrl).toHaveBeenCalledWith(mockShortUrl);
    });

    it('should return false if the short URL does not exist in the database', async () => {
      const mockShortUrl = '/non-existent-url';
      jest.spyOn(urlService, 'getByShortUrl').mockResolvedValue(null);

      const result = await wordsService['alreadyExist'](mockShortUrl);

      expect(result).toBe(false);
      expect(urlService.getByShortUrl).toHaveBeenCalledWith(mockShortUrl);
    });

    it('should throw BadRequestException if an error occurs during database fetch', async () => {
      const mockShortUrl = '/mock-url';
      const errorMessage = 'Database connection error';
      jest
        .spyOn(urlService, 'getByShortUrl')
        .mockRejectedValue(new Error(errorMessage));

      await expect(
        wordsService['alreadyExist'](mockShortUrl),
      ).rejects.toThrowError(BadRequestException);
      expect(urlService.getByShortUrl).toHaveBeenCalledWith(mockShortUrl);
    });
  });

  describe('getRandomUrl', () => {
    it('should generate a unique random URL', async () => {
      jest.spyOn(wordsService, 'alreadyExist').mockResolvedValue(false);

      const randomUrl = await wordsService.getRandomUrl();

      const regexPattern = /^\/[a-z]+-[a-z]+$/;
      expect(randomUrl).toMatch(regexPattern);
      expect(wordsService['alreadyExist']).toHaveBeenCalledWith(randomUrl);
    });

    it('should append a random number to the URL if it already exists', async () => {
      jest
        .spyOn(wordsService, 'alreadyExist')
        .mockResolvedValueOnce(true)
        .mockResolvedValue(false);

      const randomUrl = await wordsService.getRandomUrl();

      const regexPattern = /^\/[a-z]+-[a-z]+-\d+$/;
      expect(randomUrl).toMatch(regexPattern);
      expect(wordsService['alreadyExist']).toHaveBeenCalledTimes(2);
    });
  });
});
