# Comments Controls

A set of components used to add comments to a flow instance.

- CommentsList
Shows a list of comments and allows adding & removal of comments


## Setup

- Grab the files from the /dist folder and import into your tenant.

- Add the files to your player code like this: -

        requires: ['core', 'bootstrap3'],
        customResources: [
                'https://s3.amazonaws.com/files-manywho-com/tenant-id/CommentsControl.css',
                'https://s3.amazonaws.com/files-manywho-com/tenant-id/CommentsControl.js'
                ],



- Create a type called Comment with these properties: -
        Author  string
        Date    date/time
        Comment string

- Create a new list value of type Comment e.g. Comments

- Add a component to your page, any type, save it then change it's "componentType" to "CommentsList" in the metadata editor and save it.
e.g. 
            "componentType": "CommentsList",

- Set the component's "Data Source" to the new list (e.g. Comments).
- Set the component's "State" to a the new list (e.g. Comments). 

- Set the "Editable" to "true" to enable adding comments or false to be read only.

-Set the "height" of the component to control it's proportions.


## Extra Configuration

You can add attributes to the component to control it's appearance: -

- Title  - A string to display in the title bar of the component.

- CanDelete     -  true to allow comment removal and false to prevent

#   u i - c o m p o n e n t - c o m m e n t s - c o n t r o l  
 