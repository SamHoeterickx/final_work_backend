import {
    EntitySubscriberInterface,
    EventSubscriber,
    UpdateEvent,
    DataSource,
} from 'typeorm';

import { EProgressStatus } from '../types/types';
import { Lesson } from '../../modules/lessons/entity/lesson.entity';
import { LessonUser } from '../../modules/lessons/entity/lesson_user.entity';
import { ChapterUser } from '../../modules/chapters/entity/chapter_user.entity';

@EventSubscriber()
export class ChapterUserSubscriber implements EntitySubscriberInterface<ChapterUser> {
    constructor(dataSource: DataSource) {
        dataSource.subscribers.push(this);
    }

    listenTo() {
        return ChapterUser;
    }

    async afterUpdate(event: UpdateEvent<ChapterUser>) {
        const entity = event.entity as ChapterUser | undefined;
        const databaseEntity = event.databaseEntity as ChapterUser | undefined;

        const oldStatus = databaseEntity?.status;
        const newStatus = entity?.status;

        if (
            oldStatus === EProgressStatus.LOCKED &&
            newStatus === EProgressStatus.UNLOCKED
        ) {
            const chapter = entity?.chapter || databaseEntity?.chapter;
            const user = entity?.user || databaseEntity?.user;

            if (!chapter || !user) {
                console.warn('Failed ot unlock lessons');
                return;
            }

            const chapterUuid = chapter.uuid;

            const lessonRepo = event.manager.getRepository(Lesson);
            const lessons = await lessonRepo.find({
                where: { chapter: { uuid: chapterUuid } },
                order: { order: 'ASC' },
            });

            const lessonUserRepo = event.manager.getRepository(LessonUser);

            const lessonUserEntries = lessons.map((lesson) => {
                return lessonUserRepo.create({
                    user: user,
                    lesson: lesson,
                    status:
                        lesson.order === 1
                            ? EProgressStatus.UNLOCKED
                            : EProgressStatus.LOCKED,
                });
            });

            await lessonUserRepo.save(lessonUserEntries);
            console.log(
                `Lessen unlocked voor user ${user.uuid} in chapter ${chapterUuid}`,
            );
        }
    }
}
