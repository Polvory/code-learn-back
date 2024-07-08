import { ApiProperty } from "@nestjs/swagger";


enum Roles{
    system = 'system',
    content = 'content'
}

class AiHistoryEntry {
    @ApiProperty({ example: 'system|user', description: 'две роли: system, user' })
    readonly role: Roles;

    @ApiProperty({ example: 'Привет Chat GPT', description: 'текст сообщения' })
    readonly content: string;
}


export class GetAiHistoryDto {
    @ApiProperty({ type: [AiHistoryEntry], description: 'История запросов к AI' })
    readonly messages: AiHistoryEntry[];
}