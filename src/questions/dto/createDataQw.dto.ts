import { ApiProperty } from "@nestjs/swagger";

export class createQw {
    @ApiProperty({ example: '39808230-eb5e-4634-9fb3-1b1a97c2e397', description: 'id' })
    id?: string;
    @ApiProperty({ example: 'JavaScript', description: 'type' })
    type: string;
    @ApiProperty({ example: 'текст вопросв', description: 'qwestion' })
    question: string;
    @ApiProperty({ example: 'подсказка', description: 'hint' })
    hint: string;
}

export class createQwList {
    @ApiProperty({ example: 'a940ca63-4409-4a2d-915a-92bda4f1cdad', description: 'id карточки' })
    card_id: string;
    @ApiProperty({ example: [{ question: 'Что такое замыкания(closures) в JavaScript и как они работают ?', hint: 'Замыкания(closures) — это одна из ключевых концепций в JavaScript, которая позволяет функции запоминать и получать доступ к своему лексическому окружению, даже когда эта функция выполняется вне своего начального контекста."' }], description: 'описание' })
    list: createQw[];
}

export class createCardsDto {
    @ApiProperty({ example: '39808230-eb5e-4634-9fb3-1b1a97c2e397', description: 'id карточки' })
    id?: string

    @ApiProperty({ example: 'JavaScript', description: 'type' })
    type: string;

    @ApiProperty({ example: 'JavaScript — это язык программирования, который в первую очередь применяют в веб-разработке.', description: 'description' })
    description: string
}


const templaytr =
    [
        {
            "type": "JavaScript",
            "questions": "Что такое замыкания(closures) в JavaScript и как они работают ?",
            "hint": "Замыкания(closures) — это одна из ключевых концепций в JavaScript, которая позволяет функции запоминать и получать доступ к своему лексическому окружению, даже когда эта функция выполняется вне своего начального контекста."
        }
    ]