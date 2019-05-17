declare var manywho: any;
import * as React from 'react';
import { FlowObjectData } from './models/FlowObjectData';

class CommentBubble extends React.Component <any, any> {
    constructor(props: any) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        if (this.props.data) {
            const who = (this.props.data as FlowObjectData).properties['Author'].value;
            const when = new Date((this.props.data as FlowObjectData).properties['Date'].value as string).toLocaleString();
            const what = (this.props.data as FlowObjectData).properties['Comment'].value;

            let deleteButton: JSX.Element;
            if (this.props.canDelete == true) {
                deleteButton = <span className="glyphicon glyphicon-remove delete-comment-button" title="Remove Comment" onClick={(e) => {this.props.delete(this.props.data); }}></span>;
            }

            return  <div className="comment-bubble">
                        <div className="comment-bubble-client">
                            <div className="comment-bubble-client-header">
                                <div style={{float: 'left'}}>
                                    <span className="comment-bubble-client-header-span">Added by {who} on {when}</span>
                                </div>
                                <div style={{float: 'right'}}>
                                    {deleteButton}
                                </div>
                            </div>
                            <div className="comment-bubble-client-body">
                            <span className="comment-bubble-client-body-span">{what}</span>
                            </div>
                        </div>
                    </div>;
        } else {
            return <div></div>;
        }

    }
}

export default CommentBubble;
