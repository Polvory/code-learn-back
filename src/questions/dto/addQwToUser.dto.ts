import { ApiProperty } from "@nestjs/swagger";

export class addQwToUser {
    @ApiProperty({ example: '6935066908', description: 'user_id' })
    user_id: string;
    @ApiProperty({ example: 'JavaScript', description: 'questions_type' })
    question_type: string;
}