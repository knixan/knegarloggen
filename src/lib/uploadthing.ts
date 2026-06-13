import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  jobbBilder: f({ image: { maxFileSize: "8MB", maxFileCount: 10 } })
    .middleware(async () => {
      // Här kan du lägga auth-check senare
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Uppladdad:", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
