import {
    Entity, Enum,
    ManyToOne, OneToOne,
    Property,
} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {BaseEntities} from "./base.entities";
import { CompanyEntities } from "./company.entities";
import { UsersEntities } from "./users.entities";
import { AccountProfileEntities } from "./accountProfile.entities";
export enum OwnerSocialType {
    company = 'company', // master admin of market place
    user = 'user', // admin of app
    profile = 'profile', // admin of app
}


@ObjectType()
@Entity()
export class SocialsEntities extends BaseEntities{

    @Field(() => String, { nullable: true })
    @Property()
    link!: string;

    @Field(() => String, { nullable: true })
    @Enum(() => OwnerSocialType)
    ownerType!: OwnerSocialType;

    @Field(() => String, { nullable: true })
    @Property()
    details?: string;


    @Field(() => CompanyEntities, { nullable: true })
    @ManyToOne(() => CompanyEntities, { nullable: true })
    company?: CompanyEntities;

    @Field(() => UsersEntities, { nullable: true })
    @ManyToOne(() => UsersEntities, { nullable: true })
    user?: UsersEntities;

    @Field(() => AccountProfileEntities, { nullable: true })
    @ManyToOne(() => AccountProfileEntities, { nullable: true })
    profile?: AccountProfileEntities;

    public checkSet(options:any){
        switch (this.ownerType){
            case OwnerSocialType.company :{
                this.company = options.company;
                break;
            }
            case OwnerSocialType.user :{
                this.user = options.user;
                break;
            }
            case OwnerSocialType.profile :{
                this.profile = options.profile;
                break;
            }
            default :{
                this.company = options.company;
                break;
            }
        }
    }
    constructor(options:any) {
        super();
        this.link = options.link;
        this.details= options.details;
        this.ownerType = options.ownerType;
        this.checkSet(options)
    }
}