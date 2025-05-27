import { PartialType } from '@nestjs/swagger';
import { CreateCrawlingDto } from './create-crawling.dto';

export class UpdateCrawlingDto extends PartialType(CreateCrawlingDto) {}
