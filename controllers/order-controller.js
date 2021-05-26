const mysql = require('../mysql');

exports.getOrders = async (req, res, next) => {

    try {
        const query = `select 
                    orders.orderId,
	                orders.quantity,
                    orders.productId,
                    products.name,
                    products.price 
            from orders
            inner join products
            on products.productId = orders.productId`;
        const result = await mysql.execute(query);
        const response = {
            orders: result.map(order => {
                return{
                    orderId: order.orderId,
                    quantity: order.quantity,
                    product: {
                        productId: order.productId,
                        name: order.name,
                        price: order.price
                    },
                    request: {
                        type: 'GET',
                        description: 'Retorna os detalhes de um pedido específico',
                        url: process.env.URL_API + 'orders/' + order.orderId
                    }
                }
            })
        }
        return res.status(200).send({response});
    } catch (error) {
        return res.status(500).send({error: error});
    }
};

exports.postOrder = async (req, res, next) => {
    try {
        const queryProduct = 'SELECT * FROM products WHERE productId = ?';
        const resultProduct = await mysql.execute(queryProduct, [req.body.productId]);

        if (resultProduct.length == 0) {
            return res.status(404).send({ message: 'Produto não encontrado'});
        }
        
        const queryOrder  = 'INSERT INTO orders (productId, quantity) VALUES (?,?)';
        const resultOrder = await mysql.execute(queryOrder, [
            req.body.productId,
            req.body.quantity            
        ]);

        const response = {
            message: 'Pedido inserido com sucesso',
            createdOrder: {
                orderId: resultOrder.insertId,
                id_produto: req.body.productId,
                quantidade: req.body.quantity,
                request: {
                    type: 'GET',
                    description: 'Retorna todos os pedidos',
                    url: process.env.URL_API + 'orders'
                }
            }
        }
        return res.status(201).send(response);

    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.getOrderDetail = async (req, res, next) => {
    try {
        const query = "SELECT * FROM orders WHERE orderId = ?";
        const result = await mysql.execute(query, [req.params.orderId]);
        const response = {
            order: {
                orderId: result[0].orderId,
                quantity: result[0].quantity,
                productId: result[0].productId,
                request: {
                    type: 'GET',
                    description: 'Retorna todos os pedidos',
                    url: process.env.URL_API + 'orders'
                }
            }
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({error: error});
    }
};

exports.deleteOrder = async (req, res, next) => {
    try {
        const query = "DELETE FROM orders WHERE orderId = ?";    
        const result = await mysql.execute(query, [req.params.orderId]);
        const response = {
            message: "Pedido removido com sucesso!",
            request: {
                type: 'POST',
                description: 'Insere um pedido',
                url: process.env.URL_API + 'orders',
                body: {
                    productId: 'Number',
                    quantity: 'Number'
                }
            }
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({error: error});
    }
};