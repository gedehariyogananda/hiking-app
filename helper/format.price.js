const formatPrices = (price) => {
    return 'Rp. ' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const replaceFormatRp = (price) => {
    return price.replace(/Rp./g, "");
}


module.exports = {
    formatPrices,
    replaceFormatRp
}
