import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   const reflector = app.get(Reflector);
//     app.useGlobalGuards(new JwtAuthGuard(reflector));
//   await app.listen(3001);
// }
// bootstrap();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173', // or '*' for all domains
    credentials: true,
  }); // Enable CORS if needed
  app.use(cookieParser());
  app.setGlobalPrefix('api/v1');
  await app.listen(3001);
}
bootstrap();
