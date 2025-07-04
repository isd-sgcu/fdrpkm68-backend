import { Router } from 'express';
import * as houseController from '../controllers/houseController';

const router = Router()
router.get('/getAllHouses', houseController.getAllHouses)
router.get('/getCurrentMemberCounts', houseController.getCurrentMemberCounts)
router.get('/getSelectedHousesIds/:groupId', houseController.getSelectedHousesIds)
router.patch('/upDateHousesDraft/:groupId', houseController.upDateHousesDraft)
router.post('/submitHousesDraft/:groupId', houseController.submitHousesDraft)
router.delete('/deleteOneHouseFromDraft/:groupId', houseController.deleteOneHouseFromDraft)
router.delete('/deleteAllHousesFromDraft/:groupId', houseController.deleteAllHousesFromDraft)

export default router