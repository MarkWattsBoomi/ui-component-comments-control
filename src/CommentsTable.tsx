declare var manywho: any;

import * as React from 'react';
import CommentTableItem from './CommentTableItem';
import './CommentsControl.css';

class CommentsTable extends React.Component<any, any> 
{
   
    componentId: string = "";
    flowKey: string ="";    
    attributes : any = {};
    readonly : boolean = false;

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
    
    save()
    {

        const flowState = manywho.state.getComponent(this.componentId, this.flowKey) || {};
        const flowModel = manywho.model.getComponent(this.componentId,   this.flowKey);

        var objectData = flowModel.objectData[0];

        objectData = JSON.parse(JSON.stringify(objectData));

        objectData.isSelected = true;
        
        /*
        manywho.utils.setObjectDataProperty(objectData.properties, "OperatingSystem", this.operatingSystem);
        manywho.utils.setObjectDataProperty(objectData.properties, "BrowserVendor", this.browserVendor);
        manywho.utils.setObjectDataProperty(objectData.properties, "BrowserName", this.browserName);
        manywho.utils.setObjectDataProperty(objectData.properties, "Longitude", this.longitude);
        manywho.utils.setObjectDataProperty(objectData.properties, "Latitude", this.latitude);
*/
        var newState = {
            objectData: [objectData]
        };
            
        manywho.state.setComponent(this.componentId, newState, this.flowKey, true);

        this.forceUpdate();
    }
       
    render()
    {
        const flowModel = manywho.model.getComponent(this.componentId,   this.flowKey);
        const flowState = manywho.state.getComponent(this.componentId,   this.flowKey);

        var caption : string = this.getAttribute("Title") || "Comments";
        
        var width = flowModel.width + "px";
        var height=flowModel.height + "px";

        var style : any = {};
        style.width = '100%';
        style.height = height;

        var heads = [];
        var headers = [];
        var comments = [];

        if(flowModel.columns && flowModel.columns.length > 0)
        {
            for(var hPos = 0 ; hPos < flowModel.columns.length ; hPos++)
            {
                var col = flowModel.columns[hPos];
                
                heads[col.developerName] = col;

                if(heads[col.developerName].isDisplayValue)
                {              
                    headers[col.order] = <td className="cc-column-header">{flowModel.columns[hPos].label}</td>;
                }
            }
        }

        if(flowModel.objectData && flowModel.objectData.length > 0)
        {
            for(var cPos = 0 ; cPos < flowModel.objectData.length ; cPos++)
            {
                comments.push(<CommentTableItem data={flowModel.objectData[cPos]} headers={heads}></CommentTableItem>);
            }
        }

        return <div className="cc-control">
                    <div className="cc-header">
                        <div style={{float:'left'}}>
                            <span className="cc-header-title">{caption}</span>
                        </div>
                        <div style={{float:'right'}}>
                            <span className="glyphicon glyphicon-plus cc-header-button" title="Add Comment" onClick={this.addComment.bind(this)}></span>
                        </div>
                        
                    </div>
                    <div className="cc-body">
                        <table className="cc-table">
                            <thead className="cc-thead">
                                <tr className="cc-thead-row">
                                    {headers}
                                </tr>
                            </thead>
                            <tbody className="cc-tbody">
                                {comments}
                            </tbody>
                        </table>  
                    </div>
               </div>

    }
   
    addComment()
    {

    }
    
    
}

manywho.component.register('CommentsTable', CommentsTable);

export default CommentsTable;

