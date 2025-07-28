import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const cookie = req.headers['cookie'];
    console.log('[JwtAuthGuard] handleRequest:', { err, user, info, cookie });
    if (err || !user) {
      // Log error reason
      console.warn(
        '[JwtAuthGuard] Access denied:',
        err || info?.message || 'No user',
      );
      return null;
    }
    return user;
  }
}
