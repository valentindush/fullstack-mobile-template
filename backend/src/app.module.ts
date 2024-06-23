import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: 'pid,hostname',
            messageFormat: '{context} - {msg}',
          },
        },
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        customProps: (req, res) => ({
          context: 'HTTP',
        }),
        autoLogging: false,
        serializers: {
          req: (req) => ({
            method: req.method,
            url: req.url,
          }),
          res: (res) => ({
            statusCode: res.statusCode,
          }),
          err: (err) => ({
            type: err.type,
            message: err.message,
            stack: err.stack,
          }),
        },
        customLogLevel: (req, res, err) => {
          if (res.statusCode >= 400 && res.statusCode < 500) {
            return 'warn';
          } else if (res.statusCode >= 500 || err) {
            return 'error';
          }
          return 'info';
        },
        customSuccessMessage: (req, res) => {
          if (res.statusCode === 404) {
            return 'Resource not found';
          }
          return `${req.method} ${req.url}`;
        },
        customErrorMessage: (req, res, err) => {
          return `${req.method} ${req.url} ${err.message}`;
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

}
