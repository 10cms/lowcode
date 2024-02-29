import { Mocker } from "fakingoose";
import { GenericObject } from "fakingoose/dist/types";
import { Model } from "mongoose";
import { FactoryCreator } from "./factories";

export type TestingHelper<ServiceType, ModelType, DocType> = {
  service: ServiceType;
  model: ModelType;
  make: (data?: Partial<DocType>) => Partial<DocType>;
  makeMany: (count: number, data?: Partial<DocType>) => Partial<DocType>[];
  create: (data?: Partial<DocType>) => Promise<DocType>;
  createMany: (count: number, data?: Partial<DocType>) => Promise<DocType[]>;
}

export const createTestingHelper = 
  <ServiceType, ModelType extends Model<any>, DocType extends GenericObject>
  (service: ServiceType, model: ModelType, factorCreator: FactoryCreator<DocType>) => {
  const factory = factorCreator(model)

  const make = (data?: Partial<DocType>) => {
    return factory.generate(data)
  }
  const makeMany = (count: number, data?: Partial<DocType>) => {
    return Array.from({ length: count }, () => factory.generate(data))
  }
  const create = async (data?: Partial<DocType>) => {
    return await model.create(factory.generate(data))
  }
  const createMany = async (count: number, data?: Partial<DocType>) => {
    return await model.create(makeMany(count, data))
  }

  return {
    service,
    model,
    make,
    makeMany,
    create,
    createMany
  } as TestingHelper<ServiceType, ModelType, DocType>
}