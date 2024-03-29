import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { pinecone } from "@/lib/pinecone";

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { PLANS } from "@/config/stripe";

const f = createUploadthing();

const middleware = async () => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user || !user.id) throw new Error('Unauthorized')

  const subscriptionPlan = await getUserSubscriptionPlan()

  return { subscriptionPlan, userId: user.id }
}


const onUploadComplete = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>
  file: {
    key: string
    name: string
    url: string
  }
}) => {
  const isFileExist = await db.file.findFirst({
    where: {
      key: file.key,
    },
  })

  if (isFileExist) return
  
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
  try {
    // reading pdf data
    const response = await fetch(createFile.url);
    const blob = await response.blob();
    const loader = new PDFLoader(blob);
    const pagelevelDocs = await loader.load();
    const pageAmt = pagelevelDocs.length;

    const {subscriptionPlan} = metadata
    const {isSubscribed} = subscriptionPlan

    const isProExceeded = pageAmt > PLANS.find((plan) => plan.name === "Pro")!.pagesPerPdf
    const isFreeExceeded = pageAmt > PLANS.find((plan) => plan.name === "Free")!.pagesPerPdf

    if((isSubscribed && isProExceeded) || (!isSubscribed && isFreeExceeded)){
      await db.file.update({
        data:{
          uploadStatus: "FAILED"
        }, where:{
          id: createFile.id
        }
      })
    }

    // vectorize

    const pineconeIdx = pinecone.Index("quill-pdf");
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    await PineconeStore.fromDocuments(pagelevelDocs, embeddings, {
      pineconeIndex: pineconeIdx,
      namespace: createFile.id,
    });

    await db.file.update({
      data: { uploadStatus: "SUCCESS" },
      where: {
        id: createFile.id,
      },
    });
  } catch (error) {
    await db.file.update({
      data: { uploadStatus: "FAILED" },
      where: {
        id: createFile.id,
      },
    });
    console.log(error);
  }
}



export const ourFileRouter = {
  freePlanUploader: f({ pdf: { maxFileSize: '4MB' } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
  proPlanUploader: f({ pdf: { maxFileSize: '16MB' } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter;
