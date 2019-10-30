import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import setupApp from '../src/setupApp';

describe('End To End', () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    setupApp(app);

    await app.init();

    await app
      .getHttpAdapter()
      .getInstance()
      .ready();
  });

  describe('/uploads (POST)', () => {
    it('works as expected', () => {
      return request(app.getHttpServer())
        .post('/uploads')
        .set('Content-Type', 'application/json')
        .send({ code: 'w 1', name: 'W' })
        .expect(202)
        .expect('Location', /^\/uploads\/[a-z0-9\-]+/)
        .expect('');
    });

    it('Validates the body', () => {
      return request(app.getHttpServer())
        .post('/uploads')
        .set('Content-Type', 'application/json')
        .send({ code: 1 })
        .expect(400);
    });
  });
});
