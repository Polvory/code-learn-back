
import { Injectable, Logger } from '@nestjs/common';
import { openai } from "./OpenAi";
import { AI_MESSAGES_ROLE, AI_MODEL } from './constants';
import { GetAiTemplatesDto } from './dto/templates-ai.dto'

@Injectable()
export class OpenAiService {
    private readonly logger = new Logger(OpenAiService.name)

    async getCompletions(mass) {
        try {
            const stream = await openai.chat.completions.create({
                model: AI_MODEL,
                messages: mass,
            });
            if (stream)
                return stream.choices[0]?.message?.content
            return `Ошибка попробуй еще раз`
        } catch (error) {
            this.logger.error(error)
            return { descriptin: `Ошибка на стороне AI` }
        }

    }
    analyzeExpenses(expenses) {
        let all = ''
        expenses.map(expense => {
            const amountRub = `${expense.amount}рублей`;
            const category = expense.category === 'Доход' ? 'Доход' : 'Расход';
            const date = new Date(expense.date).toLocaleDateString('ru-RU');
            const comment = expense.comment || expense.name || '';
            all += `Сумма:${amountRub} категория:${category} дата:${date} коментарий:${comment},`

        });
        return all
    }


    async getHistory(messages) {

        // return messages
        try {
            const stream = await openai.chat.completions.create({
                model: AI_MODEL,
                messages: messages,
            });
            if (stream)
                return stream.choices[0]?.message?.content
            return `Ошибка попробуй еще раз`
        } catch (error) {
            this.logger.error(error)
            return `Ошибка на стороне AI попробуй еще раз`
        }
    }

    async get_templates(dto: GetAiTemplatesDto) {
        try {
            // Разбираем дату
            let data_parse: any = JSON.parse(dto.data)
            const analyzedExpenses = this.analyzeExpenses(data_parse);

            const stream = await openai.chat.completions.create({
                model: AI_MODEL,
                messages: [{
                    role: AI_MESSAGES_ROLE, content: `
                ${dto.text}
                Данные для анализа: ${analyzedExpenses}
                ` }],
            });
            if (stream)
                return stream.choices[0]?.message?.content
            return `Ошибка попробуй еще раз`
        } catch (error) {
            this.logger.error(error)
            return `Ошибка на стороне AI попробуй еще раз`
        }
    }

}
