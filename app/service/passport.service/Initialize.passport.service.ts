import passportJwt from "passport-jwt";
import {AccountEntities} from "../../entities";
import passport from "passport";

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;


const authoriseAccountToken = async (token:any,orm: any,done:passportJwt.VerifiedCallback) => {
    const user = await orm.em.findOne(AccountEntities,{ id: token.accountId },['users','signatures','company','subscription']);
    if (!user) { return done({error:"error"}, false); }
    if (user) {
        return done(null, user , token);
    } else {
        return done(null, false);
    }
}
export const initializeJWT =async (orm: any) =>{
    passport.use(new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.ACCESS_TOKEN_SECRET!
        }, async (jwtToken, done):Promise<any>=>{
            return authoriseAccountToken(jwtToken,orm,done);
        }));
}
