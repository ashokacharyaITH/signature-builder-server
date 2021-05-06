import { Options } from '@mikro-orm/core';
import { MongoHighlighter } from '@mikro-orm/mongo-highlighter';
import {
  AccountEntities, AccountProfileEntities,
  AddressEntities,
  BaseEntities,
  CompanyEntities,
  LinkedPlatformEntities,
  PasswordHistoryEntities,
  PropertiesEntities,
  SignatureEntities,
  SocialDetailsEntities, SocialsEntities,
  SubscriptionEntities,
  TeamEntities,
  TemplateEntities,
  TokenEntities,
  UsersEntities,
  UserSignatureHistoryEntities
} from '../entities';
import { SignatureDraftEntities } from "../entities/signatureDraft.entities";

const options: Options = {
  type: 'mongo',
  clientUrl:`mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=${process.env.MONGO_DB}`,
  // clientUrl: `mongodb://${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}`,
   entities: [SocialsEntities,AccountProfileEntities,SignatureDraftEntities,TeamEntities,AccountEntities,AddressEntities,BaseEntities,CompanyEntities,LinkedPlatformEntities,PasswordHistoryEntities,PropertiesEntities,SignatureEntities,SocialDetailsEntities,SubscriptionEntities,TemplateEntities,TokenEntities,UsersEntities,UserSignatureHistoryEntities],
  // dbName:process.env.MONGO_DB,
  // user: process.env.MONGO_USERNAME,
  // password: process.env.MONGO_PASSWORD,
  highlighter: new MongoHighlighter(),
  debug: true,
  validate: true,
  strict: true,
  ensureIndexes: true,
};

export default options;
