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

cd ..
docker-compose up --build
```