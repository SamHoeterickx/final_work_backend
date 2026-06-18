import {
    HttpException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EarlyAccessSignups } from './entity/EarlyAccessSignup.entity';
import { EarlySubscribeDto } from './dto/earlySubscribe.dto';
import { ResendService } from '../resend/resend.service';

@Injectable()
export class EarlyAccessSignupsService {
    constructor(
        @InjectRepository(EarlyAccessSignups)
        private earlyAccessSignupsRepository: Repository<EarlyAccessSignups>,
        private resendService: ResendService,
    ) {}

    async getCount(): Promise<number> {
        try {
            return await this.earlyAccessSignupsRepository.count();
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                `Failed to get early signup count: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    async subscribe(input: EarlySubscribeDto): Promise<boolean> {
        try {
            const nSubscriber = this.earlyAccessSignupsRepository.create({
                email: input.email,
                platform: input.platform,
            });

            await this.earlyAccessSignupsRepository.save(nSubscriber);

            const translations: Record<string, { subject: string; title: string; body: string }> = {
                en: {
                    subject: 'Welcome to BrewLingo Early Access!',
                    title: 'Thank you for subscribing!',
                    body: "You have successfully signed up for BrewLingo's early access. We will let you know as soon as we have exciting news to share!",
                },
                nl: {
                    subject: 'Welkom bij BrewLingo Early Access!',
                    title: 'Bedankt voor je aanmelding!',
                    body: 'Je hebt je succesvol aangemeld voor de early access van BrewLingo. We laten het je weten zodra we spannend nieuws te delen hebben!',
                },
                fr: {
                    subject: "Bienvenue dans l'accès anticipé de BrewLingo !",
                    title: 'Merci de vous être abonné !',
                    body: "Vous vous êtes inscrit avec succès à l'accès anticipé de BrewLingo. Nous vous tiendrons au courant dès que nous aurons de bonnes nouvelles à partager !",
                },
            };

            const lang = (input.language || 'en').toLowerCase();
            console.log(input.language);
            const t = translations[lang] || translations['en'];

            await this.resendService.sendEmail({
                reciever: input.email,
                subject: t.subject,
                message: `
                    <div style="background-color: #E8DFD3; padding: 64px 20px; font-family: Arial, sans-serif; color: #222222; text-align: center; box-sizing: border-box;">
                        <div style="max-width: 550px; margin: 0 auto; line-height: 1.6;">
                            <h2 style="font-size: 32px; margin-top: 0; margin-bottom: 24px;">${t.title}</h2>
                            <p style="font-size: 18px; margin-bottom: 0;">${t.body}</p>
                        </div>
                    </div>
                `,
            });

            return true;
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                `Failed to subscribe: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }
}
