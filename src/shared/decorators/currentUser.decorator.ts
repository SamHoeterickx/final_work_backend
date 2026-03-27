import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { type Request } from 'express';

interface AuthenticatedRequest extends Request {
    user?: unknown;
}

export const CurrentUser = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const ctx = GqlExecutionContext.create(context);
        const req = ctx.getContext<{ req: AuthenticatedRequest }>().req;
        return req.user;
    },
);
