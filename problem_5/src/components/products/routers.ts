import { Router } from 'express';
import { ProductController } from './controller';
import { ProductValidation } from './validation';
import { ProductService } from './service';
import { ProductsRepository } from './repository';
import { ProductPolicy } from './policy';
import { checkPolicy } from '@middlewares/policy';
import { validate } from '@middlewares/validate';

const router = Router();
const repository = new ProductsRepository();
const policy = new ProductPolicy(repository);
const service = new ProductService(repository);
const controller = new ProductController(service);
const validation = new ProductValidation();

router.get(
  '/',
  validate(validation.list),
  checkPolicy(policy.canList.bind(policy)),
  controller.list,
);

router.post(
  '/',
  validate(validation.create),
  checkPolicy(policy.canCreate.bind(policy)),
  controller.create,
);

router.get(
  '/:id',
  validate(validation.findById),
  checkPolicy(policy.canRead.bind(policy)),
  controller.findById,
);

router.put(
  '/:id',
  validate(validation.update),
  checkPolicy(policy.canUpdate.bind(policy)),
  controller.update,
);

router.patch(
  '/:id',
  validate(validation.partialUpdate),
  checkPolicy(policy.canUpdate.bind(policy)),
  controller.partialUpdate,
);

router.delete('/:id', checkPolicy(policy.canDelete.bind(policy)), controller.delete);

export default router;
