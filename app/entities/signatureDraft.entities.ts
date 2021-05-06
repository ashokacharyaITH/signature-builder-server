import {Cascade, Collection, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, Property} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {BaseEntities} from "./base.entities";
import { TemplateEntities } from "./template.entities";
import { PropertiesEntities } from "./properties.entities";
import { SignatureEntities } from "./signature.entities";




@ObjectType()
@Entity()
export class SignatureDraftEntities extends BaseEntities{

    @Field()
    @Property()
    name?: string;


    @Field()
    @Property()
    campaign?: string;

    @Field(() => TemplateEntities)
    @ManyToOne(() => TemplateEntities,{ nullable: true })
    template!: TemplateEntities;

    @Field(() => PropertiesEntities, { nullable: true })
    @OneToOne(() => PropertiesEntities, properties => properties.draft,{owner: true, orphanRemoval: true})
    properties?: PropertiesEntities;

    @Field(() => SignatureEntities, { nullable: true })
    @OneToOne(() => SignatureEntities, signature => signature.draft)
    signature?: SignatureEntities;

    constructor(options:any) {
        super();
        this.campaign = options.campaign;
        this.template = options.template;
        this.properties = options.properties;
        this.name = options.name;
    }



}
