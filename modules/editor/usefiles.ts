import ALLFILES from "@/data/bucketfiles.json";

export const useFiles = () => {
  ALLFILES.sort((a, b) => (a.LastModified < b.LastModified ? 1 : -1));
  return ALLFILES;
};
