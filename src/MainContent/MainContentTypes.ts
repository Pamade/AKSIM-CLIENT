export interface ArticleGuardian{
    apiUrl:string,
    id:string,
    isHosted:string,
    pillarId:string,
    sectionId:string,
    sectionName:string,
    type:string,
    webPublicationDate:string,
    webTitle:string,
    webUrl:string
    fields:{
        body:string | TrustedHTML,
        thumbnail?:string,
    }
}

export interface GuardianApi{
    response:{
        currentPage:number,
        orderBy:string,
        pageSize:number,
        pages:number,
        startIndex:1,
        status:string,
        total:number,
        results:ArticleGuardian[];
    }
}

