const { db } = require("../config/db");

const addCompany = (req, res) => {
  const { name, email, website } = req.body;
  const defaultAvatar =
    "https://raw.githubusercontent.com/nz-m/public-files/main/dp.jpg";
  const logo = req?.file?.filename
    ? `${req.protocol}://${req.get("host")}/storage/app/public/${
        req.file.filename
      }`
    : defaultAvatar;

  const sql =
    "INSERT INTO company_details (name, email, logo, website) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, email, logo, website], (err, result) => {
    if (err) {
      console.error("Error occurred:", err);
      return res.status(500).json({ message: "Something went wrong" });
    }
    return res
      .status(201)
      .json({ message: "Company added successfully", id: result.insertId });
  });
};

const getAllCompany = (req, res) => {
  const sql = "SELECT * FROM company_details";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error occurred:", err);
      return res.status(500).json({ message: "Something went wrong" });
    }
    return res.status(200).json(results);
  });
};

const deleteCompany = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM company_details WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error occurred:", err);
      return res.status(500).json({ message: "Something went wrong" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Company not found" });
    }
    return res.status(200).json({ message: "Company deleted successfully" });
  });
};

const updateCompany = (req, res) => {
  const companyId = req.params.id;
  const { name, email, website } = req.body;

  let logo = null;
  if (req.file) {
    logo = `${req.protocol}://${req.get("host")}/storage/app/public/${
      req.file.filename
    }`;
  }

  let sql = "UPDATE company_details SET";
  const params = [];
  if (name) {
    sql += " name = ?,";
    params.push(name);
  }
  if (email) {
    sql += " email = ?,";
    params.push(email);
  }
  if (logo) {
    sql += " logo = ?,";
    params.push(logo);
  }
  if (website) {
    sql += " website = ?,";
    params.push(website);
  }

  sql = sql.slice(0, -1);
  sql += " WHERE id = ?";
  params.push(companyId);

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error occurred:", err);
      return res.status(500).json({ message: "Something went wrong" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Company not found" });
    }
    return res.status(200).json({ message: "Company updated successfully" });
  });
};

module.exports = {
  addCompany,
  getAllCompany,
  deleteCompany,
  updateCompany,
};
