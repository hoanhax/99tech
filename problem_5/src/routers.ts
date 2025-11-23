// routes.ts
import { Router } from 'express';
import productRoutes from '@components/products/routers';
import { authenticate } from '@middlewares/authenticate';

const router = Router();

// Register component routes
// All routers in product need authenticate, so we set authenticate middleware here
router.use('/products', authenticate, productRoutes);

export default router;
