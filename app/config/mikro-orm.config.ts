import { Options } from '@mikro-orm/core';
import { MongoHighlighter } from '@mikro-orm/mongo-highlighter';
import {
  AccountEntities,
  AddressEntities,
  BaseEntities,
  CompanyEntities,
  LinkedPlatformEntities,
  PasswordHistoryEntities,
  PropertiesEntities,
  SignatureEntities,
  SocialDetailsEntities,
  SocialsEntities,
  SubscriptionEntities,
  SubscriptionPlanEntities,
  TeamEntities,
  TemplateEntities,
  TokenEntities,
  UsersEntities,
  UserSignatureHistoryEntities
} from '../entities';
import { SignatureDraftEntities } from "../entities/signatureDraft.entities";

const options: Options = {
  type: 'mongo',
  clientUrl: `mongodb://${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}`,
  entities: [SignatureDraftEntities,TeamEntities,AccountEntities,AddressEntities,BaseEntities,CompanyEntities,LinkedPlatformEntities,PasswordHistoryEntities,PropertiesEntities,SignatureEntities,SocialDetailsEntities,SocialsEntities,SubscriptionEntities,SubscriptionPlanEntities,TemplateEntities,TokenEntities,UsersEntities,UserSignatureHistoryEntities],
  dbName:process.env.MONGO_DB,
  // user: process.env.MONGO_USERNAME,
  // password: process.env.MONGO_PASSWORD,
  highlighter: new MongoHighlighter(),
  debug: true,
  validate: true,
  strict: true,
  ensureIndexes: true,
};

export default options;
