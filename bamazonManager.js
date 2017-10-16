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
    prompt();
});

var prompt = function () {
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory for an Item", "Add New Product", "Quit"],
        }
    ]).then(function (answer) {
        if (answer.action === "View Products for Sale") {
            displayProducts();
        }
        else if (answer.action === "View Low Inventory") {
            displayLowInventory();
        }
        else if (answer.action === "Add to Inventory for an Item") {
            addToInventory();
        }
        else if (answer.action === "Add New Product") {
            addNewProduct();
        }
        else if (answer.action === "Quit") {
            connection.end();
        }
    });
}

function displayProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        var table = new AsciiTable("Bamazon Product List");
        table.setHeading('ID', 'Product Name', 'Department Name', 'Price', 'Quantity in Stock');
        for (var i = 0; i < res.length; i++) {
            table.addRow(res[i].item_id, res[i].product_name, res[i].department_name, ("$" + res[i].price), res[i].stock_quantity);
        }
        console.log(table.toString());
        prompt();
    });
}

function displayLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity<=?", [5], function (err, res) {
        if (res.length === 0) {
            console.log("Looks like you aren't running low (have less than five of the item) on anything!");
            prompt();
        }
        else {
            var table = new AsciiTable("Bamazon Product List: Inventory <= 5");
            table.setHeading('ID', 'Product Name', 'Department Name', 'Price', 'Quantity in Stock');
            for (var i = 0; i < res.length; i++) {
                table.addRow(res[i].item_id, res[i].product_name, res[i].department_name, ("$" + res[i].price), res[i].stock_quantity);
            }
            console.log(table.toString());
            prompt();
        }
    });
}

function addToInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        var table = new AsciiTable("Bamazon Product List");
        table.setHeading('ID', 'Product Name', 'Department Name', 'Price', 'Quantity in Stock');
        for (var i = 0; i < res.length; i++) {
            table.addRow(res[i].item_id, res[i].product_name, res[i].department_name, ("$" + res[i].price), res[i].stock_quantity);
        }
        console.log(table.toString());

        inquirer.prompt([
            {
                name: "productID",
                message: "Please enter the ID of the item you wish to update the quantity for: "
            },
            {
                name: "quantityToAdd",
                message: "How many do you wish to add to inventory? "
            }
        ]).then(function (answers) {
            if (answers.productID === "" || answers.quantityToAdd === "") {
                console.log("Oops, you need to enter information to do anything to manage the Bamazon store!");
                prompt();
            }
            else {
                connection.query("SELECT * FROM products WHERE item_id=?", [answers.productID], function (err, res) {
                    var product = res[0];
                    var quantity = parseInt(product.stock_quantity);
                    var requested = parseInt(answers.quantityToAdd);



                    quantity = quantity + requested;

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
                            console.log(requested + " items have been added to the inventory for " + product.product_name);
                            var table = new AsciiTable("Product With Updated Inventory");
                            table.setHeading('ID', 'Product Name', 'Department Name', 'Price', 'Quantity in Stock');
                            table.addRow(product.item_id, product.product_name, product.department_name, ("$" + product.price), quantity);
                            console.log(table.toString());
                            prompt();
                        }
                    );

                });
            }
        });
    });
}

function addNewProduct() {
    inquirer.prompt([
        {
            name: "name",
            message: "Please enter the name of the product: "
        },
        {
            name: "department",
            type: "list",
            message: "Please add the correct department to the product: ",
            choices: ['Home & Kitchen', 'Electronics', 'Books', 'Toys & Games', 'Sports & Outdoors', 'Beauty & Personal Care', 'Miscellaneous']
        },
        {
            name: "price",
            message: "Please enter the price point for the item: "
        },
        {
            name: "quantity",
            message: "Please enter the stock quantity of the item: "
        }
    ]).then(function (answers) {
        if (answers.name === "" || answers.department === "" || answers.price === "" || answers.quantity === "") {
            console.log("Oops, you need to enter information to do anything to manage the Bamazon store!");
            prompt();
        }
        var query = connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: answers.name,
                department_name: answers.department,
                price: (parseFloat(answers.price)).toFixed(2),
                stock_quantity: answers.quantity
            },
            function (err, res) {
                console.log(res.affectedRows + " product(s) added!\n");
                prompt()
            }
        );
    });
}
