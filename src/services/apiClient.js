import axios from "axios";
const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000",
  withCredentials: false,
  timeout: 30000,
});

export function downloadLink(file_path, s3Bucket) {
  const config = {
    params: {
      key: file_path,
    },
  };
  if (s3Bucket) {
    config.params.s3BucketName = s3Bucket;
  }
  console.log("call api client:", file_path)
  return apiClient.get("/download", config);
}
