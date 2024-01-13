"use client"
import React, { PropsWithChildren, ReactNode, useState } from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { trpc } from '@/app/_trpc/client';
import { httpBatchLink } from '@trpc/client';
import { absoluteURL } from '@/lib/utils';

type ProvidersProps = {
    children: ReactNode
};

const Providers:React.FC<ProvidersProps> = ({children}) => {
    const [queryClient] = useState(() => new QueryClient())
    const [trpcClient] = useState(() => trpc.createClient({
        links: [
            httpBatchLink({
                url: absoluteURL("/api/trpc"),
            })
        ]
    }))
    
    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient} >
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </trpc.Provider>
    )
}
export default Providers;