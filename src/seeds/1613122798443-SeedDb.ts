import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDb16131227984436 implements MigrationInterface {
  name = 'SeedDb16131227984436';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tags (name) VALUES ('Peacock'), ('Panda'), ('NestJS')`,
    );
    await queryRunner.query(
      //password is 123
      `INSERT INTO users (username, email, password) VALUES ('Casandra', 'casandra@gmail.com', '$2b$10$e4plRyxdB7adnLtZ6i1EGuYniy13Iie005E6ggpiDOYBCMrsftIB6') `,
    );
    await queryRunner.query(
      `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('first-article', 'first article', 'first article description','first article body', 'Peacock, NestJS', 1),('second-article', 'second article', 'second article description','second article body', 'Panda,NestJS', 1) `,
    );
  }

  public async down(): Promise<void> {}
}
