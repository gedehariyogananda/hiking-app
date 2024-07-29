
const Favorit = require('../../models/favorit.model');
const Product = require('../../models/product.model');

const setFavoritProductUser = async (req, res) => {
    const id = req.userData.id; // helper 
    const { product_id } = req.body;
    try {
        const existFavorit = await Favorit.findOne({ user_id : id, product_id: product_id});

        if(existFavorit){
            return res.status(400).json({
                success: false,
                message: "product already exists"
            });
        }

        const createFavorit = Favorit.create({
            user_id: id,
            product_id: product_id
        });

        if(!createFavorit){
            return res.status(400).json({
                success: false,
                message: "failed add favorit product"
            });
        }

        return res.status(200).json({
            success: true,
            message: "success add favorit product",
        });
        
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "failed add favorit product",
            error: err || "Ada kesalahan"
        });
        
    }
}

const getFavoritProductUser = async (req, res) => {
    const id = req.userData.id; 

    try {
        const initFavoritData = await Favorit.find( { user_id : id } );

        if(!initFavoritData){
            return res.status(400).json({
                success: false,
                message: "favorit product not found"
            });
        }

        const getAllProduct = await Product.find({});

        const favoritProduct = [];

        // AMBIL DATA FAVORIT YANG ADA EXIST
        for (let i = 0; i < initFavoritData.length; i++) {
            for (let j = 0; j < getAllProduct.length; j++) {
                if(initFavoritData[i].product_id == getAllProduct[j].id){
                    favoritProduct.push(getAllProduct[j]);
                }
            }
        }

        if(favoritProduct.length > 0){
            return res.status(200).json({
                success: true,
                message: "success get favorit product",
                data: favoritProduct
            });
        }

        return res.status(404).json({
            success: false,
            message: "favorit product not found"
        });
        
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "failed get favorit product",
            error: err || "Ada kesalahan"
        });
        
    }
}

const deleteFavoritProductUser = async (req, res) => {
    const id = req.userData.id;
    const { product_id } = req.body;
    
    try {
        const allFavorit = await Favorit.find({ user_id : id} && { product_id : product_id });

        if(allFavorit.length == 0){
            return res.status(400).json({
                success: false,
                message: "favorit product not found"
            });
        }

        const deleteFavorit = await Favorit.deleteOne({user_id : id} && {product_id : product_id});

        if(deleteFavorit){
            return res.status(200).json({
                success: true,
                message: "success delete favorit product"
            });
        }

        return res.status(400).json({
            success: false,
            message: "failed delete favorit product"
        });
        
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "failed delete favorit product",
            error: err || "Ada kesalahan"
        });
    }
}

module.exports = {
    setFavoritProductUser: setFavoritProductUser,
    getFavoritProductUser: getFavoritProductUser,
    deleteFavoritProductUser: deleteFavoritProductUser
};