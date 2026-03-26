import { Resolver, Query } from '@nestjs/graphql';
import { AppService } from './app.service';

@Resolver()
export class AppResolver {
    constructor(
        private appService: AppService
    ){}

    @Query(() => String)
    public getHello(): string {
        return this.appService.getHello();
    }
}
