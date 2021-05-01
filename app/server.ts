import 'reflect-metadata';
import "dotenv/config";
import express from 'express';
import cors from "cors"
import cookieParser from "cookie-parser";

import {ApolloServer,UserInputError} from 'apollo-server-express';
import {buildSchema} from 'type-graphql';
import session from 'express-session';

import { EntityManager, EntityRepository, MikroORM, RequestContext } from '@mikro-orm/core';

import {
    AccountEntities,
    TokenEntities,
    SubscriptionEntities,
    SocialDetailsEntities, UsersEntities, SignatureEntities, LinkedPlatformEntities, TemplateEntities
} from './entities';
 import {initializeJWT} from "./service";
import {
    AccountResolver,
    HubspotResolver,
    SocialResolver,
    OnBoardResolver,
    GoogleResolver,
    TemplateResolver,
    SignatureResolver,
    UserResolver,
    TeamResolver
} from "./resolvers";

import {responseValidator} from "./validator";
import {AccountRouter} from "./middleware";
import { graphqlUploadExpress } from "graphql-upload";
import { initializeS3 } from "./service/stream.upload/s3.stream.upload";
import { SignatureDraftEntities } from "./entities/signatureDraft.entities";


//Initialize the Data Injection for mikrorm
export const DI = {} as {
  orm: MikroORM,
  em: EntityManager,
  AccountRepository: EntityRepository<AccountEntities>,
  UsersRepository: EntityRepository<UsersEntities>,
  TokenRepository: EntityRepository<TokenEntities>,
  SubscriptionRepository: EntityRepository<SubscriptionEntities>,
  SocialDetailsRepository:EntityRepository<SocialDetailsEntities>,
  SignatureRepository:EntityRepository<SignatureEntities>,
    SignatureDraftRepository:EntityRepository<SignatureDraftEntities>,
  LinkedPlatformRepository:EntityRepository<LinkedPlatformEntities>,
    TemplateRepository:EntityRepository<TemplateEntities>,
};
const port = process.env.PORT || 4000;

(async () => {

  //set value for DI
  DI.orm = await MikroORM.init();
  DI.em = DI.orm.em;
  DI.UsersRepository = DI.orm.em.getRepository(UsersEntities);
  DI.AccountRepository=DI.orm.em.getRepository(AccountEntities);
  DI.TokenRepository = DI.orm.em.getRepository(TokenEntities);
  DI.SubscriptionRepository = DI.orm.em.getRepository(SubscriptionEntities);
  DI.SocialDetailsRepository = DI.orm.em.getRepository(SocialDetailsEntities);
  DI.SignatureRepository = DI.orm.em.getRepository(SignatureEntities);
  DI.SignatureDraftRepository = DI.orm.em.getRepository(SignatureDraftEntities);
  DI.LinkedPlatformRepository = DI.orm.em.getRepository(LinkedPlatformEntities);
  DI.TemplateRepository = DI.orm.em.getRepository(TemplateEntities);
  initializeS3({region:'ap-southeast-2',accessKeyId:process.env.AWS_ACCESS_KEY as string,secretAccessKey:process.env.AWS_ACCESS_SECRET as string,destinationBucketName:'signaturebuilder-test'})

  const app = express();

  app.use(cors({
        origin:["http://localhost:3000","http://localhost:3001"],
        credentials:true
      })
  )
  //initialize the session for server
  app.use(
      session({
        secret: process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: true,
      })
  );
  app.use(express.json()); // parse in json

  app.use((req, res, next) => RequestContext.create(DI.orm.em, next)); // make em available throughout the middlewares


  app.use(cookieParser()); //cookie parse

 await initializeJWT(DI.orm); //initialize JWT


  const apolloServer = new ApolloServer({
    uploads:false,
    schema:await buildSchema({
      resolvers:[AccountResolver,SocialResolver,HubspotResolver,OnBoardResolver,GoogleResolver,TemplateResolver,SignatureResolver,UserResolver,TeamResolver], //initialise the resolver for graphql appolo server
      validate: async (argValue:any) => {
        const response = await responseValidator(argValue);  //validate the structure of object
        if (response) {
          throw new UserInputError(
              'Failed to get events due to validation errors', response
          );
        }
      },
    }),
    context:({req,res})=>({req,res,em:DI.orm.em}) // make req,res,em avialable in graphql server context
  })
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 })); //file size
  apolloServer.applyMiddleware({app,cors:false, path: '/graphql'}); //graphql Router
  //
  app.use('/account', AccountRouter); // for refresh token and other for account, basically handling browser cookies
  app.use((req, res) => res.status(404).json({ message: 'No route found!!' })); //404

  app.listen(port, () => {
    console.log(`MikroORM express TS example started at http://localhost:${port}`); //message
  });
})().catch(err=>{
  console.log(err);
});
