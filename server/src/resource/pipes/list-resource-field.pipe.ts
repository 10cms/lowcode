import {
  ValidationPipe,
  CollectionProperties,
  Expose
} from '@forlagshuset/nestjs-mongoose-paginate';
import { Injectable } from '@nestjs/common';

export class ListResourceFieldQuery extends CollectionProperties {
  @Expose({ sortable: true })
  readonly created_at: 'desc' | 'asc';

  @Expose({ filterable: true })
  readonly resource: 'string';
}

@Injectable()
export class ListResourceFieldPipe extends ValidationPipe {
  constructor() {
    super(ListResourceFieldQuery);
  }
}