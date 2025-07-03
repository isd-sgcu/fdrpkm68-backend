import { Router } from 'express';
import { createAHouse, deleteAllHousesFromDraft, deleteOneHouseFromDraft, getAllHouses, getCurrentMemberCounts, getSelectedHousesIds, submitHousesDraft, upDateHousesDraft } from '../controllers/houseController';

const router = Router()
router.get('/getAllHouses', getAllHouses)
router.get('/getCurrentMemberCounts', getCurrentMemberCounts)
router.get('/getSelectedHousesIds/:groupId', getSelectedHousesIds)
router.patch('/upDateHousesDraft/:groupId', upDateHousesDraft)
router.post('/submitHousesDraft/:groupId', submitHousesDraft)
router.post('/createAHouse', createAHouse)
router.delete('/deleteOneHouseFromDraft/:groupId', deleteOneHouseFromDraft)
router.delete('/deleteAllHousesFromDraft/:groupId', deleteAllHousesFromDraft)

export default router