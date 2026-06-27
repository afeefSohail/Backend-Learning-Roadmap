INSERT INTO products (
    name, 
    category,
    price,
    stock,
    sku,
    description
)
VALUES (
    'Laptop Stand',
    'electronics',
    '500000.00',
    23,
    'ELEC-KEY-003',
    'laptop stand description'
);

SELECT * FROM products WHERE sku = 'ELEC-KEY-003';