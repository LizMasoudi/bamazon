DROP DATABASE IF EXISTS bamazon; 

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL, 
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUE 
('Toaster oven', 'Home & Kitchen', 100.00, 5),
('Fleece blanket', 'Home & Kitchen', 20.50, 10), 
('iPad', 'Electronics', 1200.00, 8),
('Game of Thrones Five Book Collection', 'Books', 39.99, 15),
('Logitech Wireless Mouse', 'Electronics', 14.75, 20), 
('Monopoly', 'Toys & Games', 14.82, 20),  
('Camping Tent', 'Sports & Outdoors', 79.88, 10),  
('The Night Circus', 'Books', 9.99, 15),  
('Bohemian Blue Stacked Glass Table Lamp', 'Home & Kitchen', 49.99, 8),  
('Garnier Fructis Shampoo + Conditioner', 'Beauty & Personal Care', 9.35, 28);

SELECT * FROM products;