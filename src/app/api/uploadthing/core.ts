import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();
      if (!user || !user.id) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: file.url,
          // `http://uploadthing-pro.s3.us-west-2.amazonaws.com/f/${file.key}`, //gets the file's user directly from S3, Using this approach coz url from file.url gets timed out after sometime
          uploadStatus: "PROCESSING",
        },
      });
    }),
    
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
