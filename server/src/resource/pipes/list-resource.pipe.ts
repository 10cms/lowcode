import {
  ValidationPipe,
  CollectionProperties,
  Expose
} from '@forlagshuset/nestjs-mongoose-paginate';
import { Injectable } from '@nestjs/common';

export class ListResourceQuery extends CollectionProperties {
  @Expose({ sortable: true })
  readonly created_at: 'desc' | 'asc';

  @Expose({ filterable: true })
  readonly project: 'string';
}

@Injectable()
export class ListResourcePipe extends ValidationPipe {
  constructor() {
    super(ListResourceQuery);
  }
}