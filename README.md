## REST_Full Todo API

Todo app simplifies our daily todo task and makes our life more easier and happier.
- NOTE: IMPORT THE JSON FILES OF THE WORKING API ON POSTMAN TO SEE IT CLEARLY

- Read Doc: https://arun-kumar-95.github.io/guru_ji_astro_backend_assignment/

- API DOCUMENTATION : https://documenter.getpostman.com/view/20456948/2s93sW8b8m

- SCREENSHOT : added while changing the password , link is send to the email 
- SCREEN SHOT dded when we received the todo remainder on email

## Features:

- Here you can create as-many-as todos you want to 

- You can perform CRUD Operation 

- Role based authetication and authorization is implemented.

- Add remainder to the todo that will notify you at that time via email notification.

- Reset you password via email once you forgot the password. 

- here you can filter the todo based on category , status , and paginate the page.

- Added the features to search the todos followed by the pagination.

## How to Setup project locally

1. visit the url : https://github.com/Arun-kumar-95/guru_ji_astro_backend_assignment/tree/master

2. Download the zip file and open with your favourite editor

3. To install all the dependencies and packages : use npm install 

4. To start the backend server use "npm run dev"
 
 
## Backend API routes 

url: http://localhost:5000/app/v1

1. USER ROUTES :

- register (POST):  /register 
- login (POST) : /login
- logout (GET) : /logout
- get user details (GET): /me
- update user profile (PUT) : /profile/update 
- Forgot password (POST) : /forgot-password
- Reset password (PUT): /reset-password/:resetToken

2. TODOS ROUTES

url : http://localhost:5000/app/v1/todo

- Get all todos (GET) : /all-todos 
- Create new todo (POST) : /new-todo 
- Remove todo (DELETE) : /remove-todo/:id where id is the todo id.
- update whole todo (PUT): /update-todo/:id Where id the todo id
- search (GET): /search
- Todo remainder via email notification (POST) :/reminder/:id where id the todo id
- Update status (PUT) :/update-status/:id where id the todo id
- edit todo descri[tion (PUT) : /edit-description/:id where id is the todo id
- edit todo title  (PUT) :/edit-title/:id" where id the todo id

## Authors

- Arun kumar: https://github.com/Arun-kumar-95
