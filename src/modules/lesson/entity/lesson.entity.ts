import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity('lesson')
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

    @Field(() => Int)
    @Column({ type: 'int'})
    order: number;

    @Field(() => Int)
    @Column({ type: 'int', default: 1 })
    durationMinutes: number;

    @Field(() => String)
    @Column({ type: 'jsonb', default: {} })
    content: Record<string, any>;

    @Field(() => [Lesson], { nullable: true })
    @ManyToMany(() => Lesson)
    @JoinTable({
        name: 'lesson_dependencies',
        joinColumn: { name: 'lesson_id', referencedColumnName: 'uuid'},
        inverseJoinColumn: { name: 'lesson_id', referencedColumnName: 'uuid'}
    })
    prerequisites: Lesson[];

    @Field()
    @CreateDateColumn()
    created_at: Date;
}