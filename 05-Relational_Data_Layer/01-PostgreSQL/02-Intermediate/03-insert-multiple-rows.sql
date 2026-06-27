INSERT INTO products (name, category, price, stock, sku, description)
VALUES 
('Laptop Stand 8', 'Tech', '550000.00', 23, 'ELEC-KEY-103', 'laptop stand 5 description'),
('Laptop Stand 9', 'Tech', '400000.00', 23, 'ELEC-KEY-104', 'laptop stand 6 description'),
('Laptop Stand 10', 'Tech', '300000.00', 23, 'ELEC-KEY-105', 'laptop stand 7 description'),
('iPhone 17', 'Tech', 999.99, 50, 'APL-IP17', 'New phone'),
('Logitech Mouse', 'Tech', 79.99, 120, 'LOG-M705', 'Wireless mouse');


SELECT name, category, price, sku 
FROM products
--WHERE sku IN ('ELEC-KEY-100', 'ELEC-KEY-101', 'ELEC-KEY-102');
WHERE category = 'Tech';
