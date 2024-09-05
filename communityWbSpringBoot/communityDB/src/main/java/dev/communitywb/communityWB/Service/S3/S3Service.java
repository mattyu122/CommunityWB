package dev.communitywb.communityWB.Service.S3;

import java.io.IOException;
import java.time.Duration;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

@Service
public class S3Service {

    @Autowired
    private S3Client s3client;

    @Autowired
    private S3Presigner s3Presigner;

    public String uploadFile(String bucketName, MultipartFile file) throws IOException {
        String key = "file-" + UUID.randomUUID().toString() + "-" + file.getOriginalFilename();

        try {
            // Create a PutObjectRequest
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .contentLength(file.getSize())
                    .build();

            // Upload the file
            s3client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            // Return the file's key
            return key;
        } catch (S3Exception e) {
            throw new IOException("Error uploading file to S3: " + e.getMessage(), e);
        }
    }

    public String getFile(String bucketName, String key) throws IOException {
        try {
            // Create a GetObjectPresignRequest
            GetObjectPresignRequest getObjectPresignRequest = GetObjectPresignRequest.builder()
                    .getObjectRequest(builder -> builder.bucket(bucketName).key(key).build())
                    .signatureDuration(Duration.ofMinutes(10))
                    .build();

            // Generate the presigned URL
            PresignedGetObjectRequest presignedGetObjectRequest = s3Presigner.presignGetObject(getObjectPresignRequest);

            // Return the presigned URL
            return presignedGetObjectRequest.url().toString();
        } catch (S3Exception e) {
            throw new IOException("Error getting file from S3: " + e.getMessage(), e);
        }
    }
}
