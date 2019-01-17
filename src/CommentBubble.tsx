declare var manywho: any;
import * as React from 'react';

class CommentBubble extends React.Component <any, any>
{
    constructor(props : any) 
    {
        super(props);
    }

    componentDidMount() 
    {

    }

    render() 
    {
        if(this.props.data)
        {
            var who = manywho.utils.getObjectDataProperty(this.props.data.properties, "Author").contentValue;
            var when = manywho.utils.getObjectDataProperty(this.props.data.properties, "Date").contentValue;
            var what = manywho.utils.getObjectDataProperty(this.props.data.properties, "Comment").contentValue;

            //convert when to friendly format
            when=new Intl.DateTimeFormat('en-GB', {   
                year: 'numeric', 
                month: 'long', 
                day: '2-digit' 
            }).format(new Date(when));

            var deleteButton : any;
            if(this.props.canDelete == true)
            {
                deleteButton = <span className="glyphicon glyphicon-remove delete-comment-button" title="Remove Comment" onClick={this.props.delete.bind(this, this.props.data)}></span>
            }


            return  <div className="comment-bubble">
                        <div className="comment-bubble-client">
                            <div className="comment-bubble-client-header">
                                <div style={{float: 'left'}}>
                                    <span className = "comment-bubble-client-header-span">Added by {who} on {when}</span>
                                </div>
                                <div style={{float: 'right'}}>
                                    {deleteButton}
                                </div>
                            </div>
                            <div className="comment-bubble-client-body">
                            <span className = "comment-bubble-client-body-span">{what}</span>
                            </div>
                        </div>
                    </div>
        }
        else
        {
            return <div></div>
        }

    }
}



export default CommentBubble
