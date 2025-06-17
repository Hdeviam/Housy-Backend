import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { EnrichedPropertyResponseDto } from 'src/ai-integration/dto/enrichedPropertyResponse.dto';
import { EnrichPropertyParamsDto } from 'src/ai-integration/dto/enrichPropertyParams.dto';

@Injectable()
export class AiIntegrationService {
  constructor(private httpService: HttpService) {}

  private readonly AI_SERVICE_URL =
    process.env.AI_SERVICE_URL || 'http://localhost:8000/enrich-property';

  async enrichPropertyParams(dto: EnrichPropertyParamsDto): Promise<EnrichedPropertyResponseDto> {
    const response = await this.httpService.axiosRef.post(this.AI_SERVICE_URL, dto);
    return response.data as EnrichedPropertyResponseDto;
  }
}
