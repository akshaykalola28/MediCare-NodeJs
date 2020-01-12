const express = require('express');
const route = express.Router();
let { postDoneMedicinesHandlers, postPendingMedicinesHandlers } = require('./handler');
let { verifyToken } = require('./../../verifyToken');
route.post('/doneMedicines', verifyToken, postDoneMedicinesHandlers);
route.post('/pendingMedicines', verifyToken, postPendingMedicinesHandlers);
module.exports = route;