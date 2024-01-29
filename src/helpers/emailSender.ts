import { SES, AWSError } from "aws-sdk";
import { SendRawEmailRequest, SendRawEmailResponse } from 'aws-sdk/clients/ses';
import MailComposer from "nodemailer/lib/mail-composer";
import { Settings, logger } from "../configs";

const awsConfig = {
    region: Settings.awsRegion,
    accessKeyId: Settings.awsAccessKeyId,
    secretAccessKey: Settings.awsSecretAccessKey
}

export interface MailRecipients {
    to: string[],
    cc?: string[],
    bcc?: string[]
}

export interface MailBody {
    text?: string,
    html?: string
}

export interface MailAttachment {
    filename: string,
    content: Buffer
}


export class EmailSender {
    private _ses: SES;
    private _recipients: MailRecipients;
    private _subject: string;
    private _body: MailBody;
    private _attachments?: MailAttachment[]

    constructor(recipients: MailRecipients, subject: string, body: MailBody, attachments?: MailAttachment[]) {
        this._ses = new SES(awsConfig); 
        this._recipients = recipients;
        this._subject = subject;
        this._body = body;
        this._attachments = attachments;
    }

    public async send(sourceEmail: string = Settings.sourceEmail) {
        this._validate()

        const rawMessage = await this._constructMessage(sourceEmail)
        this._ses.sendRawEmail(rawMessage, (err: AWSError, data: SendRawEmailResponse) => {
            if (err) {
                logger.error(`Error sending email: ${err.message}`)
                throw Error(err.message)
            }
            logger.info(`Succuess fully sent email. Message ID: ${data.MessageId}`)
            return
        })
    }

    private _validate() {
        if (!this._body.html && !this._body.text) {
            throw new Error('At least one of text or html must be provided');
        }
    }

    private async _constructMessage(sourceEmail: string){
        const message = {
            from: sourceEmail,
            to: this._recipients.to.join(","),
            cc: this._recipients.cc?.join(","),
            bcc: this._recipients.bcc?.join(","),
            subject: this._subject,
            text: this._body.text,
            html: this._body.html,
            attachments: this._attachments ? this._attachments.map(attachment => ({
                filename: attachment.filename,
                content: attachment.content
            })) : undefined
        }

        const rawMessageData = await new MailComposer(message).compile().build()
        const rawMessage: SendRawEmailRequest = {
            Source: sourceEmail,
            Destinations: [...this._recipients.to, ...(this._recipients.cc || []), ...(this._recipients.bcc || [])],
            RawMessage: {
                Data: rawMessageData
            }
        }
        return rawMessage
    }
}