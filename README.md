# easyOrder
Order management app

This app is made by 2 integrated Docker Containers:
- the "app"
- the MongoDB database

##Develop
For setting up the environment and launch the app:

```
npm install
gulp dev
```

Change the variable NODE_ENV to develop in package.json

```
docker-compose up
```

##The app
It's reachable at localhost:3000

##Api end points
###/
GET     /   => UI

###/orderCollection
POST    / {restaurantLink:String}   => Generate a new order collection

GET /   => get all order collections (temporary for dev purpose only)

DELETE /id  => delete an order collection