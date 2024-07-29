const Product = require('../../models/product.model');
const UserPurchased = require('../../models/userpurchase.model');
const formatPrices = require('../../../helper/format.price');

const insertPurchased = async (req, res) => {
    const id = req.userData.id;
    const { product_id, start_borrow_purchased, end_borrow_purchased } = req.body;

    try {
        const productInit = await Product.findOne({ id: product_id });
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
            result_price_purchased: formatPrices(initPrice),
            status_purchased: "belum_submit",
            checkout: false,
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
            data: insertPurchased
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
    const userPuchased = await UserPurchased.find({ user_id: id, status_purchased: 'belum-submit' });

    try {

        // looping data userPurchased, cari product_id yang sama 
        const data = [];
        
        for (let i = 0; i < userPuchased.length; i++) {
            const orderanSama = false;

            for (let j = 0; j < data.length; j++) {
                if (userPuchased[i].product_id == data[j].product_id && UserPurchased['start_borrow_purchased'] == data[j].start_borrow_purchased && UserPurchased['end_borrow_purchased'] == data[j].end_borrow_purchased)  {
                    orderanSama = true;
                    break;
                }
            }

            if (!orderanSama) {
                const initBarangBeli = await UserPurchased.find({ product_id: userPuchased[i].product_id, user_id: id, status_purchased: 'belum-submit' });
                const totalBarangBeli = initBarangBeli.length;

                data.push({
                    id: userPuchased[i].id,
                    product_id: userPuchased[i].product_id,
                    name_product: userPuchased[i].name_product,
                    image_product: userPuchased[i].image_product,
                    start_borrow_purchased: userPuchased[i].start_borrow_purchased,
                    end_borrow_purchased: userPuchased[i].end_borrow_purchased,
                    result_price_purchased: formatPrices.replaceFormatRp(userPuchased[i].result_price_purchased) * totalBarangBeli,
                    total_barang_beli: totalBarangBeli,
                    status_purchased: userPuchased[i].status_purchased,
                    attemp_purchased: userPuchased[i].attemp_purchased
                });
            }
        }

        if(data.length > 0){
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
        const keranjang = await UserPurchased.findOne( {id : idPurchased} );

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
        const keranjang = await UserPurchased.findOne( {id : idPurchased} );

        if(!keranjang){
            return res.status(404).json({
                success: false,
                message: "keranjang not found"
            });
        }

        const hapusKeranjang = await UserPurchased.deleteOne({ id : idPurchased });

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
    const keranjang = await UserPurchased.find({user_id : id});
    
    try {

        const valueCheckout = 0;

        for (let i = 0; i < keranjang.length; i++) {
            if(keranjang[i].checkout > valueCheckout){
                valueCheckout = keranjang[i].checkout;
            }
        }
        
        const newValueCheckout = valueCheckout + 1;

        // setelah berhasil, update status nya menjadi sudah submit dan checkout menjadi newValueCheckout 
        const updateCheckout = await UserPurchased.updateMany({ user_id : id }, { status_purchased: "sudah-submit", checkout: newValueCheckout });

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

        if(!userPurchased){
            return res.status(404).json({
                success: false,
                message: "data not found"
            });
        }

        const totalHarga = 0;

        for (let i = 0; i < userPurchased.length; i++) {
            const priceInit = formatPrices.replaceFormatRp(userPurchased[i].result_price_purchased);
            totalHarga += priceInit;
        }

        return res.status(200).json({
            success: true,
            message: "success get total harga",
            data: formatPrices(totalHarga)
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
        const userPurchasedStatusSudahSubmit = await UserPurchased.find({ user_id : id, status_purchased: 'sudah_submit' }. sort({checkout: 'desc'}));

        if(!userPurchasedStatusSudahSubmit){
            return res.status(404).json({
                success: false,
                message: "data not found"
            });
        }

        // map data dengan table product 
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