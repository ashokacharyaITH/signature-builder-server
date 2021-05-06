import {
    Entity,
    Property,
} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {BaseEntities} from "./base.entities";



@ObjectType()
@Entity()
export class SocialDetailsEntities extends BaseEntities{

    @Field()
    @Property()
    name!: string;

    @Field()
    @Property()
    icon_round!: string;


    @Field()
    @Property()
    icon_solid!: string;

    @Field()
    @Property()
    icon_square!: string;

    @Field()
    @Property()
    priority!: boolean; //if set true it will apear in forms as first class socials

    constructor(options:any) {
        super();
        this.name = options.name;
        this.icon_round= options.icon_round;
        this.icon_solid = options.icon_solid;
        this.icon_square = options.icon_square;
        this.priority= options.priority;
    }



}
