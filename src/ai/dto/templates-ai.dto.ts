import { ApiProperty } from "@nestjs/swagger";

export class GetAiTemplatesDto {

    @ApiProperty({example: 'сколько я потратил за предыдущий месяц', description: 'Текст шаблона'})
    readonly  text: string;
    
    @ApiProperty({example: '[{"amount": 3900, "category": "Доход", "comment": "ЗП", "date": "2024-04-07T17:00:38.759Z", "id": 1712509238759}, {"amount": -6700, "category": "Расход", "categoryColor": "#67A3B8", "date": "2024-04-07T17:30:33.477Z", "name": "Магазин"}, {"amount": -6700, "category": "Расход", "categoryColor": "#F868C7", "date": "2024-04-08T10:03:39.807Z", "name": "ППО"}]', description: 'Данные для анализа'})
    readonly  data: string;
}