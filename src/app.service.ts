import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import axios from 'axios';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async scrapeData() {
    const url = 'https://www.freecodecamp.org/news';
    
    try {
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);

      const allImages = $('article a img').map((index, element) => $(element).attr('src')).get();
      const titles = $('article h2 a').map((index, element) => $(element).text().trim()).get();
      const paragraphs = $('article a').map((index, element) => "https://www.freecodecamp.org" + $(element).attr('href')).get();
      
      const images = allImages.filter((img,index) => index % 2 === 0)
      const links = paragraphs.filter((link,index) => !(link.includes('author') || link.includes('tag')))

      const uniqueLinks = links.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });

      const articlesInfo = uniqueLinks.map((element,index) => {
        return {title:titles[index],imageUrl:images[index],link:uniqueLinks[index]}
      })
      
      return articlesInfo
    } catch (error) {
      throw new Error('Failed to scrape data' + error);
    }
  }

  async getArticle(url:string) { 
    try {
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);
      const paragraphs = $('article').contents();
      return $.html(paragraphs)
    } catch (error) {
      throw new Error(error);
    }
  }

}
