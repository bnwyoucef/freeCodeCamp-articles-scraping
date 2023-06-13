import { Controller, Get, Post, Body} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('articles')
  getArticles() {
    return this.appService.scrapeData();
  }

  @Post('article')
  getArticle(@Body() url: any) {
    return this.appService.getArticle(url.link);
  }

}
