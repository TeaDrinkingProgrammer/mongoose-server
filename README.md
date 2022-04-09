# mongoose-server
School project from the second semester of 2021/2022. This project is the backend API of [this project](https://github.com/TeaDrinkingProgrammer/Angular).  
The API is built using Javascript and Express and connects to a MongoDb database server using Mongoose. For a subset of queries, it connects to a Neo4j server.  

As of March 2022, this project is still in development.

<a href="https://github.com/TeaDrinkingProgrammer/mongoose-server/">Link to api</a>

Base url: `https://mykanjilist-backend.herokuapp.com`

# Queries
Info:  
Any property with a star (*) before it is required  
Any request with "Token" requires a valid token
## Authentication
`POST`
`/api/auth/register`
Creates a new account and gives back login info + bearer token
```JSON
{
    *"email": "johndoe@gmail.com",
    *"firstName": "John",
	*"lastName": "Doe"
    *"password": "Password123*"
}
```

`POST`
`/api/auth/login`
Logs in a user and gives back login info + bearer token
```JSON
{
    *"email": "johndoe@gmail.com",
    *"password": "Password123*"
}
```

## Content

`POST` 
`/api/content`  
`Token`  
Creates a new piece of content 
```JSON
{
  *"name": "Portuguese for Beginners",
  "tags": [
    "Portugal",
    "Culture"
  ],
  *"inProduction": true,
  "platforms": [
    {
      *"name": "Youtube",
      *"link": "Youtube.com"
    }
  ],
  *"contentInterface": "audio",
  *"contentType": "podcast",
  "websiteLink": "portugueseforbeginners.com",
  *"language": "English",
  "targetLanguage": "Portuguese"
}
```

`GET`
`/api/content`
Replies with all content that is stored in the database  
Query options:  
limit: number. Determines how many items are sent back  
skip: number. Determines how many items are skipped  
sortOrder: asc/desc. Determines in which order items are sent back  
sortOn: name of an attribute. Determines which attribute the items are sorted on. Default = name


`GET`
`/api/content/:id`
Replies with one content item with the id given as a parameter

`PUT`
`/api/content/:id`
`Token`
Updates the content with the corresponding ID
```JSON
{
"name": "Portuguese for Intermediates"
}
```

`DELETE`
`/api/content/:id`
`Token`
Deletes the content with the corresponding ID  

## ContentList

`POST` 
`/api/content-list`  
`Token`  
Creates a new contentlist
```JSON
{
  *"name": "My List",
  "description": "I am trying to learn Portuguese and Chinese",
  "isPrivate": true,
  "content": [
    "1345",
    "6789"
  ]
}
```

`GET`
`/api/content-list`
Replies with all contentlists in the database  
Query options:  
limit: number. Determines how many items are sent back  
skip: number. Determines how many items are skipped  
sortOrder: asc/desc. Determines in which order items are sent back  
sortOn: name of an attribute. Determines which attribute the items are sorted on. Default = name


`GET`
`/api/content-list/:id`
Replies with one contentlist with the id given as a parameter

`PUT`
`/api/content-list/:id`
`Token`
Updates the contentlist with the corresponding ID
```JSON
{
"name": "Language Podcasts"
}
```

`DELETE`
`/api/content-list/:id`
`Token`
Deletes the contentlist with the corresponding ID  

## User

`GET`
`/api/user`
Replies with all users in the database  
Query options:  
limit: number. Determines how many items are sent back  
skip: number. Determines how many items are skipped  
sortOrder: asc/desc. Determines in which order items are sent back  
sortOn: name of an attribute. Determines which attribute the items are sorted on. Default = username


`GET`
`/api/user/:id`
Replies with one user with the id given as a parameter

`PUT`
`/api/user/:id`
`Token`
Updates the user with the corresponding ID
```JSON
{
"password": "Password456*"
}
```

`DELETE`
`/api/user/:id`
`Token`
Deletes the user with the corresponding ID

### Follow

`POST` 
`/api/user/:id/follow`   
`Token`  
The owner of the token follows the person with the corresponding ID


`GET`
`/api/user/:id/follow`
Replies with all the users the user with the corresponding ID follows


`GET`
`/api/user/:id/followers`
Replies with all the users that follow the user with the corresponding ID follows

`DELETE`
`/api/content/:id`  
`Token`  
The owner of the token unfollows the person with the corresponding ID

## Comment

`POST` 
`/api/comment`  
`Token`  
Creates a new comment.
```JSON
{
  *"commentText": "Lorem ipsum",
  *"user": "1245",
  *"content": "1245",
  "votes": {
    *"userId": "12345"
  }
}
```

`GET`
`/api/comment`
Replies with all comments in the database  
Query options:  
limit: number. Determines how many items are sent back  
skip: number. Determines how many items are skipped  
sortOrder: asc/desc. Determines in which order items are sent back  
sortOn: name of an attribute. Determines which attribute the items are sorted on.   
Default = votesCount  
  
contentId: string. Only show comments for a certain piece of content


`GET`
`/api/comment/:id`
Replies with one comment with the id given as a parameter

`PUT`
`/api/comment/:id`
`Token`
Updates the comment with the corresponding ID
```JSON
{
"commentText": "New text"
}
```

`DELETE`
`/api/comment/:id`
`Token`
Deletes the comment with the corresponding ID  

## Common queries (on a scale from 1 to 5)
|               | POST          | GET  | PUT | DELETE |
| ------------- |:-------------:| :-----:|:-----:|-----:|
| /api/content-list      | 2 | 4 | X|X|
| /api/content-list/:id      | X | 3 | 2|2|
| /api/content     | 2 | 5 | X|X|
| /api/content/:id     | X | 4 | 1|1|
| /api/comment     | 5 | 4 | X|X|
| /api/comment/:id     | X | 1 | 2|1|
| /api/login     | 5 | X | X|X|
| /api/register     | 3 | X | X|X|
| /api/user     | X | 1 | X|X|
| /api/user/:id     | X | 3 | 2|1|
| /api/user/:id/follow     | 3 | 3 | X|2|
| /api/user/:id/followers     | X | 2 | X|X|

## Mongo model:
<img src="https://raw.githubusercontent.com/TeaDrinkingProgrammer/mongoose-server/main/documentation/mongoModel.png" img-width="65%">

## NEO model:
<img src="https://raw.githubusercontent.com/TeaDrinkingProgrammer/mongoose-server/main/documentation/neo4jRelationships.png" img-width="65%">

## ERD:
<img src="https://raw.githubusercontent.com/TeaDrinkingProgrammer/mongoose-server/main/documentation/ERD.png" img-width="65%">

