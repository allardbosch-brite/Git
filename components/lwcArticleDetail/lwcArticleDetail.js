import { LightningElement, api, wire, track } from 'lwc';
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';
import getKnowledge from '@salesforce/apex/ArticleControllerLWC.getKnowledgeRecord';
import lastmodifiedLabel from '@salesforce/label/c.Last_modified';
import allarticleslabel from '@salesforce/label/c.AllArticles';


export default class ArticleDetailTest extends NavigationMixin(LightningElement) {     

    label = {
        lastmodifiedLabel,
        allarticleslabel
    };

    // Public properties
    @api recordId;
    @api targetPage;

    @wire(CurrentPageReference)
    pageRef;    

    // Article Detail Properties
    title;
    lastmodifieddate;
    articleContent;
    articleDetailPage = false;
    @track isLoading = false;

    subCatArticle;
    subsubCatArticle;

     // Connected callback lifecycle hook
     connectedCallback(){
        //extract state parameters
        let knowledgeId = this.pageRef && this.pageRef.state.knowledgeId;     
        let displayContent = this.pageRef && this.pageRef.state.displayContent; 
        this.subCatArticle = this.pageRef && this.pageRef.state.subCatofArticle;
        if ((this.pageRef && this.pageRef.state.subsubCatofArticle) != null){
            this.subsubCatArticle = this.pageRef && this.pageRef.state.subsubCatofArticle;
        }

        console.log('knowledgeId', knowledgeId);
        console.log('displayContent', displayContent);
        console.log('SubCat Article Selected check: ' , this.subCatArticle);
        
        //proces state parameters
        if(knowledgeId != null) this.recordId = knowledgeId;
        this.articleDetailPage = displayContent === true || displayContent === "true";
    }


     // Wire method to call the Apex method getKnowledge with the recordId parameter
    @wire(getKnowledge, { recordIdInput: '$recordId' })   

    wiredKnowledge({error, data}) {
        this.isLoading = true;
        if(data) {
             // Set properties with the retrieved article details
            this.title = data.Title;
            this.lastmodifieddate = data.LastModifiedDate;
            this.articleContent = data.InhoudBackoffice__c;
            this.isLoading = false;
        }
        else if (error) {
            // Log an error message if there's an issue with the Apex call
            console.error(error)
            this.isLoading = false;
        }
    }
}