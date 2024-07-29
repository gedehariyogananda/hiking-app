const Product = require('../../models/product.model');

const getAllProduct = async (req, res) => {
    const products = await Product.find({});
    if (!products) {
        return res.status(404).json({
            success: false,
            message: "failed get data"
        });
    }

    return res.status(200).json({
        success: true,
        message: "success get data",
        data: products
    });
}

const searchProductByName = async (req, res) => {
    try {
        const keyword = req.query.keyword;

        const dataset = await Product.find({
            name_product: { $regex: keyword, $options: 'i' } // 'i' untuk case-insensitive search
        });

        if (dataset.length > 0) {
            return res.status(200).json({
                success: true,
                message: '(SUCCESS) get data product by name',
                data: dataset,
            });
        } else {
            return res.status(404).json({
                success: false,
                message: '(FAILED) product not found',
            });
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'An error occurred',
            error: err.message,
        });
    }
}


const getProductById = async (req, res) => {
    const id = req.params.id;

    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "failed get data"
        });
    }

    return res.status(200).json({
        success: true,
        message: "success get data",
        data: product
    });

}

const getProductCategoryTenda = async (req, res) => {
   
    try {
        const dataset = await Product.find({category_product : 'Tenda'});
        if (dataset.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Success get data",
                data: dataset
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Failed to get data",
            });
        }
        
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to get data",
            data: err
        });
        
    }

}

const getProductCategoryAlatCamping = async (req, res) => {
    try {
        const dataset = await Product.find({category_product : 'Alat camping'});
        if (dataset.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Success get data",
                data: dataset
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Failed to get data",
            });
        }
        
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to get data",
            data: err
        });
        
    }
}

const getProductCategoryLainnya = async (req, res) => {
    try {
        const dataset = await Product.find({category_product : 'Lainnya'});
        if (dataset.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Success get data",
                data: dataset
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Failed to get data",
            });
        }
        
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to get data",
            data: err
        });
        
    }
}

const getProductCategoryRekomendasi = async (req, res) => {
    try {
        const get3tenda = await Product.find({category_product : 'Tenda'}).limit(3);
        const get3alatcamping = await Product.find({category_product : 'Alat camping'}).limit(3);
        const get3lainnya = await Product.find({category_product : 'Lainnya'}).limit(3);

        const concateData = await get3tenda.concat(get3alatcamping, get3lainnya);

        if (concateData.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Success get data",
                data: concateData
            });
        }

        return res.status(404).json({
            success: false,
            message: "Failed to get data",
        });
        
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to get data",
            data: err
        });
        
    }
}

module.exports = {
    getAllProduct,
    searchProductByName,
    getProductById,
    getProductCategoryTenda,
    getProductCategoryAlatCamping,
    getProductCategoryLainnya,
    getProductCategoryRekomendasi
}