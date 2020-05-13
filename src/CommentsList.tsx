
import { eContentType, eLoadingState, FlowComponent, FlowField, FlowObjectData, FlowObjectDataArray, FlowObjectDataProperty, ModalDialog, modalDialogButton } from 'flow-component-model';
import * as React from 'react';
import AddCommentForm from './AddCommentForm';
import CommentBubble from './CommentBubble';
import './css/CommentsControl.css';

declare var manywho: any;

class CommentsList extends FlowComponent {

    dialogVisible: boolean = false;
    dialogTitle: string = '';
    dialogButtons: any = [];
    dialogContent: any;
    dialogOnClose: any;
    dialogForm: any;

    newComment: any;

    constructor(props: any) {
        super(props);
        this.addComment = this.addComment.bind(this);
        this.commentAdd = this.commentAdd.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.hideDialog = this.hideDialog.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
    }

    async componentDidMount() {
        await super.componentDidMount();

        this.forceUpdate();
    }

    async showDialog(title: string, content: any, onClose: any, buttons: modalDialogButton[]) {
        this.dialogVisible = true;
        this.dialogTitle = title;
        this.dialogContent = content;
        this.dialogOnClose = onClose;
        this.dialogButtons = buttons;
        return this.forceUpdate();
    }

    async hideDialog() {
        this.dialogVisible = false;
        this.dialogTitle = '';
        this.dialogContent = undefined;
        this.dialogOnClose = undefined;
        this.dialogButtons = [];
        this.dialogForm = undefined;
        return this.forceUpdate();
    }

    compareObjectData(one: FlowObjectData , two: FlowObjectData): boolean {

        if (one.properties.Author.value === two.properties.Author.value &&
            one.properties.Date.value === two.properties.Date.value &&
            one.properties.Comment.value === two.properties.Comment.value) {
            return true;
        } else {
            return false;
        }
    }

    async deleteComment(comment: any) {
        const comments: FlowObjectDataArray = this.getStateValue() as FlowObjectDataArray;
        for (let pos = comments.items.length - 1; pos >= 0; pos--) {
            if (this.compareObjectData(comment, comments.items[pos]) === true) {
                comments.items.splice(pos, 1);
            }
        }
        await this.setStateValue(comments);
        if (this.attributes['RemoveCommentOutcome'] && this.attributes['RemoveCommentOutcome'].value.length > 0 && this.outcomes[this.attributes['RemoveCommentOutcome'].value]) {
                await this.triggerOutcome(this.attributes['RemoveCommentOutcome'].value);
            }
        await this.forceUpdate();
    }

    async addComment() {
        // show dialog
        const content: any = [];
        content.push(
            <AddCommentForm
                ref={(e: any) => { this.dialogForm = e; }}
            />,
        );
        const buttons: modalDialogButton[] = [];
        buttons.push(new modalDialogButton('Save', this.commentAdd));
        buttons.push(new modalDialogButton('Cancel', this.hideDialog));
        this.showDialog('Import Users', content, this.hideDialog, buttons);
    }

    async commentAdd() {
        const frm: AddCommentForm  = this.dialogForm;
        const comment: string = frm.comment.value;
        const author: string = this.user ? this.user.email : 'anonymous';
        const time: string = new Date().toISOString();

        const stateVal: FlowObjectDataArray = this.getStateValue() as FlowObjectDataArray;

        const newComment: FlowObjectData = FlowObjectData.newInstance('Comment');
        newComment.addProperty(FlowObjectDataProperty.newInstance('Author', eContentType.ContentString, author));
        newComment.addProperty(FlowObjectDataProperty.newInstance('Date', eContentType.ContentDateTime, time));
        newComment.addProperty(FlowObjectDataProperty.newInstance('Comment', eContentType.ContentString, comment));

        stateVal.addItem(newComment);
        await this.setStateValue(stateVal);
        await this.hideDialog();
    }

    render() {

        const caption: string = this.getAttribute('Title') || 'Comments';
        const canDelete: boolean = this.getAttribute('Can Delete') == 'true' || this.getAttribute('CanDelete') == 'true' ? true : false;
        const readOnly: boolean = this.model.readOnly;
        const height = this.model.height + 'px';

        const style: any = {};
        style.width = '100%';
        style.height = height;

        const comments: any[] = [];
        if (this.loadingState === eLoadingState.ready) {
            const stateVal: FlowObjectDataArray = this.getStateValue() as FlowObjectDataArray;
            if (stateVal) {
                stateVal.items.forEach((Comment: FlowObjectData) => {
                    comments.push(
                        <CommentBubble
                            data={Comment}
                            props={this.props}
                            canDelete={canDelete}
                            delete={this.deleteComment}
                        />,
                    );
                });
            }
        }

        let addButton: any;
        if (readOnly === false) {
            addButton = (
                <span className="glyphicon glyphicon-plus comment-list-header-button" title="Add Comment" onClick={this.addComment.bind(this)}/>
            );
        }

        let modal: any;
        if (this.dialogVisible === true) {
            modal = (
                <ModalDialog
                    title={this.dialogTitle}
                    buttons={this.dialogButtons}
                    onClose={this.dialogOnClose}
                >
                    {this.dialogContent}
                </ModalDialog>
            );
        }

        return <div className="comment-list">
                    <div className="comment-list-header">
                        <div style={{float: 'left'}}>
                            <span className="comment-list-header-title">{caption}</span>
                        </div>
                        <div style={{float: 'right'}}>
                            {addButton}
                        </div>
                    </div>
                    <div className="comment-list-body">
                       {comments}
                    </div>
                    {modal}
               </div>;
    }

}

manywho.component.register('CommentsList', CommentsList);

export default CommentsList;
