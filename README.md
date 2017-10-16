- -------------------Bamazon Project------------------- -

This application is a "knockoff" and simpified version of Amazon. The application uses a mySQL database, which stores customer information and store inventory information. 

When customers wish to purchase an item, they can view everything in the store's stock, and purchase and item if it is in inventory. The store inventory depletes with each purchase, and only items in stock can be purchased; users will be notified if their item is not available, and to check back later to see if the item has been replenished. 

When managers wish to manage the store, they can use the manager side of the application to view all the items currently in the database with their associated information (ID, name, department, price, and quantity), view items with low inventory, update the inventory for an item, and add an item to the database. 

#Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

To use the customer interface, please use bamazonCustomer.js 
To manage the bamazon store, please use bamazonManager.js

#Prerequisites

Node.js is required to run this application, as well as the npm packages sql, inquirer, and ascii-table

#Installing

1. Install Node.js on your local machine (macOS instructions: https://changelog.com/posts/install-node-js-with-homebrew-on-os-x)

2. Clone the Git respository to your local machine

3. Navigate to the Git repository on your local machine in terminal, and: 
npm install --save sql
npm install --save inquirer
npm install --save ascii-table


#Built With

JavaScript
mySQL
Node.js

#Versioning

This is version 1.0 of the Bamazon application. 

#Authors

Liz Masoudi
grrliz86@hotmail.com

#License

This project is licensed under the ICS License. 

#Project Images

For images of the working product, please reference the images folder

#Acknowledgments

Ron Salmon ... for being a wonderful teacher