import { Resolver } from '@nestjs/graphql';
import { ChaptersService } from './chapters.service';
import { Query } from '@nestjs/common';

@Resolver()
export class ChaptersResolver {
    constructor(private chaptersService: ChaptersService){}

    // @Query(() => [])
}
