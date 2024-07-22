import { ApiProperty } from "@nestjs/swagger";

export class createUser {
    @ApiProperty({ example: '6935066908', description: 'id' })
    user_id: string;
    @ApiProperty({ example: 'polvory', description: 'name' })
    user_name?: string;

    @ApiProperty({ example: '1.jpg', description: 'img' })
    user_image?: string;
}