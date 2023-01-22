import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { AttachmentData } from '../models/AttachmentItem'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})

const bucketName = process.env.ATTACHMENT_S3_BUCKET

export const Attachment = (attachmentId: string) : AttachmentData => {
    
    const putObject = s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: attachmentId,
        Expires: Number(process.env.SIGNED_URL_EXPIRATION)
    })
    const uploadUrl = `https://${bucketName}.s3.amazonaws.com/${attachmentId}`

    return {
        putObject,
uploadUrl
    }
}