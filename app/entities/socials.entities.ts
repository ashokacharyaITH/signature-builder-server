import {
    Entity, Enum,
    ManyToOne, OneToOne,
    Property,
} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {BaseEntities} from "./base.entities";
import { CompanyEntities } from "./company.entities";
import { SocialDetailsEntities } from "./socialDetails.entities";
import { UsersEntities } from "./users.entities";
export enum OwnerSocialType {
    company = 'company', // master admin of market place
    user = 'user', // admin of app
}


@ObjectType()
@Entity()
export class SocialsEntities extends BaseEntities{

    @Field()
    @Property()
    link!: string;

    @Field()
    @Enum(() => OwnerSocialType)
    ownerType!: OwnerSocialType;

    @Field(() => SocialDetailsEntities, { nullable: true })
    @OneToOne(() => SocialDetailsEntities)
    details?: SocialDetailsEntities;


    @Field(() => CompanyEntities, { nullable: true })
    @ManyToOne(() => CompanyEntities, { nullable: true })
    company?: CompanyEntities;

    @Field(() => UsersEntities, { nullable: true })
    @ManyToOne(() => UsersEntities, { nullable: true })
    user?: UsersEntities;

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
