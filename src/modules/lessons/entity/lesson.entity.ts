import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Chapter } from "../../chapters/entity/chapter.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity('lessons')
export class Lesson {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Field()
    @Column()
    name: string;

    @Field()
    @Column()
    description: string;

    @Field()
    @Column()
    estimatedDuration: number;

    @Field()
    @Column({ type: "text" })
    content: string;

    @Field(() => Chapter, { nullable: true })
    @ManyToOne(
        () => Chapter,
        (chapter) => chapter.lessons
    )
    chapter: Chapter;

    @Field()
    @CreateDateColumn()
    created_at: Date;
}