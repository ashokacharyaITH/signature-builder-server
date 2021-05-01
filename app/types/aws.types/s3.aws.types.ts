import { ReadStream } from "fs";
import * as stream from "stream";
import { Field, InputType, ObjectType } from "type-graphql";
import { IsString } from "class-validator";
export type S3UploadConfig = {
    accessKeyId: string;
    secretAccessKey: string;
    destinationBucketName: string;
    region?: string;
};
export type S3UploadStream = {
    writeStream: stream.PassThrough;
    promise: Promise<AWS.S3.ManagedUpload.SendData>;
};
export type File = {
    filename: string;
    mimetype: string;
    encoding: string;
    stream?: ReadStream;
}
@InputType()
export class FileInput {
    @Field()
    @IsString()
    file!:string


}
@ObjectType()
export class UploadedFileResponse {
    @Field()
    filename?: String
    @Field()
    mimetype?: String
    @Field()
    encoding?: String
    @Field()
    url?: String
}
