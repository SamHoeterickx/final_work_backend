import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsString, IsOptional } from 'class-validator';

@InputType()
export class OnboardingInput {
    @Field(() => [String])
    @IsArray()
    @IsString({ each: true })
    currentBehaviour: string[];

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    experienceLevel: string;

    @Field(() => String)
    @IsString()
    goal: string;

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    currentPreferences: string;

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    desiredTempo: string;

    @Field(() => [String], { nullable: true })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    currentMethodes: string[] | null;

    @Field(() => [String], { nullable: true })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    extraGear: string[] | null;
}
