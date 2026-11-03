
const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"public")));

// Connect to the blood_bank database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Zuneraamber@111007",
    database: "blood_bank"
});

db.connect((err) => {
    if (err) {
        console.error("MySQL connection failed:", err.message);
        return;
    }
    console.log("Connected to MySQL");
});

// Helper function for database queries
function query(sql, values, res, successMessage) {
    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.json({
            message: successMessage,
            data: result
        });
    });
}

// =====================================
// 1. DONORS TABLE
// =====================================

// Get all donors
app.get("/donors", (req, res) => {
    query("SELECT * FROM donors", [], res, "Donors retrieved");
});

// Get one donor
app.get("/donors/:id", (req, res) => {
    db.query(
        "SELECT * FROM donors WHERE donor_id = ?",
        [req.params.id],
        (err, result) => {
            if (err) return res.status(500).send(err.message);
            if (result.length === 0)
                return res.status(404).send("Donor not found");
            res.json(result[0]);
        }
    );
});

// Insert donor
app.post("/donors", (req, res) => {
    const { name, age, gender, blood_group, phone } = req.body;

    query(
        `INSERT INTO donors
        (name, age, gender, blood_group, phone)
        VALUES (?, ?, ?, ?, ?)`,
        [name, age, gender, blood_group, phone],
        res,
        "Donor added successfully"
    );
});

// Update donor
app.put("/donors/:id", (req, res) => {
    const { name, age, gender, blood_group, phone } = req.body;

    db.query(
        `UPDATE donors SET name=?, age=?, gender=?,
        blood_group=?, phone=? WHERE donor_id=?`,
        [name, age, gender, blood_group, phone, req.params.id],
        (err, result) => {
            if (err) return res.status(500).send(err.message);
            if (result.affectedRows === 0)
                return res.status(404).send("Donor not found");
            res.send("Donor updated successfully");
        }
    );
});

// Delete donor
app.delete("/donors/:id", (req, res) => {
    db.query(
        "DELETE FROM donors WHERE donor_id=?",
        [req.params.id],
        (err, result) => {
            if (err) return res.status(500).send(err.message);
            if (result.affectedRows === 0)
                return res.status(404).send("Donor not found");
            res.send("Donor deleted successfully");
        }
    );
});

// =====================================
// 2. BLOOD STOCK TABLE
// =====================================

// Get all blood stock
app.get("/blood-stock", (req, res) => {
    query("SELECT * FROM blood_stock", [], res, "Blood stock retrieved");
});

// Get stock by ID
app.get("/blood-stock/:id", (req, res) => {
    db.query(
        "SELECT * FROM blood_stock WHERE stock_id=?",
        [req.params.id],
        (err, result) => {
            if (err) return res.status(500).send(err.message);
            if (result.length === 0)
                return res.status(404).send("Stock record not found");
            res.json(result[0]);
        }
    );
});

// Insert blood stock
app.post("/blood-stock", (req, res) => {
    const { blood_group, units_available, last_updated } = req.body;

    query(
        `INSERT INTO blood_stock
        (blood_group, units_available, last_updated)
        VALUES (?, ?, ?)`,
        [blood_group, units_available, last_updated],
        res,
        "Blood stock added successfully"
    );
});

// Update blood stock
app.put("/blood-stock/:id", (req, res) => {
    const { blood_group, units_available, last_updated } = req.body;

    db.query(
        `UPDATE blood_stock SET blood_group=?,
        units_available=?, last_updated=? WHERE stock_id=?`,
        [blood_group, units_available, last_updated, req.params.id],
        (err, result) => {
            if (err) return res.status(500).send(err.message);
            if (result.affectedRows === 0)
                return res.status(404).send("Stock record not found");
            res.send("Blood stock updated successfully");
        }
    );
});

// Delete blood stock
app.delete("/blood-stock/:id", (req, res) => {
    db.query(
        "DELETE FROM blood_stock WHERE stock_id=?",
        [req.params.id],
        (err, result) => {
            if (err) return res.status(500).send(err.message);
            if (result.affectedRows === 0)
                return res.status(404).send("Stock record not found");
            res.send("Blood stock deleted successfully");
        }
    );
});

// =====================================
// 3. BLOOD REQUESTS TABLE
// =====================================

// Get all blood requests
app.get("/blood-requests", (req, res) => {
    query(
        "SELECT * FROM blood_requests",
        [],
        res,
        "Blood requests retrieved"
    );
});

// Get one blood request
app.get("/blood-requests/:id", (req, res) => {
    db.query(
        "SELECT * FROM blood_requests WHERE request_id=?",
        [req.params.id],
        (err, result) => {
            if (err) return res.status(500).send(err.message);
            if (result.length === 0)
                return res.status(404).send("Request not found");
            res.json(result[0]);
        }
    );
});

// Insert blood request
app.post("/blood-requests", (req, res) => {
    const {
        hospital_name,
        blood_group,
        units_required,
        request_date,
        status
    } = req.body;

    query(
        `INSERT INTO blood_requests
        (hospital_name, blood_group, units_required,
        request_date, status)
        VALUES (?, ?, ?, ?, ?)`,
        [
            hospital_name,
            blood_group,
            units_required,
            request_date,
            status
        ],
        res,
        "Blood request added successfully"
    );
});

// Update blood request
app.put("/blood-requests/:id", (req, res) => {
    const {
        hospital_name,
        blood_group,
        units_required,
        request_date,
        status
    } = req.body;

    db.query(
        `UPDATE blood_requests SET hospital_name=?,
        blood_group=?, units_required=?, request_date=?,
        status=? WHERE request_id=?`,
        [
            hospital_name,
            blood_group,
            units_required,
            request_date,
            status,
            req.params.id
        ],
        (err, result) => {
            if (err) return res.status(500).send(err.message);
            if (result.affectedRows === 0)
                return res.status(404).send("Request not found");
            res.send("Blood request updated successfully");
        }
    );
});

// Delete blood request
app.delete("/blood-requests/:id", (req, res) => {
    db.query(
        "DELETE FROM blood_requests WHERE request_id=?",
        [req.params.id],
        (err, result) => {
            if (err) return res.status(500).send(err.message);
            if (result.affectedRows === 0)
                return res.status(404).send("Request not found");
            res.send("Blood request deleted successfully");
        }
    );
});
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});


// Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000/");
});
