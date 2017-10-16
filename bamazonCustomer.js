var mysql = require("mysql");
var inquirer = require("inquirer");
var AsciiTable = require("ascii-table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) {
        throw err;
    }
    displayProducts();

});

var displayProducts = function () {
    connection.query("SELECT * FROM products", function (err, res) {
        var table = new AsciiTable("Bamazon Product List");
        table.setHeading('ID', 'Product Name', 'Department Name', 'Price', 'Quantity in Stock');
        for (var i = 0; i < res.length; i++) {
            table.addRow(res[i].item_id, res[i].product_name, res[i].department_name, ("$" + res[i].price), res[i].stock_quantity);
        }
        console.log(table.toString());
        buyProduct();
    });

}

var buyProduct = function () {
    inquirer.prompt([
        {
            name: "productID",
            message: "Please enter the ID of the product you would like to purchase: "
        },
        {
            name: "quantity",
            message: "Please enter the quantity of the product you wish to purchase: "
        }
    ]).then(function (answers) {
        if (answers.productID === "" || answers.quantity === "") {
            console.log("Oops, you need to enter information to do anything to manage the Bamazon store!");
            displayProducts();
        }
        else {
            connection.query("SELECT * FROM products WHERE item_id=?", [answers.productID], function (err, res) {
                var product = res[0];
                var quantity = parseInt(product.stock_quantity);
                var requested = parseInt(answers.quantity);

                if (quantity > requested && (quantity - requested > 0)) {
                    // console.log("THIS IS HAPPENING");
                    quantity -= requested;
                    var query = connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                'stock_quantity': quantity
                            },
                            {
                                'item_id': parseInt(answers.productID)
                            }
                        ],
                        function (err, res) {
                            console.log("Your total cost of purchase was: $" +
                                ((product.price * requested) + (product.price * requested * .07)).toFixed(2) +
                                " (including tax of 7%, since you're in Denver, CO!)");
                            inquirer.prompt([
                                {
                                    name: "purchaseAnotherProduct",
                                    type: "confirm",
                                    message: "Would you like to purchase another item?"
                                }
                            ]).then(function (answer) {
                                if (answer.purchaseAnotherProduct === true) {
                                    console.log("Great! Here's our list of products again.");
                                    displayProducts();
                                }
                                else {
                                    console.log("Okay, have a nice day! Please come back and visit Bamazon soon.");
                                    connection.end();
                                }
                            });
                        }
                    );
                }
                else if (quantity < requested && quantity != 0) {
                    console.log("Insufficient quantity! We only have " + quantity + " left in stock.");
                    inquirer.prompt([
                        {
                            name: "purchaseDifferentProduct",
                            type: "confirm",
                            message: "Would you like to purchase a different item, or fewer of your item?"
                        }
                    ]).then(function (answer) {
                        if (answer.purchaseDifferentProduct === true) {
                            console.log("Great! Here's our list of products.");
                            displayProducts();
                        }
                        else {
                            console.log("Okay, have a nice day! Please come back and visit Bamazon soon.");
                            connection.end();
                        }
                    });
                }
                else {
                    console.log("Uh oh, we don't have any of that item left in stock! You'll have to check back later.");
                    inquirer.prompt([
                        {
                            name: "purchaseDifferentProduct",
                            type: "confirm",
                            message: "Would you like to purchase a different item?"
                        }
                    ]).then(function (answer) {
                        if (answer.purchaseDifferentProduct === true) {
                            console.log("Great! Here's our list of products.");
                            displayProducts();
                        }
                        else {
                            console.log("Okay, have a nice day! Please come back and visit Bamazon soon.");
                            connection.end();
                        }
                    });
                }
            });
        };
    });
}