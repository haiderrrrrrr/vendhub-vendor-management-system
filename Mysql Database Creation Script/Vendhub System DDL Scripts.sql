																/* Vendhub System Database */
                                                                
DROP DATABASE IF EXISTS vendhub_system;
CREATE DATABASE IF NOT EXISTS vendhub_system;
USE vendhub_system;

-- 1. User table
CREATE TABLE IF NOT EXISTS User (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
);

-- 2. Role table
CREATE TABLE IF NOT EXISTS Role (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(255) NOT NULL UNIQUE CHECK (role_name IN ('Procurement Manager', 'Vendor', 'Compliance Officer', 'Other'))
);

-- 3. User Roles table (mapping table between users and roles)
CREATE TABLE IF NOT EXISTS UserRole (
    role_id INT,
    user_id INT,
    PRIMARY KEY (role_id, user_id),
    FOREIGN KEY (role_id) REFERENCES Role(role_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- 4. Permissions table
CREATE TABLE IF NOT EXISTS Permissions (
    permission_id INT PRIMARY KEY AUTO_INCREMENT,
    role_id INT,
    permission_level VARCHAR(50) CHECK (permission_level IN ('Admin', 'User', 'Manager')),
    FOREIGN KEY (role_id) REFERENCES Role(role_id) ON DELETE CASCADE
);

-- 5. Vendor table (depends on User)
CREATE TABLE IF NOT EXISTS Vendor (
    vendor_id INT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    service_category VARCHAR(255) NOT NULL,
    registration_date DATE,
    FOREIGN KEY (vendor_id) REFERENCES User(user_id) ON DELETE CASCADE
);



-- 6. Compliance Certification table (depends on Vendor)
CREATE TABLE IF NOT EXISTS ComplianceCertification (
    certification_id INT PRIMARY KEY AUTO_INCREMENT,
    vendor_id INT,
    certification_name VARCHAR(255),
    issued_by VARCHAR(255),
    issue_date DATE,
    FOREIGN KEY (vendor_id) REFERENCES Vendor(vendor_id) ON DELETE CASCADE
);

-- 7. Contact Information table (depends on Vendor)
CREATE TABLE IF NOT EXISTS ContactInformation (
    contact_id INT PRIMARY KEY AUTO_INCREMENT,
    vendor_id INT,
    contact_name VARCHAR(255),
    phone_number VARCHAR(15),
    email VARCHAR(255),
    address TEXT,
    contact_type VARCHAR(50) CHECK (contact_type IN ('Primary', 'Billing', 'Support')),
    FOREIGN KEY (vendor_id) REFERENCES Vendor(vendor_id) ON DELETE CASCADE
);

-- 8. Department table
CREATE TABLE IF NOT EXISTS Department (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(255) NOT NULL
);

-- 9. Budget table (depends on Department)
CREATE TABLE IF NOT EXISTS Budget (
    budget_id INT PRIMARY KEY AUTO_INCREMENT,
    department_id INT,
    allocated_amount DECIMAL(15, 2),
    spent_amount DECIMAL(15, 2),
    remaining_amount DECIMAL(15, 2) GENERATED ALWAYS AS (allocated_amount - spent_amount) STORED,
    year INT CHECK (year > 0),
    FOREIGN KEY (department_id) REFERENCES Department(department_id) ON DELETE CASCADE
);

-- 10. Procurement Manager table (depends on Department and Budget)
CREATE TABLE IF NOT EXISTS ProcurementManager (
    manager_id INT PRIMARY KEY,
    department_id INT,
    role_description TEXT,
    budget_id INT,
    FOREIGN KEY (manager_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES Department(department_id) ON DELETE CASCADE,
    FOREIGN KEY (budget_id) REFERENCES Budget(budget_id) ON DELETE CASCADE
);

-- 11. Contract Manager table (depends on Department)
CREATE TABLE IF NOT EXISTS ContractManager (
    manager_id INT PRIMARY KEY,
    department_id INT,
    role_description TEXT,
    FOREIGN KEY (manager_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES Department(department_id) ON DELETE CASCADE
);

-- 12. Contract table (depends on Vendor)
CREATE TABLE IF NOT EXISTS Contract (
    contract_id INT PRIMARY KEY AUTO_INCREMENT,
    contract_name VARCHAR(255) NOT NULL,
    vendor_id INT,
    contract_terms TEXT,
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) CHECK (status IN ('Active', 'Expired', 'Pending')),
    contract_value DECIMAL(15, 2),
    payment_terms TEXT,
    amendments INT,
    FOREIGN KEY (vendor_id) REFERENCES Vendor(vendor_id) ON DELETE CASCADE
);

-- 13. Contract Amendment table (depends on Contract and ContractManager)
CREATE TABLE IF NOT EXISTS ContractAmendment (
    amendment_id INT PRIMARY KEY AUTO_INCREMENT,
    contract_id INT,
    amendment_date DATE,
    changes_summary TEXT,
    amended_by INT,
    approved_by INT,
    FOREIGN KEY (contract_id) REFERENCES Contract(contract_id) ON DELETE CASCADE,
    FOREIGN KEY (amended_by) REFERENCES ContractManager(manager_id) ON DELETE SET NULL,
    FOREIGN KEY (approved_by) REFERENCES User(user_id) ON DELETE SET NULL
);

-- 14. Purchase Order table (depends on Vendor and Department)
CREATE TABLE IF NOT EXISTS PurchaseOrder (
    po_id INT PRIMARY KEY AUTO_INCREMENT,
    department_id INT,
    vendor_id INT,
    po_date DATE,
    status VARCHAR(50) CHECK (status IN ('Pending', 'Approved', 'Fulfilled')),
    total_cost DECIMAL(15, 2),
    approval_status VARCHAR(50) CHECK (approval_status IN ('Pending', 'Approved')),
    budget_compliance BOOLEAN,
    FOREIGN KEY (department_id) REFERENCES Department(department_id) ON DELETE CASCADE,
    FOREIGN KEY (vendor_id) REFERENCES Vendor(vendor_id) ON DELETE CASCADE
);

-- 15. Items table (depends on PurchaseOrder)
CREATE TABLE IF NOT EXISTS Items (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    po_id INT,
    description TEXT,
    quantity INT,
    unit_price DECIMAL(10, 2),
    total_price DECIMAL(15, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    FOREIGN KEY (po_id) REFERENCES PurchaseOrder(po_id) ON DELETE CASCADE
);

-- 16. Budget Category table (depends on Budget)
CREATE TABLE IF NOT EXISTS BudgetCategory (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    budget_id INT,
    category_name VARCHAR(255),
    FOREIGN KEY (budget_id) REFERENCES Budget(budget_id) ON DELETE CASCADE
);

-- 17. Performance Evaluation table (depends on Vendor and User)
CREATE TABLE IF NOT EXISTS PerformanceEvaluation (
    evaluation_id INT PRIMARY KEY AUTO_INCREMENT,
    vendor_id INT,
    evaluator_id INT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    feedback TEXT,
    evaluation_date DATE,
    improvement_notes TEXT,
    FOREIGN KEY (vendor_id) REFERENCES Vendor(vendor_id) ON DELETE CASCADE,
    FOREIGN KEY (evaluator_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- 18. Compliance Audit table (depends on Vendor and User)
CREATE TABLE IF NOT EXISTS ComplianceAudit (
    audit_id INT PRIMARY KEY AUTO_INCREMENT,
    vendor_id INT,
    compliance_officer_id INT,
    audit_date DATE,
    audit_results VARCHAR(50) CHECK (audit_results IN ('Pass', 'Fail')),
    non_compliance_issues TEXT,
    audit_report TEXT,
    FOREIGN KEY (vendor_id) REFERENCES Vendor(vendor_id) ON DELETE CASCADE,
    FOREIGN KEY (compliance_officer_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- 19. Notification table (depends on User)
CREATE TABLE IF NOT EXISTS Notification (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    message TEXT,
    notification_type VARCHAR(255),
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    read_status BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- 20. Audit Trail table (depends on User)
CREATE TABLE IF NOT EXISTS AuditTrail (
    audit_trail_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(50) CHECK (action IN ('Add', 'Edit', 'Delete')),
    entity VARCHAR(255),
    action_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    old_data JSON,
    new_data JSON,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);


-- 21.  Budget Alert Table
CREATE TABLE IF NOT EXISTS BudgetAlert (
    alert_id INT PRIMARY KEY AUTO_INCREMENT,
    po_id INT,
    department_id INT,
    total_cost DECIMAL(15, 2),
    alert_message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (po_id) REFERENCES PurchaseOrder(po_id) ON DELETE CASCADE
);

-- Add Department head to Procurement Manager
ALTER TABLE Department
ADD COLUMN department_head INT,
ADD FOREIGN KEY (department_head) REFERENCES ProcurementManager(manager_id) ON DELETE SET NULL;





																/* STORED PROCEDURE AND TRIGGERS */			
-- Stored Procedure to create Vendor
DELIMITER $$

CREATE PROCEDURE RegisterVendor(
    IN p_username VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_email VARCHAR(255),
    IN p_company_name VARCHAR(255),
    IN p_service_category VARCHAR(255),
    IN p_contact_name VARCHAR(255),
    IN p_contact_type VARCHAR(50),
    IN p_phone_number VARCHAR(15),
    IN p_contact_email VARCHAR(255),
    IN p_address TEXT,
    IN p_certifications JSON
)
BEGIN
    DECLARE v_user_id INT;
    DECLARE v_role_id INT;
    DECLARE v_vendor_id INT;
    DECLARE v_certification_name VARCHAR(255);
    DECLARE v_issued_by VARCHAR(255);
    DECLARE v_issue_date DATE;
    DECLARE i INT DEFAULT 0;
    DECLARE cert JSON;
    
    -- Step 2: Insert User into the User table
    INSERT INTO User (username, password, email) 
    VALUES (p_username, p_password, p_email);
    
    SET v_user_id = LAST_INSERT_ID();
    
    -- Step 3: Check if the "Vendor" role exists or insert it
    SELECT role_id INTO v_role_id
    FROM Role
    WHERE role_name = 'Vendor';
    
    IF v_role_id IS NULL THEN
        -- If role doesn't exist, insert the role
        INSERT INTO Role (role_name) VALUES ('Vendor');
        SET v_role_id = LAST_INSERT_ID();
    END IF;

    -- Step 4: Assign Role to User
    INSERT INTO UserRole (role_id, user_id) 
    VALUES (v_role_id, v_user_id);
    
    -- Step 5: Assign Permissions to the Vendor (permission level 'User')
    INSERT INTO Permissions (role_id, permission_level)
    VALUES (v_role_id, 'User');

    -- Step 6: Insert Vendor Information
    INSERT INTO Vendor (vendor_id, company_name, service_category, registration_date) 
    VALUES (v_user_id, p_company_name, p_service_category, CURDATE());
    
    SET v_vendor_id = LAST_INSERT_ID();
    
    -- Step 7: Insert Contact Information
    INSERT INTO ContactInformation (vendor_id, contact_name, phone_number, email, address, contact_type)
    VALUES (v_vendor_id, p_contact_name, p_phone_number, p_contact_email, p_address, p_contact_type);
    
    -- Step 8: Insert Compliance Certifications (if any)
    IF JSON_LENGTH(p_certifications) > 0 THEN
        -- Loop through the JSON array of certifications
        WHILE i < JSON_LENGTH(p_certifications) DO
            SET cert = JSON_EXTRACT(p_certifications, CONCAT('$[', i, ']'));
            SET v_certification_name = JSON_UNQUOTE(JSON_EXTRACT(cert, '$.certification_name'));
            SET v_issued_by = JSON_UNQUOTE(JSON_EXTRACT(cert, '$.issued_by'));
            SET v_issue_date = STR_TO_DATE(JSON_UNQUOTE(JSON_EXTRACT(cert, '$.issue_date')), '%Y-%m-%d');
            
            -- Insert each certification
            INSERT INTO ComplianceCertification (vendor_id, certification_name, issued_by, issue_date)
            VALUES (v_vendor_id, v_certification_name, v_issued_by, v_issue_date);
            
            SET i = i + 1;
        END WHILE;
    END IF;
    
    -- Step 9: Return success message
    SELECT 'Vendor registered successfully' AS message;
    
END $$

DELIMITER ;


-- Stored Procedure to Fetch Vendor Details
DELIMITER $$

CREATE PROCEDURE GetAllVendorDetails()
BEGIN
    SELECT 
        v.vendor_id,
        v.company_name,
        v.service_category,
        v.registration_date,
        c.contact_name,
        c.phone_number,
        c.email AS contact_email,
        c.address,
        c.contact_type,
        cc.certification_name,
        cc.issued_by,
        cc.issue_date
    FROM 
        Vendor v
    LEFT JOIN 
        ContactInformation c ON v.vendor_id = c.vendor_id
    LEFT JOIN 
        ComplianceCertification cc ON v.vendor_id = cc.vendor_id
    ORDER BY 
        v.vendor_id, c.contact_type; 
END $$

DELIMITER ;


-- Stored Procedure to Delete Vendors
DELIMITER $$

CREATE PROCEDURE ListAndDeleteVendor(IN vendorId INT)
BEGIN
    SELECT 
        vendor_id,
        company_name
    FROM Vendor;

    IF vendorId IS NOT NULL THEN
        IF EXISTS (SELECT 1 FROM Vendor WHERE vendor_id = vendorId) THEN
            DELETE FROM ComplianceCertification WHERE vendor_id = vendorId;
            DELETE FROM ContactInformation WHERE vendor_id = vendorId;

            DELETE FROM Vendor WHERE vendor_id = vendorId;

            SELECT 'Vendor deleted successfully' AS message;
        ELSE
            SELECT 'Vendor not found' AS message;
        END IF;
    END IF;
END $$

DELIMITER ;


-- Trigger to Check Compliance Details
DELIMITER $$

-- Trigger to ensure compliance certification is linked to a valid vendor
CREATE TRIGGER before_insert_compliance_certification
BEFORE INSERT ON ComplianceCertification
FOR EACH ROW
BEGIN
    -- Check if the vendor exists
    DECLARE vendor_exists INT;

    -- Check if the vendor ID exists in the Vendor table
    SELECT COUNT(*) INTO vendor_exists
    FROM Vendor
    WHERE vendor_id = NEW.vendor_id;

    -- If the vendor does not exist, prevent the insertion
    IF vendor_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Vendor ID does not exist';
    END IF;
END $$

DELIMITER ;


-- Stored Procedure to Update Vendor
DELIMITER $$

CREATE PROCEDURE UpdateUserDetails(
    IN vendorId INT,
    IN newCompanyName VARCHAR(255),
    IN newServiceCategory VARCHAR(255),
    IN newContactName VARCHAR(255),
    IN newPhoneNumber VARCHAR(15),
    IN newEmail VARCHAR(255),
    IN newAddress TEXT,
    IN newCertificationName VARCHAR(255),
    IN newIssuedBy VARCHAR(255),
    IN newIssueDate DATE
)
BEGIN
    -- Declare a variable to hold the vendor count
    DECLARE vendorExists INT;
    DECLARE certificationExists INT;

    -- Check if the vendor exists
    SELECT COUNT(*) INTO vendorExists
    FROM Vendor
    WHERE vendor_id = vendorId;

    -- If the vendor exists, proceed with the update
    IF vendorExists > 0 THEN
        UPDATE Vendor
        SET company_name = newCompanyName,
            service_category = newServiceCategory
        WHERE vendor_id = vendorId;
        -- Update Contact Information Table (for Primary contact)
        UPDATE ContactInformation
        SET contact_name = newContactName,
            phone_number = newPhoneNumber,
            email = newEmail,
            address = newAddress
        WHERE vendor_id = vendorId AND contact_type = 'Primary';
        -- Check if a certification already exists for the vendor
        SELECT COUNT(*) INTO certificationExists
        FROM ComplianceCertification
        WHERE vendor_id = vendorId;

        -- If certification exists, update it
        IF certificationExists > 0 THEN
            UPDATE ComplianceCertification
            SET certification_name = newCertificationName,
                issued_by = newIssuedBy,
                issue_date = newIssueDate
            WHERE vendor_id = vendorId;
        ELSE
            INSERT INTO ComplianceCertification (vendor_id, certification_name, issued_by, issue_date)
            VALUES (vendorId, newCertificationName, newIssuedBy, newIssueDate);
        END IF;

        -- Return success message
        SELECT 'Vendor, contact information, and compliance certification updated successfully.' AS message;
    ELSE
        -- If the vendor does not exist, return an error message
        SELECT 'Vendor not found. No update performed.' AS message;
    END IF;
END $$

DELIMITER ;




-- Stored Procdure to Create purchase order												
DELIMITER $$

CREATE PROCEDURE CreatePurchaseOrder (
    IN p_department_id INT,
    IN p_vendor_id INT,
    IN p_po_date DATE,
    IN p_total_cost DECIMAL(15, 2),
    IN p_approval_status VARCHAR(50),
    IN p_items JSON  -- A JSON array for passing multiple items
)
BEGIN
    DECLARE po_id INT;
    DECLARE i INT DEFAULT 0;
    DECLARE item_description TEXT;
    DECLARE item_quantity INT;
    DECLARE item_unit_price DECIMAL(10, 2);

    -- Insert the purchase order into the PurchaseOrder table
    INSERT INTO PurchaseOrder (department_id, vendor_id, po_date, total_cost, approval_status, budget_compliance)
    VALUES (p_department_id, p_vendor_id, p_po_date, p_total_cost, p_approval_status, TRUE);
        
    -- Get the generated Purchase Order ID (po_id)
    SET po_id = LAST_INSERT_ID();

    -- Loop through each item in the JSON array
    WHILE i < JSON_LENGTH(p_items) DO
        SET item_description = JSON_UNQUOTE(JSON_EXTRACT(p_items, CONCAT('$[', i, '].description')));
        SET item_quantity = JSON_UNQUOTE(JSON_EXTRACT(p_items, CONCAT('$[', i, '].quantity')));
        SET item_unit_price = JSON_UNQUOTE(JSON_EXTRACT(p_items, CONCAT('$[', i, '].unit_price')));

        -- Insert each item into the Items table
        INSERT INTO Items (po_id, description, quantity, unit_price)
        VALUES (po_id, item_description, item_quantity, item_unit_price);

        SET i = i + 1;
    END WHILE;

    COMMIT;
END $$

DELIMITER ;


-- Stored procdeure for Getting All Purchase Order with their Status 
DELIMITER $$

CREATE PROCEDURE TrackPurchaseOrdersStatus()
BEGIN
    SELECT 
        po.po_id, 
        d.department_name,  
        v.company_name AS vendor_name,  
        po.po_date, 
        po.total_cost, 
        po.approval_status, 
        po.status, 
        CASE 
            WHEN po.approval_status = 'Approved' THEN 'green' 
            WHEN po.approval_status = 'Pending' THEN 'red'   
            ELSE 'yellow' 
        END AS status_color,
        poi.item_id,
        poi.description AS item_description,
        poi.quantity,
        poi.unit_price,
        (poi.quantity * poi.unit_price) AS item_total_cost
    FROM PurchaseOrder po
    JOIN Department d ON po.department_id = d.department_id 
    JOIN Vendor v ON po.vendor_id = v.vendor_id
    LEFT JOIN Items poi ON po.po_id = poi.po_id;           
END $$

DELIMITER ;


-- Trigger to Check Purchase Order Exceeding Deparmtnet Budget
DELIMITER $$

CREATE TRIGGER check_budget_exceedance
AFTER INSERT ON PurchaseOrder
FOR EACH ROW
BEGIN
    -- Declare variable to hold department budget
    DECLARE department_budget DECIMAL(15, 2);
    
    -- Get the department's current budget
    SELECT budget_amount INTO department_budget
    FROM Budget
    WHERE department_id = NEW.department_id;
    
    -- Check if the purchase order exceeds the department's budget
    IF NEW.total_cost > department_budget THEN
        -- Insert alert into the BudgetAlert table with relevant purchase order details
        INSERT INTO BudgetAlert (po_id, department_id, total_cost, alert_message)
        VALUES (NEW.po_id, NEW.department_id, NEW.total_cost, 
                CONCAT('Purchase Order ', NEW.po_id, ' exceeds the budget for department ', NEW.department_id));
    END IF;
END $$

DELIMITER ;



DROP PROCEDURE IF EXISTS CreateContract;
-- Stored Procedure for Contract Creation
-- DELIMITER $$

-- CREATE PROCEDURE CreateContract(
--     IN p_vendor_id INT, 
-- 	IN p_contract_name VARCHAR(255),
--     IN p_contract_terms TEXT, 
--     IN p_start_date DATE, 
--     IN p_end_date DATE, 
--     IN p_contract_value DECIMAL(15, 2), 
--     IN p_payment_terms TEXT
-- )
-- BEGIN
--     DECLARE vendor_exists INT;
--     -- Check if the vendor exists
--     SELECT COUNT(*) INTO vendor_exists
--     FROM Vendor 
--     WHERE vendor_id = p_vendor_id;

--     IF vendor_exists = 0 THEN
--         SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Vendor not found';
--     ELSE
--         -- Insert the contract record
--         INSERT INTO Contract (
--             vendor_id,
--             contract_name,
--             contract_terms,
--             start_date,
--             end_date,
--             status,
--             contract_value,
--             payment_terms,
--             amendments
--         ) 
--         VALUES (
--             p_vendor_id,
-- 		    p_contract_name,
--             p_contract_terms,
--             p_start_date,
--             p_end_date,
--             'Pending', -- Default contract status
--             p_contract_value,
--             p_payment_terms,
--             0 -- Initial amendments count
--         );
--     END IF;
--     
-- END $$

-- DELIMITER ;

-- Stored Procedure for Contract Creation
DELIMITER $$

CREATE PROCEDURE CreateContract(
    IN p_vendor_id INT, 
	IN p_contract_name VARCHAR(255),
    IN p_contract_terms TEXT, 
    IN p_start_date DATE, 
    IN p_end_date DATE, 
    IN p_contract_value DECIMAL(15, 2), 
    IN p_payment_terms TEXT
)
BEGIN
    DECLARE vendor_exists INT;
    -- Check if the vendor exists
    SELECT COUNT(*) INTO vendor_exists
    FROM Vendor 
    WHERE vendor_id = p_vendor_id;

    IF vendor_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Vendor not found';
    ELSE
        -- Insert the contract record without the 'created_at' column
        INSERT INTO Contract (
            vendor_id,
            contract_name,
            contract_terms,
            start_date,
            end_date,
            status,
            contract_value,
            payment_terms,
            amendments
        ) 
        VALUES (
            p_vendor_id,
		    p_contract_name,
            p_contract_terms,
            p_start_date,
            p_end_date,
            'Pending', -- Default contract status
            p_contract_value,
            p_payment_terms,
            0 -- Initial amendments count
        );
    END IF;
    
END $$

DELIMITER ;






-- Stored procedure for Contract Update
DELIMITER $$

CREATE PROCEDURE UpdateContract(
    IN p_contract_id INT,
    IN p_contract_name VARCHAR(255),
    IN p_vendor_id INT, 
    IN p_contract_terms TEXT, 
    IN p_start_date DATE, 
    IN p_end_date DATE, 
    IN p_contract_value DECIMAL(15, 2), 
    IN p_payment_terms TEXT
)
BEGIN
    DECLARE vendor_exists INT;
    -- Check if the vendor exists
    SELECT COUNT(*) INTO vendor_exists
    FROM Vendor 
    WHERE vendor_id = p_vendor_id;

    IF vendor_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Vendor not found';
    ELSE
        -- Update the contract record
        UPDATE Contract
        SET 
            contract_name = p_contract_name,
            vendor_id = p_vendor_id,
            contract_terms = p_contract_terms,
            start_date = p_start_date,
            end_date = p_end_date,
            contract_value = p_contract_value,
            payment_terms = p_payment_terms,
            amendments = amendments + 1  -- Increment amendments count
        WHERE contract_id = p_contract_id;
    END IF;
    
END $$

DELIMITER ;

DROP TRIGGER IF EXISTS CheckExpiringContracts;
-- Trigger for Expiry Alerts for Contracts
DELIMITER $$

CREATE TRIGGER CheckExpiringContracts
AFTER INSERT ON Contract
FOR EACH ROW
BEGIN
    DECLARE today DATE;
    DECLARE expiry_date DATE;
    DECLARE contract_id INT;
    DECLARE contract_name VARCHAR(255);
    DECLARE vendor_name VARCHAR(255);
    DECLARE contract_value DECIMAL(10, 2);
    DECLARE payment_terms VARCHAR(255);
    
    -- Get today's date
    SET today = CURDATE();
    
    -- Get the expiry date of the inserted contract
    SET expiry_date = NEW.end_date;
    
    -- Check if the contract is expiring within the next 30 days
    IF expiry_date BETWEEN today AND DATE_ADD(today, INTERVAL 30 DAY) THEN
        SET contract_id = NEW.contract_id;
        SET contract_name = NEW.contract_name;
        SET vendor_name = (SELECT company_name FROM Vendor WHERE vendor_id = NEW.vendor_id);
        SET contract_value = NEW.contract_value;
        SET payment_terms = NEW.payment_terms;
        
        INSERT INTO Notification (user_id, message, notification_type, created_at)
        VALUES 
        (1, CONCAT('Contract "', contract_name, '" with vendor "', vendor_name, '" is expiring in the next 30 days.'),
        'Contract Expiry Alert', NOW());
        
    END IF;
END$$

DELIMITER ;




-- Stored Procedure for Givng Performace and Rating
DELIMITER $$

CREATE PROCEDURE `AddPerformanceEvaluation`(
    IN vendorId INT,
    IN evaluatorId INT,
    IN rating INT,
    IN feedback TEXT,
    IN improvementNotes TEXT
)
BEGIN
    -- Check if the vendor exists
    IF NOT EXISTS (SELECT 1 FROM Vendor WHERE vendor_id = vendorId) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Vendor not found!';
    END IF;

    -- Check if the evaluator exists
    IF NOT EXISTS (SELECT 1 FROM User WHERE user_id = evaluatorId) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Evaluator not found!';
    END IF;

    -- Check if the rating is valid
    IF rating < 1 OR rating > 5 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Performance rating must be between 1 and 5!';
    END IF;

    INSERT INTO PerformanceEvaluation (vendor_id, evaluator_id, rating, feedback, evaluation_date, improvement_notes)
    VALUES (vendorId, evaluatorId, rating, feedback, CURRENT_DATE, improvementNotes);

END$$

DELIMITER ;


-- Stored Procedure for Getting Performance and Rating
DELIMITER $$

CREATE PROCEDURE `GetPerformanceEvaluations`(
    IN selectedVendorId INT
)
BEGIN
    SELECT 
        pe.vendor_id,
        v.company_name,
        pe.rating,
        pe.feedback,
        pe.improvement_notes,
        pe.evaluation_date,
        u.username AS evaluator
    FROM 
        PerformanceEvaluation pe
    JOIN 
        Vendor v ON pe.vendor_id = v.vendor_id
    JOIN 
        User u ON pe.evaluator_id = u.user_id
    WHERE 
        pe.vendor_id = selectedVendorId
    ORDER BY 
        pe.evaluation_date DESC;
END$$

DELIMITER ;




-- Stored procedure to Post Department and its Budget
DELIMITER $$

CREATE PROCEDURE AddBudgetAndDepartment(
    IN department_name VARCHAR(255), 
    IN allocated_amount DECIMAL(15, 2), 
    IN spent_amount DECIMAL(15, 2),
    IN year INT
)
BEGIN
    -- Declare the new department ID variable
    DECLARE new_department_id INT;

    -- Insert new department into the Department table
    INSERT INTO Department (department_name)
    VALUES (department_name);

    -- Retrieve the department_id of the newly added department
    SET new_department_id = LAST_INSERT_ID();

    -- Insert the budget details into the Budget table
    INSERT INTO Budget (department_id, allocated_amount, spent_amount, year)
    VALUES (new_department_id, allocated_amount, spent_amount, year);

    -- Return success message
    SELECT CONCAT('Department "', department_name, '" and associated budget have been successfully added with an allocated amount of ', allocated_amount, ' for year ', year) AS message;
END $$

DELIMITER ;


-- Stored Procedure to Get Budget Details
DELIMITER $$

CREATE PROCEDURE GetDepartmentBudgetReport()
BEGIN
    SELECT 
        d.department_id,
        d.department_name,
        b.allocated_amount,
        b.spent_amount,
        b.remaining_amount,
        b.year
    FROM 
        Department d
    LEFT JOIN 
        Budget b ON d.department_id = b.department_id
    ORDER BY 
        d.department_name, b.year;
END $$

DELIMITER ;



-- Stored Procedure to Update Budget
DELIMITER $$

CREATE PROCEDURE UpdateBudgetByDepartmentId(
    IN dept_id INT,
    IN new_allocated_amount DECIMAL(15, 2),
    IN new_spent_amount DECIMAL(15, 2),
    IN new_year INT
)
BEGIN
    -- Check if the department exists by department_id
    IF dept_id IS NOT NULL THEN
        -- Update the budget details for the department
        UPDATE Budget
        SET 
            allocated_amount = new_allocated_amount,
            spent_amount = new_spent_amount,
            year = new_year
        WHERE department_id = dept_id;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Department not found';
    END IF;
END $$

DELIMITER ;


