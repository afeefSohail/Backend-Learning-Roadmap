-- select * - returns every cols
 SELECT * from products;

-- select specific cols is going to return the cols i want.
 SELECT name, category, price, stock FROM products;
 SELECT price FROM products;

-- AS creates an alias for the output of that col
SELECT
    name AS product_name,
    price AS selling_price,
    stock AS available_quantity
FROM products;

SELECT p.* FROM public.products AS p
ORDER BY p.is_active
