import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetAiReqDto } from './dto/reqwest-ai.dto'
import { OpenAiService } from './open-ai.service'
import { GetAiTemplatesDto } from './dto/templates-ai.dto'
import { GetAiHistoryDto } from './dto/history.dto'

@ApiTags('open-ai')
@Controller('open-ai')
export class OpenAiController {
    constructor(
        private OpenAiService: OpenAiService
    ) { }
    // @ApiOperation({ summary: 'Простой запрос к AI' })
    // @ApiResponse({ status: 200 })
    // @Post('/get')
    // @HttpCode(HttpStatus.OK)
    // get(@Body() dto: GetAiReqDto) {
    //     return this.OpenAiService.getCompletions(dto.text)
    // }

    // @ApiOperation({ summary: 'Запрос к ai с историей' })
    // @ApiResponse({ status: 200 })
    // @Post('/get/history')
    // @HttpCode(HttpStatus.OK)
    // get_history(@Body() dto: GetAiHistoryDto) {
    //     return this.OpenAiService.getHistory(dto.messages)
    // }

    // @ApiOperation({ summary: 'Запрос к AI по шаблону' })
    // @ApiResponse({ status: 200 })
    // @Post('/get/templates')
    // @HttpCode(HttpStatus.OK)
    // get_templates(@Body() dto: GetAiTemplatesDto) {
    //     return this.OpenAiService.get_templates(dto)
    // }
}
