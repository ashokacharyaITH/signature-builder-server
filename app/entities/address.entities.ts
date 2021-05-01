import {
    Entity,
    ManyToOne,
    Property,
} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {BaseEntities} from "./base.entities";
import { CompanyEntities } from "./company.entities";


@ObjectType()
@Entity()
export class AddressEntities extends BaseEntities{


    @Field()
    @Property()
    street!: string;

    @Field()
    @Property()
    post_code!: string;

    @Field()
    @Property()
    state!: string;

    @Field()
    @Property()
    country!: string;

    @Field()
    @Property()
    isDefault!: boolean; //

    @Field(() => CompanyEntities, { nullable: true })
    @ManyToOne(() => CompanyEntities, { nullable: true })
    public company?: CompanyEntities;


    constructor(options:any) {
        super();
        this.street = options.street;
        this.post_code= options.post_code;
        this.state = options.state;
        this.country = options.country;
        this.isDefault = options.isDefault;
        this.company=options.company;
    }



}
