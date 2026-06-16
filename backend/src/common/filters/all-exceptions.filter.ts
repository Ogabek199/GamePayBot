import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = (exception as any)?.message || 'Internal server error';
    const code = (exception as any)?.code;

    console.error('--- EXCEPTION START ---');
    console.error('Path:', request.url);
    console.error('Status:', status);
    console.error('Code:', code);
    console.error('Message:', message);
    if (exception instanceof Error) {
      console.error('Stack:', exception.stack);
    }
    console.error('--- EXCEPTION END ---');

    // Handle Prisma specific errors to avoid 500s for common issues
    if (code === 'P2002') {
      return response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message: 'Unique constraint failed',
        path: request.url,
      });
    }

    if (code === 'P2025' || code === 'P2003') {
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Related record not found',
        path: request.url,
      });
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }
}
