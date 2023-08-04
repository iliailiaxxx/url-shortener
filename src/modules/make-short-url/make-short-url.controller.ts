import { Body, Controller, Get, Post, Request, Response } from '@nestjs/common';
import { MakeShortUrlService } from './make-short-url.service';
import { UrlDTO } from './dto/url-dto';
import { ApiTags } from '@nestjs/swagger';
import { json } from 'stream/consumers';

@Controller()
export class MakeShortUrlController {
  constructor(private readonly makeShortUrlService: MakeShortUrlService) {}

  @Post()
  @ApiTags('API')
  async returnShortUrl(
    @Body() dto: UrlDTO,
    @Request() req: Request,
  ): Promise<Object> {
    let shortUrl = await this.makeShortUrlService.makeShortUrl(dto.url, req);
    return { shortUrl }
  }
  @Get('*')
  @ApiTags('API')
  async getContentByShortUrl(
    @Request() req: Request,
    @Response() res: Response,
  ): Promise<Response> {
    const longUrl = await this.makeShortUrlService.getLongUrlFromDb(req);
    return res['redirect'](longUrl);
  }
}
