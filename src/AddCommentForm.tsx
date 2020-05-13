import * as React from 'react';

export default class AddCommentForm extends React.Component<any, any> {
    context: any;

    comment: HTMLInputElement;

    constructor(props: any) {
        super(props);
    }

    render() {

        const rows: any = [];

        return (
            <div
                style={{padding: '5px'}}
            >
                <div
                    className="modal-dialog-input-row"
                >
                    <span
                        className="modal-dialog-input-label"
                        style={{verticalAlign: 'top', fontSize: '18px', fontWeight: 500}}
                    >Comment</span>
                    <textarea
                        className="modal-dialog-input"
                        rows={5}
                        cols={50}
                        ref={(e: any) => {this.comment = e; }}
                        defaultValue={''}
                    />
                </div>
            </div>
        );
    }
}
