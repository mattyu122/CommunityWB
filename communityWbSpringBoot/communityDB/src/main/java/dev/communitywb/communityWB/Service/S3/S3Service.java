package dev.communitywb.communityWB.Service.S3;

import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;

@Service
public class S3Service {

    @Autowired
    private AmazonS3 s3client;

    public String uploadFile(String bucketName, MultipartFile file) throws IOException {
        String key = "file-" + UUID.randomUUID().toString() + "-" + file.getOriginalFilename();

        try {
            // Prepare the metadata for the file
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.getSize());
            metadata.setContentType(file.getContentType());

            // Create a PutObjectRequest passing the folder name, file name, and file input stream
            PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, key, file.getInputStream(), metadata);

            // Upload the file
            s3client.putObject(putObjectRequest);

            // Return the file's URL (assuming the bucket is public)
            return String.format("https://%s.s3.amazonaws.com/%s", bucketName, key);
        } catch (AmazonServiceException e) {
            throw new IOException("Error uploading file to S3: " + e.getMessage(), e);
        }
    }
}
