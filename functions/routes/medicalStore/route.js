const express = require('express');
const route = express.Router();
let { postDoneMedicinesHandlers, postPendingMedicinesHandlers, postAddAvailableMedicineshandlers, postSeeAvailableMedicineshandlers } = require('./handler');
let { verifyToken } = require('./../../verifyToken');
route.post('/doneMedicines', verifyToken, postDoneMedicinesHandlers);
route.post('/pendingMedicines', verifyToken, postPendingMedicinesHandlers);
route.post('/addAvailableMedicines', verifyToken, postAddAvailableMedicineshandlers);
route.post('/seeAvailableMedicines', verifyToken, postSeeAvailableMedicineshandlers);
module.exports = route;