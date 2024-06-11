import useFetchOnLoad from '../CustomHooks/useFetchOnLoad';

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
    
    const {results, isLoading} = useFetchOnLoad<Result[]>("search?page=2&q=debate&show-fields=thumbnail,bodyText")
    console.log(results)
    return (
        <div>
            {results && results.length > 0 && !isLoading ? results.map((result) => <h1>{result.fields.bodyText}</h1>) : "xd"}
        </div>
    )
    
}

export default Root