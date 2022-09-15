# Project Title

Equiticks Financials

## About this Project

Equiticks Financials is a project that allows user to register/login to the application, and will list all the trades of the logged in user. The logged in user can also add more trades(deals), and filter the trades by deal.
When an ADMIN is logged in, they can see the list of trades of all users and filter them by deal number.

### Setup

- clone the repository
- switch to the development branch
- run npm install

#### Run the project

- run npm start
- click on register to register a new user account
- To create an ADMIN, go to postman and send a POST request http://localhost:8000/api/register . In the body include: name, email, password, password_confirmation, and isAdmin. Make sure to set isAdmin value to 1. Make sure to add Accept:application/json to the Headers as well.
