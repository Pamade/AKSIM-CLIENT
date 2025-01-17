import { IconType } from "react-icons";

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
        byline:string,
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

export interface GuardianContentSingle {
    response: {
        content:ArticleGuardian,
    },
    total:number
}

export interface NavigationLinkProps{
    Icon?:IconType,
    text:string,
    path:string,
    fontSize?:string,
    onClick?:() => void
}

export interface AksimContent{
    id:number,
    userID:number,
    userNameID:string,
    title:string,
    description:string,
    content:string,
    imageLink:string,
    creationDate:string
}

export interface ArticleProps{
    webTitle:string,
    thumbnail:string | undefined,
    byline:string,
    publicationDate:string,
    body:TrustedHTML | string,
    description?:string,
    isAksim?:boolean
}

export interface AksimArticleAsLinkProps {
    content:AksimContent,
    handleRemoveArticle?:(id: number) => Promise<void>,
    path?:string,
    containsThumbnail?:boolean
}

export interface PaginationButtonsProps {
    pagesTotal:number,
    page:number,
    filters:FiltersContent | FiltersContentOpinions
}

export interface FiltersContentOpinions {
    page:number | string;
}

export interface FiltersContent {
    page:number|string,
    q:string,
    section:string,
    lang:string,
    fromDate: string,
    toDate: string,
    [key:string]:string | number 
}
