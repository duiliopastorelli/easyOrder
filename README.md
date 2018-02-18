# easyOrder
Order management app

This app is made by 3 integrated Docker Containers:
- the "web" front-end, responsible of handling the View and Controller
- the "api" back-end, responsible for the Model
- the MongoDB database

##Develop

For setting up the environment and launch the app:

```
cd web
npm install

cd ../api
npm install

cd web
gulp dev
```

Change the variable NODE_ENV to develop in package.json

```
cd ..
docker-compose up
```

##Front End
The "web" server is responsible for the front-end side of the application, in particular for handle view and controller.

It's reachable at localhost:3000

##Api
The "api" server is responsible for provide REST api endpoint.

It's reachable at localhost:3001

###Api end points

GET     /   => Provides a sample answer
POST    / {name:String, price:Number}   => Persist data
GET     /db => find all persisted data