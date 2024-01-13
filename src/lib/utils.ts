import { type ClassValue, clsx } from "clsx"
import { Metadata } from "next/types"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const absoluteURL = (path: string) => {
  if(typeof window !== "undefined"){
    return path
  }
  if(process.env.DEPLOYED_URL) return `https://${process.env.DEPLOYED_URL}${path}`
  return `http://localhost:${process.env.PORT ?? 3000}/${path}`
}

export function constructMetadata({
  title = "Quill PDF",
  description = "Quill PDF is an open-source software to make chatting to your PDF files easy.",
  image = "/thumbnail.png",
  icons = "/favicon.ico",
  noIndex = false
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image
        }
      ]
    },
    icons,
    // metadataBase: new URL('https://quill-jet.vercel.app'),
    themeColor: '#FFF',
    ...(noIndex && {
      robots: {
        index: false,
        follow: false
      }
    })
  }
}