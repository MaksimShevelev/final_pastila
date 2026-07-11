import usersRouter from "./usersRouter.js"; 
import productsRouter from "./productsRouter.js"; 
import categorysRouter from "./categorysRouter.js";

function routerAPI(app) {

    app.use('/api/users', usersRouter);

    
    app.use('/api/products', productsRouter); 
    
    app.use('/api/categorys', categorysRouter); 
    
}

export default routerAPI;
