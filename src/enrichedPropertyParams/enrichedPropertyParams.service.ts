import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnrichedPropertyParams } from 'src/ai-integration/entity/enrichedPropertyParams.entity';
import { EnrichPropertyParamsDto } from 'src/ai-integration/dto/enrichPropertyParams.dto';
import { EnrichedPropertyParamsResponseDto } from 'src/ai-integration/dto/enrichedPropertyParamsResponse.dto';
import { NotFoundException } from '@nestjs/common';

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
    const response = await this.httpService.axiosRef.post(this.AI_SERVICE_URL, dto);
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

  /**
   * Obtiene una ficha enriquecida ya guardada.
   * @param propertyId - Identificador único de la propiedad
   * @throws NotFoundException si no se encuentra la ficha
   * @returns Objeto `EnrichedPropertyParamsResponseDto`
   */
  async getEnrichedPropertyParams(propertyId: string): Promise<EnrichedPropertyParamsResponseDto> {
    const result = await this.enrichedPropertyParamsRepository.findOneBy({ propertyId });
    if (!result) {
      throw new NotFoundException(
        `No se encontró una ficha enriquecida para la propiedad ${propertyId}`,
      );
    }

    return {
      title: result.title,
      description: result.description,
      priceEstimate: result.priceEstimate,
      recommendedPhotos: result.recommendedPhotos || [],
      qualityOfLifeScore: result.qualityOfLifeScore,
      locationDetails: result.locationDetails,
    };
  }
}
