import {Cascade, Collection, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, Property} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {BaseEntities} from "./base.entities";
import {AccountEntities} from "./account.entities";
import { UsersEntities } from "./users.entities";
import { TemplateEntities } from "./template.entities";
import { PropertiesEntities } from "./properties.entities";
import { SignatureDraftEntities } from "./signatureDraft.entities";




@ObjectType()
@Entity()
export class SignatureEntities extends BaseEntities{

    @Field({nullable:true})
    @Property()
    name?: string;

    @Field({nullable:true})
    @Property()
    campaign?: string;

    @Field(() => [UsersEntities], { nullable: true })
    @OneToMany(() => UsersEntities, (s:UsersEntities) => s.signature)
    users? = new Collection<UsersEntities>(this);

    @Field(() => AccountEntities,{nullable:true})
    @ManyToOne(() => AccountEntities,{ nullable: true })
    account!: AccountEntities;

    @Field(() => TemplateEntities,{nullable:true})
    @ManyToOne(() => TemplateEntities,{ nullable: true })
    template!: TemplateEntities;

    @Field(() => PropertiesEntities, { nullable: true })
    @OneToOne(() => PropertiesEntities, properties => properties.signature,{owner: true, orphanRemoval: true})
    properties?: PropertiesEntities;

    @Field({nullable:true})
    @Property()
    hasDraft: boolean=false; //


    @Field(() => SignatureDraftEntities, { nullable: true })
    @OneToOne(() => SignatureDraftEntities, draft => draft.signature,{owner: true, orphanRemoval: true})
    draft!: SignatureDraftEntities;

    constructor(options:any) {
        super();
        this.campaign = options.campaign;
        this.account = options.account;
        this.template = options.template;
        this.properties = options.properties;
        this.name = options.name;
    }



}
