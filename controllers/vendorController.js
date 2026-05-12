// Import necessary modules
const bcrypt = require("bcryptjs");
const db = require("../config/db"); // Assuming you have a database connection file

const saltRounds = 10;

// Function to check if the role already exists
const checkRoleExistence = (roleName) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM Role WHERE role_name = ?",
      [roleName],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result.length > 0); // Returns true if the role exists, false otherwise
      }
    );
  });
};

// Function to insert role if it doesn't exist and return the roleId
const insertRoleIfNeeded = async (roleName) => {
  const roleExists = await checkRoleExistence(roleName);
  let roleId = null;

  if (!roleExists) {
    // If role doesn't exist, insert it and return the inserted roleId
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO Role (role_name) VALUES (?)",
        [roleName],
        (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result.insertId); // Return the newly inserted role ID
        }
      );
    });
  } else {
    // If role exists, get the existing role ID
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM Role WHERE role_name = ?",
        [roleName],
        (err, result) => {
          if (err) {
            return reject(err);
          }
          if (result.length > 0) {
            resolve(result[0].role_id); // Return the existing role ID
          } else {
            resolve(null); // In case there's an issue with role retrieval
          }
        }
      );
    });
  }
};

// Registration process for Vendor
exports.registerVendor = async (req, res) => {
  console.log("Request body:", req.body);
  const {
    username,
    password,
    email,
    company_name,
    service_category,
    contact_name,
    contact_type,
    phone_number,
    contact_email,
    address,
    certifications, // List of compliance certifications
  } = req.body;

  // Validation check
  if (
    !username ||
    !password ||
    !email ||
    !company_name ||
    !service_category ||
    !contact_name ||
    !contact_type ||
    !phone_number ||
    !contact_email ||
    !address
  ) {
    console.log("Error: Missing fields"); // Debugging: Missing fields
    return res.status(400).json({ errorBox: "All fields are required" });
  }

  try {
    console.log("Received registration data:", req.body);

    // Hash the password
    bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password:", err); // Debugging: Error in bcrypt
        return res.status(500).json({ errorBox: "Error hashing password" });
      }

      console.log("Password hashed successfully:", hashedPassword); // Debugging: Password hash

      // Insert User data into the database
      db.query(
        "INSERT INTO User (username, password, email) VALUES (?, ?, ?)",
        [username, hashedPassword, email],
        async (err, result) => {
          if (err) {
            console.error("Error inserting user into database:", err); // Debugging: User insertion error
            return res.status(500).json({ errorBox: "Error registering user" });
          }

          const userId = result.insertId;
          console.log("User registered with ID:", userId); // Debugging: User registration successful

          // Insert Role for Vendor if it doesn't already exist
          const roleId = await insertRoleIfNeeded("Vendor");

          if (!roleId) {
            console.error("Error: Role ID is null or undefined.");
            return res
              .status(500)
              .json({ errorBox: "Error retrieving role ID" });
          }

          console.log("Role 'Vendor' assigned with ID:", roleId); // Debugging: Role assignment successful

          // Assign permissions to user (here the permission level is set to 'User', you can change it as needed)
          const permissionLevel = "User"; // Adjust permission level as necessary
          db.query(
            "INSERT INTO Permissions (role_id, permission_level) VALUES (?, ?)",
            [roleId, permissionLevel],
            (err) => {
              if (err) {
                console.error("Error assigning permissions:", err); // Debugging: Permission assignment error
                return res
                  .status(500)
                  .json({ errorBox: "Error assigning permissions" });
              }

              console.log("Permissions assigned successfully"); // Debugging: Permissions assignment successful

              // Insert Vendor data
              db.query(
                "INSERT INTO Vendor (vendor_id, company_name, service_category, registration_date) VALUES (?, ?, ?, ?)",
                [userId, company_name, service_category, new Date()],
                (err) => {
                  if (err) {
                    console.error("Error registering vendor:", err); // Debugging: Vendor registration error
                    return res
                      .status(500)
                      .json({ errorBox: "Error registering vendor" });
                  }

                  console.log("Vendor registered successfully"); // Debugging: Vendor registration successful

                  // Insert Contact Information
                  db.query(
                    "INSERT INTO ContactInformation (vendor_id, contact_name, phone_number, email, address, contact_type) VALUES (?, ?, ?, ?, ?, ?)",
                    [
                      userId,
                      contact_name,
                      phone_number,
                      contact_email,
                      address,
                      contact_type,
                    ],
                    (err) => {
                      if (err) {
                        console.error(
                          "Error registering contact information:",
                          err
                        ); // Debugging: Contact info error
                        return res.status(500).json({
                          errorBox: "Error registering contact information",
                        });
                      }

                      console.log(
                        "Contact information registered successfully"
                      ); // Debugging: Contact info success

                      // Now, insert compliance certifications (if any)
                      if (certifications && certifications.length > 0) {
                        certifications.forEach((cert) => {
                          const { certification_name, issued_by, issue_date } =
                            cert;

                          db.query(
                            "INSERT INTO ComplianceCertification (vendor_id, certification_name, issued_by, issue_date) VALUES (?, ?, ?, ?)",
                            [userId, certification_name, issued_by, issue_date],
                            (err) => {
                              if (err) {
                                console.error(
                                  "Error registering certification:",
                                  err
                                );
                              } else {
                                console.log(
                                  "Compliance certification registered successfully"
                                );
                              }
                            }
                          );
                        });
                      }

                      return res.status(200).json({
                        message: "Vendor registered successfully",
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  } catch (err) {
    console.error("Error in registration process:", err); // Debugging: Catch-all error handler
    return res.status(500).json({ errorBox: "Error registering vendor" });
  }
};
