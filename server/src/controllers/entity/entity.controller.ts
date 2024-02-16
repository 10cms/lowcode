import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { CreateEntityDto, CreateEntitySchema } from '../../dto/create-entity.dto';
import { AjvValidationPipe } from 'src/pipes/ajv-validation.pipe';
import { EntityService } from 'src/services/entity/entity.service';

@Controller('entity')
export class EntityController {
  constructor(
    private entityService: EntityService,
  ) {}

  @Post()
  @UsePipes(new AjvValidationPipe(CreateEntitySchema))
  async create(@Body() createEntityDto: CreateEntityDto) {
    return await this.entityService.createEntity(createEntityDto);
  }

  @Get()
  async findMany() {
    return await this.entityService.findAll()
  }
}
