import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { FastifyReply } from "fastify";
import { ServerResponse } from "http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export class HttpResponse {
  constructor(
    public readonly body: string,
    public readonly options: Partial<{
      headers: { [key: string]: string };
      status: HttpStatus;
    }>,
  ) {}
}

@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    next.handle();
    return next.handle().pipe(
      map((ret) => {
        if (ret instanceof HttpResponse) {
          const response = context
            .switchToHttp()
            .getResponse<FastifyReply<ServerResponse>>();
          const { headers, status } = ret.options;

          for (const header of Object.keys(headers || {})) {
            response.header(header, headers[header]);
          }

          if (status) {
            response.status(status);
          }

          return ret.body;
        }

        return ret;
      }),
    );
  }
}
