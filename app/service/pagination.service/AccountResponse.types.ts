import { ObjectType } from "type-graphql";
import relayTypes from "./relay.types";
import { AccountEntities } from "../../entities";

@ObjectType()
export default // @ts-ignore
class AccountResponseTypes extends relayTypes<AccountEntities>(AccountEntities) { }