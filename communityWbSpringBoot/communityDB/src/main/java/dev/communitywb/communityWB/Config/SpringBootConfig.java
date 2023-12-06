package dev.communitywb.communityWB.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;

@Configuration
public class SpringBootConfig{

    private AWSCredentials credentials = new BasicAWSCredentials("AKIAUH4S5SDKHBYZZLMS", "vRs3JCFERJZ9l3m+LqERK7/mnIl3XZj2ogguzBlh");
    @Bean
    public AmazonS3 s3client(){
        return AmazonS3ClientBuilder
                .standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion(Regions.US_EAST_1)
                .build();
    }
}