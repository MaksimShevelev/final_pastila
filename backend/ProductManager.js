import fs from "fs/promises";
import crypto from "crypto"; 
const path = './products.json';

export default class ProductManager{
    products = [];
    constructor(products=[]){
        this.products = products
    }
    randomID(){
        return crypto.randomUUID();
    }
    
    async addProduct(product){
        
        await this.getProducts();
        product.id = this.randomID();
        this.products.push( product);
        
        
        const data = JSON.stringify( this.products, null, 2);
        try {
            await fs.writeFile( path, data );
            return product.id;
        } catch (error) {
            console.error(error);
        }
    }
    async getProducts(){
        try {
            const data = await fs.readFile(path);
            this.products = JSON.parse( data);
            return this.products;
        } catch (error) {
            console.error(error);
        }
    }

    async getProductById(id){
        const products = await this.getProducts();
        const product = products.find(  item => item.id == id  );
        return product ? product : {};
    }
}




