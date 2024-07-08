import { ApiProperty } from "@nestjs/swagger";

export class GetAiReqDto {

    @ApiProperty({example: 'Ты чат джпт?', description: 'вопрос к gpt'})
    readonly  text: string;
    
}