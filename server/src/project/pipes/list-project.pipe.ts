import {
  ValidationPipe,
  CollectionProperties,
  Expose
} from '@forlagshuset/nestjs-mongoose-paginate';
import { Injectable } from '@nestjs/common';

export class ListProjectQuery extends CollectionProperties {
  @Expose({ sortable: true })
  readonly created_at: 'desc' | 'asc';

  @Expose({ sortable: true, default: true, filterable: true })
  readonly name: 'desc' | 'asc';
}

@Injectable()
export class ListProjectPipe extends ValidationPipe {
  constructor() {
    super(ListProjectQuery);
  }
}