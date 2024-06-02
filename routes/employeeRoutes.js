const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");

router.post("/addEmployee", employeeController.addEmployee);
router.get("/getAllEmployees", employeeController.getAllEmployees);
router.delete("/deleteEmployee/:id", employeeController.deleteEmployee);
router.put("/updateEmployee/:id", employeeController.updateEmployee);

module.exports = router;
