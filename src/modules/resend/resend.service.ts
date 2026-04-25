import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { IEmailOptions } from 'src/shared/types/types';


@Injectable()
export class ResendService {
    private RESEND_KEY: string;
    private resend: Resend;

    constructor(private configService: ConfigService) {
        const API_KEY = this.configService.get<string>('RESEND_API_KEY');
        if (!API_KEY) {
            throw new InternalServerErrorException(
                `RESEND_API_KEY environment is not set`,
            );
        }
        this.RESEND_KEY = API_KEY;
        this.resend = new Resend(this.RESEND_KEY);
    }

    public async sendEmail(emailOptions: IEmailOptions) {
        try {
            const { reciever, message, subject } = emailOptions;

            await this.resend.emails.send({
                from: 'onboarding@resend.dev',
                to: reciever,
                subject: subject,
                html: message,
            });
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                `Failed to send email: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }
}
