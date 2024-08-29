import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
    app.useGlobalGuards(new JwtAuthGuard(reflector));
  await app.listen(3001);
}
bootstrap();
