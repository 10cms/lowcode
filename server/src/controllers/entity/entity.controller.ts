import { Controller } from '@nestjs/common';

@Controller('entity')
export class EntityController {
  constructor(
  ) {}

  // @Post()
  // @UsePipes(new AjvValidationPipe(CreateEntitySchema))
  // async create(
  //   @Body() createEntityDto: CreateEntityDto
  // ) {
  //   return await this.entityService.create(createEntityDto);
  // }

  // @Patch()
  // @UsePipes(new AjvValidationPipe(UpdateEntitySchema))
  // async update(@Body() updateEntityDto: UpdateEntityDto) {
  //   return await this.entityService.updateOne(updateEntityDto);
  // }

  // @Delete()
  // @UsePipes(new AjvValidationPipe(DeleteEntitySchema))
  // async delete(@Body() deleteEntityDto: DeleteEntityDto) {
  //   return await this.entityService.deleteOne(deleteEntityDto);
  // }

  // @Get()
  // @UsePipes(new AjvValidationPipe(SearchEntitySchema))
  // async findMany(
  //   @Query() searchEntityDto: SearchEntityDto
  // ) {
  //   return await this.entityService.findMany(searchEntityDto)
  // }
}