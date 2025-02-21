import { Injectable } from '@nestjs/common';

@Injectable()
export class ArticleService {
  async createAticle() {
    return 'create article service';
  }
}
