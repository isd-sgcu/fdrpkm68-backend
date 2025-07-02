import { Router } from 'express';
import { createHousesDraft, deleteAllHousesFromDraft, deleteOneHouseFromDraft, getAllHouses, getSelectedHouses, submitHousesDraft, upDateHousesDraft } from '../controllers/houseController';

const router = Router()
router.get('/getAllHouses', getAllHouses)
router.get('/getSelectedHouses', getSelectedHouses)
router.post('/createHousesDraft', createHousesDraft)
router.patch('/upDateHousesDraft', upDateHousesDraft)
router.post('/submitHousesDraft', submitHousesDraft)
router.delete('/deleteOneHouseFromDraft', deleteOneHouseFromDraft)
router.delete('/deleteAllHousesFromDraft', deleteAllHousesFromDraft)

export default router