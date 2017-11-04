# Simple Mail Service



## Installation

This repository contains both an Express server application and a React application.

To deploy this application please follow these steps:

1. Change directory to the *server* folder
2. Run the command **npm install**
3. Change directory to the *client* folder
4. Run the command **npm install**
5. Run the command **npm run build**
6. Change directory to the *server* folder
7. Run the command **npm start**

## Credentials

In order to successfully the start the server the following credentials needs to be added to a **.env** file in the *server* folder:
```
MAILGUN_API_KEY=<api key>
MAILGUN_DOMAIN=<mailgun domain>
NODEMAILER_USER=<gmail account email address>
NODEMAILER_PASSWORD=<gmail account password>
```


Further, the gmail account that is to be used with Nodemailer will need to allow third-party applications to send emails. 

## Operation

This service will first attempt to send emails using Mailgun, however if Mailgun is unavailable, the system will use NodeMailer. 

## Tests

To run the server side tests please follow these steps:

1. Change directory to the *server* folder
2. Run the command **npm run test**

## Credit

The server side application was constructed from the following boilerplate

[Express & ES6 API Boilerplate](https://github.com/kylealwyn/node-rest-api-boilerplate)

The client side application was constructed using Facebook's

[Create React App](https://github.com/facebookincubator/create-react-app)



