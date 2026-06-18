import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EarlyAccessSignupsService } from './early-access-signups.service';
import { EarlySubscribeDto } from './dto/earlySubscribe.dto';

@Resolver()
export class EarlyAccessSignupsResolver {
    constructor(private earlyAccessSignupService: EarlyAccessSignupsService) {}

    @Query(() => Number)
    async getCount(): Promise<number> {
        return await this.earlyAccessSignupService.getCount();
    }

    @Mutation()
    async subscribe(@Args('input') input: EarlySubscribeDto) {
        return await this.earlyAccessSignupService.subscribe(input);
    }
}
