import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@ObjectType()
@Entity('user_streaks')
export class UserStreaks {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Field()
    @Column({ default: 0 })
    currentStreak: number;

    @Field()
    @Column({ default: 0 })
    longestStreak: number;


    @Field(() => Date, { nullable: true })
    @Column({ 
        type: 'timestamp', 
        nullable: true 
    })
    lastCompletedDate: Date | null;

    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
    
}