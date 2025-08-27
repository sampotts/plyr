import { PutObjectCommand } from '@aws-sdk/client-s3';
import mime from 'mime';
import through from 'through2';

export function publish(client, bucket, headers = {}) {
  return through.obj(async function (file, _, callback) {
    if (!file.isBuffer()) return callback(null, file);

    // Use the relative path as the key
    const key = file.relative.replace(/\\/g, '/'); // Ensure forward slashes for S3 keys

    // Determine the MIME type of the file
    const contentType = mime.getType(file.path) || 'application/octet-stream';

    try {
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: file.contents,
          ContentType: contentType, // Set the MIME type
          CacheControl: headers['Cache-Control'], // Use provided Cache-Control header
        }),
      );

      console.warn(`Uploaded: ${key} (Content-Type: ${contentType})`);
      this.push(file);
      callback();
    }
    catch (err) {
      callback(err);
    }
  });
}
