import { Router } from 'express';
import * as houseController from '../controllers/houseController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router()
router.get('/getHouses', authMiddleware, houseController.getAllHouses)
router.get('/getHousesMemberCounts', authMiddleware, houseController.getCurrentMemberCounts)
router.get('/getSelectedHousesIds/:groupId', authMiddleware, houseController.getGroupSelectedHousesIds)
router.patch('/update/:groupId', authMiddleware, houseController.upDateGroupHouses)
router.post('/submit/:groupId', authMiddleware, houseController.submitGroupHouses)
router.delete('/deleteOne/:groupId', authMiddleware, houseController.deleteOneHouseFromGroup)
router.delete('/deleteAll/:groupId', authMiddleware, houseController.deleteAllHousesFromGroup)

export default router