const Product = require('../../models/product.model');
const UserPurchased = require('../../models/userpurchase.model');
const formatPrices = require('../../../helper/format.price');

const insertPurchased = async (req, res) => {
    const id = req.userData.id;
    const { product_id, start_borrow_purchased, end_borrow_purchased } = req.body;

    try {
        const productInit = await Product.findById({ _id: product_id });
        
        if(!productInit){
            return res.status(404).json({
                success: false,
                message: "product not found"
            });
        }

        const priceProductInisiate = productInit.priceday_product;

        // selisih hari pinjam
        const selisihHari = Math.abs(new Date(end_borrow_purchased) - new Date(start_borrow_purchased));
        const diffDays = Math.ceil(selisihHari / (1000 * 60 * 60 * 24));

        const initPrice = priceProductInisiate * diffDays;

        const insertPurchased = await UserPurchased.create({
            user_id: id,
            product_id: product_id,
            start_borrow_purchased: start_borrow_purchased,
            end_borrow_purchased: end_borrow_purchased,
            result_price_purchased: initPrice,
            status_purchased: "belum_submit",
            checkout: 0,
            attemp_purchased: "belum_disetujui"
        });

        if (!insertPurchased) {
            return res.status(400).json({
                success: false,
                message: "failed add purchased"
            });
        }

        return res.status(200).json({
            success: true,
            message: "success add purchased",
            data: {
                id: insertPurchased.id,
                product_id: insertPurchased.product_id,
                name_product: productInit.name_product,
                image_product: productInit.image_product,
                start_borrow_purchased: insertPurchased.start_borrow_purchased,
                end_borrow_purchased: insertPurchased.end_borrow_purchased,
                result_price_purchased: insertPurchased.result_price_purchased,
                status_purchased: insertPurchased.status_purchased,
                attemp_purchased: insertPurchased.attemp_purchased
            }
        });
        
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to add purchased",
            error: err
        });
    }
}

const getKeranjang = async (req, res) => {
    const id = req.userData.id;
    const userPurchased = await UserPurchased.find({ user_id: id, status_purchased: 'belum_submit' });
    const productData = await Product.find();

    try {
        const data = [];
        let orderanSama = false;

        for (let i = 0; i < userPurchased.length; i++) {
            const purchase = userPurchased[i];
            let totalBarangBeli = 1;

            for (let k = 0; k < data.length; k++) {
                if (data[k].product_id === purchase.product_id) {
                    orderanSama = true;
                    data[k].total_barang_beli += 1;
                    data[k].result_price_purchased = data[k].total_barang_beli * purchase.result_price_purchased;
                    break;
                }
            }

            if (!orderanSama) {
                const product = productData.find(p => p.id == purchase.product_id);
                if (product) {
                    data.push({
                        id: purchase.id,
                        product_id: product.id,
                        name_product: product.name_product,
                        image_product: product.image_product,
                        start_borrow_purchased: purchase.start_borrow_purchased,
                        end_borrow_purchased: purchase.end_borrow_purchased,
                        result_price_purchased: purchase.result_price_purchased,
                        status_purchased: purchase.status_purchased,
                        attemp_purchased: purchase.attemp_purchased,
                        total_barang_beli: totalBarangBeli
                    });
                }
            } else {
                orderanSama = false;
            }
        }

        if (data.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Success get data",
                data: data
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
            error: err
        });
    }
}


const tambahSatuBarang = async (req, res) => {
    const id = req.userData.id;
    const idPurchased = req.params.id;

    try {
        const keranjang = await UserPurchased.findOne( {_id : idPurchased} );

        if(!keranjang){
            return res.status(404).json({
                success: false,
                message: "keranjang not found"
            });
        }

        const tambahKeranjang = await UserPurchased.create({
            user_id: id,
            product_id: keranjang.product_id,
            start_borrow_purchased: keranjang.start_borrow_purchased,
            end_borrow_purchased: keranjang.end_borrow_purchased,
            result_price_purchased: keranjang.result_price_purchased,
            status_purchased: keranjang.status_purchased,
            attemp_purchased: keranjang.attemp_purchased
        });

        if(!tambahKeranjang){
            return res.status(400).json({
                success: false,
                message: "failed add data"
            });
        }

        return res.status(201).json({
            success: true,
            message: "success add data",
            data: tambahKeranjang
        });
        
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to add data",
            error: err
        });
        
    }

}

const hapusSatuBarang = async (req, res) => {
    const id = req.userData.id;
    const idPurchased = req.params.id;

    try {
        const keranjang = await UserPurchased.findOne( {_id : idPurchased} );

        if(!keranjang){
            return res.status(404).json({
                success: false,
                message: "keranjang not found"
            });
        }

        const hapusKeranjang = await UserPurchased.deleteOne({ _id : idPurchased });

        if(hapusKeranjang){
            return res.status(200).json({
                success: true,
                message: "success delete data"
            });
        }

        return res.status(400).json({
            success: false,
            message: "failed delete data"
        });
        
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete data",
            error: err
        });
        
    }

}

const checkoutKeranjang = async (req, res) => {
    const id = req.userData.id;
    const keranjang = await UserPurchased.find({user_id : id, status_purchased : 'belum_submit'});
    
    try {

        const valueCheckout = 0;

        for (let i = 0; i < keranjang.length; i++) {
            if(keranjang[i].checkout > valueCheckout){
                valueCheckout = keranjang[i].checkout;
            }
        }
        
        const newValueCheckout = valueCheckout + 1;

        // setelah berhasil, update status nya menjadi sudah submit dan checkout menjadi newValueCheckout 
        const updateCheckout = await UserPurchased.updateMany({ user_id : id }, { status_purchased: "sudah_submit", checkout: newValueCheckout });

        // if keranjang kosong 
        if(!updateCheckout){
            return res.status(400).json({
                success: false,
                message: "failed checkout data"
            });
        }

        return res.status(200).json({
            success: true,
            message: "success checkout data",
            data: updateCheckout
        });
        
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to checkout data",
            error: err
        });
        
    }

}

const getRiwayatPembelian = async (req, res) => {

    const id = req.userData.id;

    try {
        // buatkan order by checkout value
        const data = await UserPurchased.find({ user_id : id, start_borrow_purchased: 'sudah-submit' }).sort({checkout: 'desc'});

        if(!data) {
            return res.status(404).json({
                success: false,
                message: "failed get data"
            });
        }

        const riwayatPembeli = [];

        for (let i = 0; i < data.length; i++) {
            const gruppingData = {};

            const checkout = data[i].checkout;

            const singleData = {
                id: data[i].id,
                product_id: data[i].product_id,
                name_product: data[i].name_product,
                image_product: data[i].image_product,
                start_borrow_purchased: data[i].start_borrow_purchased,
                end_borrow_purchased: data[i].end_borrow_purchased,
                result_price_purchased: data[i].result_price_purchased,
                status_purchased: data[i].status_purchased,
                attemp_purchased: data[i].attemp_purchased,

            }

            if (!groupedData[checkout]) {
                groupedData[checkout] = [];
            }
            groupedData[checkout].push(singleData);
        
        }

        if (groupedData.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Success get data",
                data: groupedData
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
            error: err
        });
        
    }

}

const hapusSemuaBarang = async (req, res) => {
    const id = req.userData.id;
    const idProduct = req.params.id;

    try {
        const keranjang = await UserPurchased.deleteMany({ user_id : id, product_id: idProduct });

        if(keranjang){
            return res.status(200).json({
                success: true,
                message: "success delete data"
            });
        }

        return res.status(400).json({
            success: false,
            message: "failed delete data"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete data",
            error: err
        });
        
    }
}

const getCheckoutTotal = async (req, res) => {
    const id = req.userData.id;

    try {
        const userPurchased = await UserPurchased.find( {user_id : id, status_purchased: 'belum_submit' });

        if(userPurchased.length === 0){
            return res.status(404).json({
                success: false,
                message: "data not found"
            });
        }

        let totalHarga = 0;

        for (let i = 0; i < userPurchased.length; i++) {
            const priceInit = parseFloat(userPurchased[i].result_price_purchased);

            if (!isNaN(priceInit)) {
                totalHarga += priceInit;
            } else {
                console.error(`Invalid price: ${userPurchased[i].result_price_purchased}`);
            }
        }

        return res.status(200).json({
            success: true,
            message: "success get total harga",
            data: totalHarga
        });
        
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to get data",
            error: err
        });
        
    }

}

const getRiwayatPembelianUser = async (req, res) => {
    const id = req.userData.id;

    try {
        const userPurchasedStatusSudahSubmit = await UserPurchased.find({ user_id : id, status_purchased: 'sudah_submit'});
        console.log(userPurchasedStatusSudahSubmit);
        if(!userPurchasedStatusSudahSubmit){
            return res.status(404).json({
                success: false,
                message: "data not found"
            });
        }

        const mappedData = [];
        for(let i = 0; i < userPurchasedStatusSudahSubmit.length; i++){
            const productData = await Product.findById(userPurchasedStatusSudahSubmit[i].product_id);
            if(productData){
                mappedData.push({
                    id: userPurchasedStatusSudahSubmit[i].id,
                    product_id: userPurchasedStatusSudahSubmit[i].product_id,
                    name_product: productData.name_product,
                    image_product: productData.image_product,
                    start_borrow_purchased: userPurchasedStatusSudahSubmit[i].start_borrow_purchased,
                    end_borrow_purchased: userPurchasedStatusSudahSubmit[i].end_borrow_purchased,
                    result_price_purchased: userPurchasedStatusSudahSubmit[i].result_price_purchased,
                    status_purchased: userPurchasedStatusSudahSubmit[i].status_purchased,
                    attemp_purchased: userPurchasedStatusSudahSubmit[i].attemp_purchased
                });
            }
        };

        if(mappedData.length > 0){
            return res.status(200).json({
                success: true,
                message: "success get data",
                data: mappedData
            });
        }

        return res.status(404).json({
            success: false,
            message: "data not found"
        });
        
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to get data",
            error: err
        });
        
    }
}

// ----------------------------- admin persetujuan acc purchased ------------------------- //

const editAttempPurchased = async (req, res) => {
    const valueCheckout = req.params.valueCheckout;
    const userId = req.params.userId;

    try {
        const updateAttempPurchased = await UserPurchased.updateMany({ user_id : userId, checkout: valueCheckout }, { attemp_purchased: "sudah_disetujui" });

        if(updateAttempPurchased){
            return res.status(200).json({
                success: true,
                message: "success edit data",
                data: updateAttempPurchased
            });
        }

        return res.status(400).json({
            success: false,
            message: "failed edit data"
        });
        
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to edit data",
            error: err
        });
        
    }

}


module.exports = {
    insertPurchased,
    getKeranjang,
    tambahSatuBarang,
    hapusSatuBarang,
    checkoutKeranjang,
    getCheckoutTotal,
    hapusSemuaBarang,
    getRiwayatPembelian,
    getRiwayatPembelianUser,
    editAttempPurchased
};