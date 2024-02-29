import { CollectionDto, CollectionResponse, DocumentCollector } from "@forlagshuset/nestjs-mongoose-paginate";

export class ListQuery<T> extends DocumentCollector<T> {
  async find(query: CollectionDto): Promise<CollectionResponse<T>> {
    /**
     * The query.page should be 1-based, but the DocumentCollector is 0-based.
     */
    if (query.page) {
      // @ts-ignore
      query.page = query.page - 1;
    }

    return super.find(query);
  }
}