declare var manywho: IManywho;

import * as React from 'react';
import CommentBubble from './CommentBubble';
import './CommentsControl.css';
import { FlowField } from './models/FlowField';
import { FlowObjectData } from './models/FlowObjectData';
import { FlowObjectDataArray } from './models/FlowObjectDataArray';
import { FlowObjectDataProperty } from './models/FlowObjectDataProperty';
import { FlowPage } from './models/FlowPage';
import { IManywho } from './models/interfaces';
import ModalDialog from './models/ModalDialog';

class CommentsList extends FlowPage {

    modalShown: boolean = false;

    newComment: any;

    constructor(props: any) {
        super(props);

        this.addComment = this.addComment.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
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
        const comments: FlowField = this.fields[this.attributes['CommentsListField'].value];
        const items: FlowObjectDataArray = comments.value as FlowObjectDataArray ;
        for (let pos = items.items.length - 1; pos >= 0; pos--) {
            if (this.compareObjectData(comment, items.items[pos]) === true) {
                items.items.splice(pos, 1);
            }
        }

        await this.updateValues([comments]);
        if (this.attributes['RemoveCommentOutcome'] && this.attributes['RemoveCommentOutcome'].value.length > 0 && this.outcomes[this.attributes['RemoveCommentOutcome'].value]) {
                await this.triggerOutcome(this.attributes['RemoveCommentOutcome'].value);
            }
        await this.loadValues();
    }

    addComment() {
        this.modalShown = true;
        this.forceUpdate();
    }

    async closeModal(save: boolean) {
        this.modalShown = false;
        if (save === true) {
            const comment = new FlowObjectData();
            comment.developerName = 'Comment';
            comment.isSelected = true;
            comment.addProperty(new FlowObjectDataProperty({
                contentFormat: null,
                contentType: 'ContentString',
                contentValue: this.user.firstName +  ' ' + this.user.lastName,
                developerName: 'Author',
                objectData: null,
                typeElementId: null,
                typeElementPropertyId: null}));
            comment.addProperty(new FlowObjectDataProperty({
                contentFormat: null,
                contentType: 'ContentDateTime',
                contentValue: new Date().toISOString(),
                developerName: 'Date',
                objectData: null,
                typeElementId: null,
                typeElementPropertyId: null}));
            comment.addProperty(new FlowObjectDataProperty({
                contentFormat: null,
                contentType: 'ContentString',
                contentValue: this.newComment.value,
                developerName: 'Comment',
                objectData: null,
                typeElementId: null,
                typeElementPropertyId: null}));

            const comments: FlowField = this.fields[this.attributes['CommentsListField'].value];
            (comments.value as FlowObjectDataArray).addItem(comment);

            await this.updateValues([comments]);
            if (this.attributes['AddCommentOutcome'] && this.attributes['AddCommentOutcome'].value.length > 0 && this.outcomes[this.attributes['AddCommentOutcome'].value]) {
                await this.triggerOutcome(this.attributes['AddCommentOutcome'].value);
            }
            await this.loadValues();
        } else {
            this.forceUpdate();
        }
    }

    render() {

        const caption: string = this.getAttribute('Title') || 'Comments';
        const canDelete: boolean = this.getAttribute('Can Delete') == 'true' || this.getAttribute('CanDelete') == 'true' ? true : false;

        const height = this.model.height + 'px';

        const style: any = {};
        style.width = '100%';
        style.height = height;

        const comments = [];
        if (this.fields[this.attributes['CommentsListField'].value]) {
            for (const item of (this.fields[this.attributes['CommentsListField'].value].value as FlowObjectDataArray).items) {
                comments.push(<CommentBubble data={item} props={this.props} canDelete={canDelete} delete={this.deleteComment}></CommentBubble>);
            }
        }

        let modal: any;
        if (this.modalShown) {
            modal =  <ModalDialog onCloseRequest={this.closeModal}>
                        <div className="modal-dialog">
                            <div className="modal-dialog-header">
                                <div style={{float: 'left'}}>
                                    <span className="modal-dialog-header-title">Add a new document</span>
                                </div>
                                <div style={{float: 'right'}}>
                                    <span
                                        className="glyphicon glyphicon-remove modal-dialog-header-button"
                                        title="Close"
                                        onClick={(e) => this.closeModal(false)}
                                    ></span>
                                </div>
                            </div>
                            <div className="modal-dialog-body">
                                <div className="modal-dialog-body-client">
                                    <div className="modal-dialog-input-row">
                                        <span className="modal-dialog-input-label">Comment</span>
                                        <input className="modal-dialog-input" ref={(newComment) => { this.newComment = newComment; }} type="text" width="60px"></input>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-dialog-button-bar">
                                <button className="modal-dialog-button-bar-button" title="Add Comment" onClick={(e) => this.closeModal(true)}>Add</button>
                                <button className="modal-dialog-button-bar-button" title="Cancel" onClick={(e) => this.closeModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </ModalDialog>;
        }

        return <div className="comment-list">
                    <div className="comment-list-header">
                        <div style={{float: 'left'}}>
                            <span className="comment-list-header-title">{caption}</span>
                        </div>
                        <div style={{float: 'right'}}>
                            <span className="glyphicon glyphicon-plus comment-list-header-button" title="Add Comment" onClick={this.addComment.bind(this)}></span>
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
