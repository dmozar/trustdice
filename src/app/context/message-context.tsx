import { DatabaseService } from "@/services/database.service";
import React, { useEffect, useState } from "react";
import { CatalogItem, CatalogGroup, Country, MessageType, MessageOptions, Message } from "@/types"
import MessageBox from "@/components/message-box";
import PageLoader from "@/components/page-loader";



export const MessageContext = React.createContext({
    open: false,
    data: null as Message | null,
    pageLoad: false,
    showMessage: (title:string, text:string|React.ReactNode, type: MessageType, options:MessageOptions) => {},
    closeMessage: () => {},
    setPageLoad: (status:boolean) => {}
});


function MessageProvider({ children }: { children: React.ReactNode }) {

    let timeout:any = null;

    const [open, setOpen] = useState(false)

    const [data, setData] = useState<Message|null>(null)

    const [pageLoad, setPageLoad] = useState(false)
    
    const showMessage = (title:string, text:string | React.ReactNode, type: MessageType, options: MessageOptions) => {
        setData({
            title,
            text,
            type,
            options
        })
    }

    const closeMessage = () => {
        setOpen(false);

        if(timeout) clearTimeout(timeout);

        timeout = setTimeout(()=>{
            setData(null);
        }, 500);
    }

    useEffect(()=>{
        
        setOpen(!!data);

        return () => {
            if(timeout) clearTimeout(timeout);
        }
        
    }, [data])


    return <MessageContext.Provider value={{pageLoad, open, data, showMessage, closeMessage, setPageLoad}}>
        {children}
        <MessageBox />
        <PageLoader />
    </MessageContext.Provider>;
}

export default MessageProvider;

export const useMessage = () => React.useContext(MessageContext);