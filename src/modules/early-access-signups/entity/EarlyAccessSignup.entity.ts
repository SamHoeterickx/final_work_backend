
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { EPlatform } from "../../../shared/types/types";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity('early_access_signups')
export class EarlyAccessSignups {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Field()
    @Column()
    email: string;

    @Field()
    @Column({ type: 'enum', enum: EPlatform, default: EPlatform.ANDROID})
    platform: EPlatform;

    @Field()
    @CreateDateColumn()
    date: Date;
}