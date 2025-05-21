import { Router } from 'express';
import {
  getCart,
  addItemToCart,
  removeItemFromCart,
} from '../controllers/CartController.js';

const cartRouter = Router();

cartRouter.get('/', getCart);
cartRouter.post('/add', addItemToCart);
cartRouter.delete('/remove/:product_variant_id', removeItemFromCart);

export default cartRouter;
