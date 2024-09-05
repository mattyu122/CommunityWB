package dev.communitywb.communityWB.Enum;

public enum S3BucketName {
    HANDBILL_BUCKET("handbillbucket");

    private final String bucketName;

    S3BucketName(String bucketName) {
        this.bucketName = bucketName;
    }

    @Override
    public String toString() {
        return bucketName;
    }
}
