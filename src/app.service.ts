import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `  <div style="
        text-align: center;
        font-family: Arial, sans-serif;
        margin-top: 50px;
      ">
        <h1 style="color: #4CAF50; font-size: 3rem;">🌍 Hello, World! 🌎</h1>
        <p style="font-size: 1.2rem; color: #555;">
          Welcome to my NestJS Restaurant App..! 🚀
        </p>
      </div>`;
  }
}
