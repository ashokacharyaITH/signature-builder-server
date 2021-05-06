import {Cascade, Collection, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, Property} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {BaseEntities} from "./base.entities";
import {AccountEntities} from "./account.entities";
import { AddressEntities } from "./address.entities";
import { SocialsEntities } from "./socials.entities";




@ObjectType()
@Entity()
export class CompanyEntities extends BaseEntities{

    @Field()
    @Property()
    image?: string;

    @Field()
    @Property()
    name!: string;

    @Field()
    @Property()
    url!: string;

    @Field()
    @Property()
    phone!: string;

    @Field()
    @Property()
    footnote!: string;


    @Field(() => [AddressEntities], { nullable: true })
    @OneToMany(() => AddressEntities, (s:AddressEntities) => s.company, { cascade: [Cascade.ALL] })
    address? = new Collection<AddressEntities>(this);

    @Field(() => [SocialsEntities], { nullable: true })
    @OneToMany(() => SocialsEntities, (s:SocialsEntities) => s.company, { cascade: [Cascade.ALL] })
    socials? = new Collection<SocialsEntities>(this);

    @Field(() => AccountEntities, { nullable: true })
    @OneToOne(() => AccountEntities, account => account.company)
    account?: AccountEntities;


    constructor(options:any) {
        super();
        this.name = options.name;
        this.image = options.image;
        this.url = options.url;
        this.phone = options.phone;
        this.footnote = options.footnote;
        this.account=options.account;
    }



}
