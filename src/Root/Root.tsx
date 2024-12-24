import { useUserContext } from '../Context/UserContext';

interface FieldContent{
    thumbnail:string,
    bodyText:string
}

interface Result{
    id:number,
    fields:FieldContent,
    type:string,
    sectionName:string,
    webPublicationDate:string,
}

function Root(){

    const {state} = useUserContext();
    return (
        <div>
            {state.user?.username}
        </div>
    )
    
}

export default Root