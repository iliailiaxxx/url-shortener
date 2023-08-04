import { Test, TestingModule } from '@nestjs/testing';
import { MakeShortUrlController } from './make-short-url.controller';
import { MakeShortUrlService } from './make-short-url.service';
import { MockRequest, createRequest } from 'node-mocks-http';

describe('MakeShortUrlController', () => {
  let controller: MakeShortUrlController;
  let mockHttpReq: MockRequest<any>;

  const mockMakeShortUrlService = {
    makeShortUrl: jest
      .fn()
      .mockImplementation(() => Promise.resolve('http://anyurl.com')),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MakeShortUrlController],
      providers: [MakeShortUrlService],
    })
      .overrideProvider(MakeShortUrlService)
      .useValue(mockMakeShortUrlService)
      .compile();

    controller = module.get<MakeShortUrlController>(MakeShortUrlController);
    mockHttpReq = createRequest({ method: 'GET', url: '/' });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should return short url as string', async () => {
    await expect(
      controller.returnShortUrl({ url: expect.any(String) }, mockHttpReq),
    ).resolves.toEqual({url:expect.any(String)});
  });
});
