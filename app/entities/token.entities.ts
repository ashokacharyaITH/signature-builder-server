import { Entity, Property, OneToMany, Cascade, Collection, Embeddable, OneToOne, Enum } from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {BaseEntities} from "./base.entities";
import { AccountEntities } from "./account.entities";
import { LinkedPlatformEntities } from "./linkedPlatform";
export enum OwnerTokenType {
    account = 'account',
    user = 'user',
}
export enum TokenType {
    hubspot = 'hubspot',
    gmail = 'gmail',
}

@ObjectType()
@Entity()
export class TokenEntities extends BaseEntities{
    @Field()
    @Property()
    token!: string; //refreshtoken

    @Property()
    accessToken!: string;  //forhubspot

    @Field()
    @Property()
    expiry!: Number;  //for hubspot and google

    @Field()
    @Enum(() => OwnerTokenType)
    ownerType!: OwnerTokenType;

    @Field()
    @Enum(() => TokenType)
    tokenType!: TokenType;

    @Field(() => AccountEntities, { nullable: true })
    @OneToOne(() => AccountEntities, account => account.hub_token)
    account?: AccountEntities;

    @Field(() => LinkedPlatformEntities, { nullable: true })
    @OneToOne(() => LinkedPlatformEntities, linkplatform => linkplatform.token)
    linkedPlatform?: LinkedPlatformEntities;

    public checkSet(options:any){
        switch (this.tokenType){
            case TokenType.hubspot :{
                this.account = options.account;
                this.ownerType = OwnerTokenType.account;
                break;
            }
            case TokenType.gmail :{
                this.account = options.user;
                this.ownerType = OwnerTokenType.user;
                break;
            }
            default :{
                this.account = options.account;
                this.ownerType = OwnerTokenType.account;
                break;
            }
        }
    }
    constructor(options:any) {
        super();
        this.token = options.token;
        this.expiry = options.expiry;
        this.tokenType = options.tokenType;
        if(options.accessToken){
            this.accessToken = options.accessToken;
        }
        this.checkSet(options)

    }

}
