
# Package Delivery App

Package Delivery web app is meant to serve 3 users i.e. client, driver and an admin. The client creates the package, a driver selects one package from available package list in his account and decides to deliver to the intended destination. An admin oversees the general status of the app e.g. total available packages, total number of users 


## Demo

A short video demo of how the app works

https://drive.google.com/file/d/1BiOq12pKaWPqzXVPGPArwZIQswWWIHsL/view?usp=sharing
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT` set 

`MONGO_URI` set to your Mongo URI connection string

`JWT_SECRET` 



## Run Locally

Clone the project

```bash
  git clone https://github.com/emash90/package-delivery-app.git
```

Go to the project directory

```bash
  cd package-delivery-app
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```
Start the frontend in another terminal tab

```bash
  cd client
```
run client script
```bash
  npm start
```
the program is now running on http://localhost:3000/

## Lessons Learned

learnt a lot when working on the project including react-redux to persist the application's state, authorization and authentication with JWT and also implementing google maps APIs

## Authors

- [@emash90](https://emash90.github.io/edwin-portfolio/)

