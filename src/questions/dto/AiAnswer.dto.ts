import { ApiProperty } from "@nestjs/swagger";

export class AiAnswerDto {

    @ApiProperty({ example: '6935066908', description: 'id юзера' })
    user_id: string
    @ApiProperty({ example: 'Javascript', description: 'тип' })
    type: string;
    @ApiProperty({ example: 'Разговаривай по русский. Ты в проверяешь ответ на вопрос на техническом интервью. Вопрос: Что такое замыкания(closures) в JavaScript и как они работают ?.\n      Я ответил: Замыкания (closures) в JavaScript - это функция вместе с окружающим её лексическим окружением (scope), в котором она была объявлена. Замыкания позволяют функции запоминать и получать доступ к переменным из своей внешней функции даже после того, как внешняя функция завершила выполнение.', description: 'текст вопроса к ai' })
    text: string;
    @ApiProperty({ example: 'Что такое замыкания(closures) в JavaScript и как они работают ?', description: 'текст вопроса' })
    question: string

    last_question_id: string
}