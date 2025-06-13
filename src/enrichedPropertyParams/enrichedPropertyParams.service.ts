import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnrichedPropertyParams } from 'src/entities/enrichedPropertyParams.entity';
import { EnrichPropertyParamsDto } from 'src/dto/enrichPropertyParams.dto';
import { EnrichedPropertyParamsResponseDto } from 'src/dto/enrichedPropertyParamsResponse.dto';

@Injectable()
export class EnrichedPropertyParamsService {
  private readonly AI_SERVICE_URL =
    process.env.AI_SERVICE_URL || 'http://localhost:8000/enrichPropertyParams';

  constructor(
    private httpService: HttpService,
    @InjectRepository(EnrichedPropertyParams)
    private enrichedPropertyParamsRepository: Repository<EnrichedPropertyParams>,
  ) {}

  async callAiService(dto: EnrichPropertyParamsDto): Promise<EnrichedPropertyParamsResponseDto> {
    const response = await this.httpService.axiosRef.post(this.AI_SERVICE_URL, dto); // 👈 Ahora es un string seguro
    return response.data as EnrichedPropertyParamsResponseDto;
  }

  async saveEnrichedPropertyParams(
    dto: EnrichedPropertyParamsResponseDto,
  ): Promise<EnrichedPropertyParams> {
    const enrichedPropertyParams = this.enrichedPropertyParamsRepository.create(dto);
    return await this.enrichedPropertyParamsRepository.save(enrichedPropertyParams);
  }

  async enrichPropertyParams(
    dto: EnrichPropertyParamsDto,
  ): Promise<EnrichedPropertyParamsResponseDto> {
    const aiResponse = await this.callAiService(dto);
    await this.saveEnrichedPropertyParams(aiResponse);
    return aiResponse;
  }
}
