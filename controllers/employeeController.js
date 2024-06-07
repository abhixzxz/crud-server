const { db } = require("../config/db");

const addEmployee = (req, res) => {
  const { firstName, lastName, company, email, phone } = req.body;

  if (!firstName || !lastName || !company) {
    return res
      .status(400)
      .json({ message: "FirstName, lastName, and company are required" });
  }

  const checkCompanySql = "SELECT id FROM company_details WHERE id = ?";
  db.query(checkCompanySql, [company], (err, results) => {
    if (err) {
      console.error("Error occurred:", err);
      return res.status(500).json({ message: "Something went wrong" });
    }
    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid company ID" });
    }
    const insertEmployeeSql =
      "INSERT INTO employee_details (firstName, lastName, company, email, phone) VALUES (?, ?, ?, ?, ?)";
    db.query(
      insertEmployeeSql,
      [firstName, lastName, company, email, phone],
      (err, result) => {
        if (err) {
          console.error("Error occurred:", err);
          return res.status(500).json({ message: "Something went wrong" });
        }
        return res.status(201).json({
          message: "Employee added successfully",
          id: result.insertId,
        });
      }
    );
  });
};

const getAllEmployees = (req, res) => {
  const sql = "SELECT * FROM employee_details";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error occurred:", err);
      return res.status(500).json({ message: "Something went wrong" });
    }
    return res.status(200).json(results);
  });
};

const deleteEmployee = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM employee_details WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error occurred:", err);
      return res.status(500).json({ message: "Something went wrong" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }
    return res.status(200).json({ message: "Employee deleted successfully" });
  });
};

const updateEmployee = (req, res) => {
  const employeeId = req.params.id;
  const { firstName, lastName, company, email, phone } = req.body;

  if (company) {
    const checkCompanySql = "SELECT id FROM company_details WHERE id = ?";
    db.query(checkCompanySql, [company], (err, results) => {
      if (err) {
        console.error("Error occurred:", err);
        return res.status(500).json({ message: "Something went wrong" });
      }
      if (results.length === 0) {
        return res.status(400).json({ message: "Invalid company ID" });
      }

      updateEmployeeDetails();
    });
  } else {
    updateEmployeeDetails();
  }

  function updateEmployeeDetails() {
    let sql = "UPDATE employee_details SET";
    const params = [];
    if (firstName) {
      sql += " firstName = ?,";
      params.push(firstName);
    }
    if (lastName) {
      sql += " lastName = ?,";
      params.push(lastName);
    }
    if (company) {
      sql += " company = ?,";
      params.push(company);
    }
    if (email) {
      sql += " email = ?,";
      params.push(email);
    }
    if (phone) {
      sql += " phone = ?,";
      params.push(phone);
    }
    sql = sql.slice(0, -1);

    sql += " WHERE id = ?";
    params.push(employeeId);

    db.query(sql, params, (err, result) => {
      if (err) {
        console.error("Error occurred:", err);
        return res.status(500).json({ message: "Something went wrong" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Employee not found" });
      }
      return res.status(200).json({ message: "Employee updated successfully" });
    });
  }
};

module.exports = {
  addEmployee,
  getAllEmployees,
  deleteEmployee,
  updateEmployee,
};
