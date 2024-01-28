import { useMessage } from "@/app/context/message-context";
import Loader from "./loader";

export default function PageLoader(){

    const { pageLoad } = useMessage();

    if(!pageLoad) return null;

    return <div className="page-load">
        <Loader />
    </div>

}