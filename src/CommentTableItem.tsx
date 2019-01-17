import * as React from 'react';

class CommentTableItem extends React.Component <any, any>
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
        var cols = [];

        if(this.props.data)
        {
            //each property of data is a column
            for(var cPos = 0 ; cPos < this.props.data.properties.length ; cPos++)
            {
                var col = this.props.data.properties[cPos];

                if(this.props.headers[col.developerName].isDisplayValue)
                {
                    var value : any;
                    var pos = this.props.headers[col.developerName].order;

                    switch(col.contentType)
                    {
                        case "ContentString":
                            value = col.contentValue;
                            break;

                        case "ContentDateTime":
                            value = new Intl.DateTimeFormat('en-GB', {   
                                year: 'numeric', 
                                month: 'long', 
                                day: '2-digit' 
                            }).format(new Date(col.contentValue));
                            break;

                        default:
                            value = col.contentValue;
                            break;

                    }

                    cols[pos] = <td className="cc-tbody-row-cell">{value}</td>;
                }

            }

        }
        return  <tr className="cc-tbody-row">
                    {cols}
                </tr>
    }
}

export default CommentTableItem
