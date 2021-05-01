import {Entity, PrimaryKey, Property, SerializedPrimaryKey} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import {Field, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export abstract class BaseEntities {
    @PrimaryKey()
    _id?: ObjectId;

    @Field(()=>String)
    @SerializedPrimaryKey()
    id!: string;

    @Field(()=>String)
    @Property()
    createdAt = new Date();

    @Field(()=>String)
    @Property({ onUpdate: () => new Date() })
    updatedAt = new Date();

}
