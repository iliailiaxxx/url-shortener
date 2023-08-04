import { BadRequestException, Injectable } from '@nestjs/common';
import { WordsService } from '../words/words.service';
import { UrlService } from '../url/url.service';

@Injectable()
export class MakeShortUrlService {
  constructor(
    private readonly urlService: UrlService,
    private readonly wordsService: WordsService,
  ) {}

  private async ifAlreadyInSystem(longUrl: string): Promise<string> {
    return (await this.urlService.getByLongUrl(longUrl))?.shortUrl;
  }
  private prepareFullUrl(req: Request, url: string): string {
    const protocol = req['protocol'];
    const host = req['get']('Host');
    return `${protocol}://${host}${url}`;
  }
  private isValidUrl(url: string): Error | void {
    try {
      new URL(url);
    } catch (err) {
      return err;
    }
  }

  async makeShortUrl(longUrl: string, req: Request): Promise<string> {
    const check = this.isValidUrl(longUrl);
    if (check) throw new BadRequestException(`ERROR:${check}`);

    const ifAlreadyExists = await this.ifAlreadyInSystem(longUrl);
    if (ifAlreadyExists) return this.prepareFullUrl(req, ifAlreadyExists);

    const shortUrl = await this.wordsService.getRandomUrl();
    this.urlService.create(shortUrl, longUrl);
    return this.prepareFullUrl(req, shortUrl);
  }

  async getLongUrlFromDb(req: Request): Promise<string> {
    const url = await this.urlService.getByShortUrl(req.url);
    if (url) return url.longUrl;
    else throw new BadRequestException(`ERROR: No url found`);
  }
}
