declare var manywho: any;

import * as React from 'react';
import CommentBubble from './CommentBubble';
import ModalDialog from './ModalDialog';
import './CommentsControl.css';
import { isBoolean } from 'util';

class CommentsList extends React.Component<any, any> 
{
   
    componentId: string = "";
    flowKey: string ="";    
    attributes : any = {};
    readonly : boolean = false;
    modalShown : boolean = false;

    newComment : any;

    constructor(props : any)
	{
        super(props);
        
        this.componentId = props.id;
        this.flowKey = props.flowKey;

        //push attributes into keyed map 
		var flowModel = manywho.model.getComponent(this.props.id,   this.props.flowKey);
		if(flowModel.attributes)
		{
			for(var key in flowModel.attributes)
			{
				this.attributes[key] = flowModel.attributes[key];
			}
        }
    }

    
    componentDidMount() 
    {
        const flowModel = manywho.model.getComponent(this.componentId,   this.flowKey);
        const flowState = manywho.state.getComponent(this.componentId, this.flowKey) || {};

        var objectData : any;
        if(flowState.objectData)
        {
            objectData=flowState.objectData;
        }
        else
        {
            objectData=flowModel.objectData;
        }

        objectData = JSON.parse(JSON.stringify(objectData));
        
        var newState = {
			objectData: [objectData]
		};
             
        manywho.state.setComponent(this.componentId, newState, this.flowKey, true);

        this.readonly = ! flowModel.isEditable
    }

	getAttribute(attributeName : string)
	{
		if(this.attributes[attributeName])
		{
			return this.attributes[attributeName];
		}
		else
		{
			return null;
		}
    }

    compareObjectData(one : any , two : any) : boolean
    {
        
        if(manywho.utils.getObjectDataProperty(one.properties, "Author").contentValue == manywho.utils.getObjectDataProperty(two.properties, "Author").contentValue &&
            manywho.utils.getObjectDataProperty(one.properties, "Date").contentValue === manywho.utils.getObjectDataProperty(two.properties, "Date").contentValue &&
            manywho.utils.getObjectDataProperty(one.properties, "Comment").contentValue === manywho.utils.getObjectDataProperty(two.properties, "Comment").contentValue)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    deleteComment(comment : any)
    {
        const flowState = manywho.state.getComponent(this.componentId, this.flowKey) || {};
        const flowModel = manywho.model.getComponent(this.componentId,   this.flowKey);

        var objectDataArray = [];
        //loop over model adding to newstate if not equal
        for(var oPos = 0 ; oPos < flowModel.objectData.length; oPos++)
        {
            var objectData = flowModel.objectData[oPos];
            

            if(this.compareObjectData(objectData, comment) == false)
            {
                objectData = JSON.parse(JSON.stringify(objectData));
                objectDataArray.push(objectData);
            }
        }

        var newState = {
            objectData: objectDataArray
        };
            
        manywho.state.setComponent(this.componentId, newState, this.flowKey, true);
        manywho.engine.sync(this.flowKey);
    }
    
    addNewComment(comment : string)
    {

        const flowState = manywho.state.getComponent(this.componentId, this.flowKey);
        const flowModel = manywho.model.getComponent(this.componentId,   this.flowKey);

        var objectData : any = {};

        if(flowModel.objectData && flowModel.objectData.length > 0)
        {
            objectData = flowModel.objectData[0];
        }
        else
        {
            objectData.properties = [];
            objectData.developerName = "Comment";
            objectData.properties.push({developerName: "Author", contentType:"ContentString", contentValue:""});
            objectData.properties.push({developerName: "Date", contentType:"ContentDateTime", contentValue:""});
            objectData.properties.push({developerName: "Comment", contentType:"ContentString", contentValue:""});
        }        

        objectData = JSON.parse(JSON.stringify(objectData));

        objectData.isSelected = true;
        
        manywho.utils.setObjectDataProperty(objectData.properties, "Author", "me");
        manywho.utils.setObjectDataProperty(objectData.properties, "Date", new Date().toISOString());
        manywho.utils.setObjectDataProperty(objectData.properties, "Comment", comment);
       
        var objectDataArray = flowModel.objectData || [];
        objectDataArray.push(objectData);
        var newState = {
            objectData: objectDataArray
        };
            
        manywho.state.setComponent(this.componentId, newState, this.flowKey, true);
        manywho.engine.sync(this.flowKey);
    }
       
    render()
    {
        const flowModel = manywho.model.getComponent(this.componentId,   this.flowKey);
        const flowState = manywho.state.getComponent(this.componentId,   this.flowKey);

        var caption : string = this.getAttribute("Title") || "Comments";
        var canDelete : boolean = this.getAttribute("Can Delete") == "true" || this.getAttribute("CanDelete") == "true"? true : false;
        
        var width = flowModel.width + "px";
        var height=flowModel.height + "px";

        var style : any = {};
        style.width = '100%';
        style.height = height;

        var comments = [];

        
        if(flowModel.objectData && flowModel.objectData.length > 0)
        {
            for(var cPos = 0 ; cPos < flowModel.objectData.length ; cPos++)
            {

                comments.push(<CommentBubble data={flowModel.objectData[cPos]} props={this.props} canDelete={canDelete} delete={this.deleteComment.bind(this)}></CommentBubble>);
            }
        }

        var addButton : any;
        if(flowModel.isEditable == true)
        {
            addButton = <span className="glyphicon glyphicon-plus add-dialog-header-button" title="Add Comment" onClick={this.modalClose.bind(this)}></span>
        }

        var modal : any;
        if(this.modalShown)
        {
            modal=  <ModalDialog onCloseRequest={this.modalClose.bind(this)}>
                        <div className="add-dialog">
                            <div className="add-dialog-header">
                                <div style={{float:'left'}}>
                                    <span className="add-dialog-header-title">Add a new comment</span>
                                </div>
                                <div style={{float:'right'}}>
                                    {addButton}
                                </div>
                            </div>
                            <div className="add-dialog-body">
                                <div className="add-dialog-body-client">
                                    <div className="add-dialog-field">
                                        <span className="add-dialog-input-label">Comment</span>
                                        <input className="add-dialog-input" ref={(newComment) => { this.newComment = newComment }} type="text" width="60px"></input>
                                    </div>
                                </div>
                            </div>
                            <div className="add-dialog-button-bar">
                                <button className="add-dialog-button-bar-button" title="Add Comment" onClick={this.modalClose.bind(this,"ADD")}>Add</button>
                                <button className="add-dialog-button-bar-button" title="Cancel" onClick={this.modalClose.bind(this)}>Cancel</button>
                            </div>
                        </div>
                    </ModalDialog>
        }

        return <div className="comment-list">
                    <div className="comment-list-header">
                        <div style={{float:'left'}}>
                            <span className="comment-list-header-title">{caption}</span>
                        </div>
                        <div style={{float:'right'}}>
                            <span className="glyphicon glyphicon-plus comment-list-header-button" title="Add Comment" onClick={this.addComment.bind(this)}></span>
                        </div>
                        
                    </div>
                    <div className="comment-list-body">
                       {comments}   
                    </div>
                    {modal}
               </div>
    }
   
    addComment()
    {
        this.modalShown = true;
        this.forceUpdate();
    }

    modalClose(action : any)
    {
        if(action && action=="ADD")
        {
            var comment  = this.newComment.value;
            this.addNewComment(comment);
            
        }
        this.modalShown = false;
        this.forceUpdate();
    }
    
    
}

manywho.component.register('CommentsList', CommentsList);

export default CommentsList;

