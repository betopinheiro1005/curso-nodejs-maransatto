const mysql = require('../mysql');

exports.getProducts = async (req, res, next) => {
    try {
        const result = await mysql.execute("SELECT * FROM products;")
        const response = {
            quantity: result.length,
            products: result.map(product => {
                return{
                    productId: product.productId,
                    name: product.name,
                    price: product.price,
                    productImage: product.productImage,
                    request: {
                        type: 'GET',
                        description: 'Retorna os detalhes de um produto específico',
                        url: process.env.URL_API + 'products/' + product.productId
                    }
                }
            })
        }
        return res.status(200).send({response});
    } catch (error) {
        return res.status(500).send({error: error});        
    }
};

exports.postProduct = async (req, res, next) => {
    try {
        const query = "INSERT INTO products (name, price, productImage) VALUES (?,?,?)";
        const result = await mysql.execute(query, [
            req.body.name,
            req.body.price,
            req.file.path            
        ]);
        const response = {
            message: "Produto inserido com sucesso!",
            createdProduct: {
                productId: result.insertId,
                name: req.body.name,
                price: req.body.price,
                productImage: req.file.path,
                request: {
                    type: 'POST',
                    description: 'Retorna todos os produtos',
                    url: process.env.URL_API + 'products'
                }
            }
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(500).send({error: error});
    }
};

exports.getProductDetail = async (req, res, next) => {
    try {
        const query = "SELECT * FROM products WHERE productId = ?";
        const result = await mysql.execute(query, [
            req.params.productId
        ]);
        const response = {
            product: {
                productId: result[0].productId,
                name: result[0].name,
                price: result[0].price,
                productImage: result[0].productImage,
                request: {
                    type: 'GET',
                    description: 'Retorna todos os produtos',
                    url: process.env.URL_API + 'products'
                }
            }
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({error: error});
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const query = "UPDATE products SET name = ?, price = ? WHERE productId = ?";
        await mysql.execute(query, [
            req.body.name,
            req.body.price,
            req.params.productId
        ]);
        const response = {
            message: 'Produto atualizado com sucesso',
            upatedProduct: {
                productId: req.params.productId,
                name: req.body.nome,
                price: req.body.preco,
                request: {
                    type: 'GET',
                    description: 'Retorna os detalhes de um produto específico',
                    url: process.env.URL_API + 'products/' + req.params.productId
                }
            }
        }
        return res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const query = "DELETE FROM products WHERE productId = ?";
        await mysql.execute(query, [
            [req.params.productId]
        ]);
        const response = {
            message: "Produto removido com sucesso!",
            request: {
                type: 'POST',
                description: 'Insere um produto',
                url: process.env.URL_API + 'products',
                body: {
                    name: 'String',
                    price: 'Number'
                }
            }
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({error: error});
    }
};
