-- USERS TABLE
CREATE SEQUENCE users_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE Users (
    user_id NUMBER PRIMARY KEY,
    username VARCHAR2(50) NOT NULL UNIQUE,
    password_hash VARCHAR2(255) NOT NULL,
    role VARCHAR2(10) CHECK (role IN ('admin', 'staff')) NOT NULL
);


-- altering the constraint of data in roles column
SELECT constraint_name, search_condition
FROM user_constraints
WHERE table_name = 'USERS'
  AND constraint_type = 'C';

-- select the constraint_name from above query result and pase below in place of query name
ALTER TABLE Users DROP CONSTRAINT SYS_C007567;

ALTER TABLE Users
ADD CONSTRAINT ROLE_CHECK
CHECK (role IN ('ROLE_ADMIN', 'ROLE_STAFF'));

-- CREATE OR REPLACE TRIGGER trg_users_bi
-- BEFORE INSERT ON Users
-- FOR EACH ROW
-- BEGIN
--     :NEW.user_id := users_seq.NEXTVAL;
-- END;
-- /

-- FLIGHTS TABLE
CREATE SEQUENCE flights_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE Flights (
    flight_id NUMBER PRIMARY KEY,
    flight_route VARCHAR2(255) NOT NULL,
    flight_number VARCHAR2(50) NOT NULL UNIQUE,
    departure_time TIMESTAMP,
    arrival_time TIMESTAMP
);

-- CREATE OR REPLACE TRIGGER trg_flights_bi
-- BEFORE INSERT ON Flights
-- FOR EACH ROW
-- BEGIN
--     :NEW.flight_id := flights_seq.NEXTVAL;
-- END;
-- /

-- PASSENGERS TABLE
CREATE SEQUENCE passengers_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE Passengers (
    passenger_id NUMBER PRIMARY KEY,
    flight_id NUMBER NOT NULL,
    name VARCHAR2(100) NOT NULL,
    date_of_birth DATE,
    passport VARCHAR2(50),
    address CLOB,
    meal_preference VARCHAR2(10) CHECK (meal_preference IN ('veg', 'non-veg')) NOT NULL,
    need_wheelchair NUMBER(1) DEFAULT 0 NOT NULL,
    travelling_with_infant NUMBER(1) DEFAULT 0 NOT NULL,
    CONSTRAINT fk_passenger_flight FOREIGN KEY (flight_id) REFERENCES Flights(flight_id) ON DELETE CASCADE
);

-- CREATE OR REPLACE TRIGGER trg_passengers_bi
-- BEFORE INSERT ON Passengers
-- FOR EACH ROW
-- BEGIN
--     :NEW.passenger_id := passengers_seq.NEXTVAL;
-- END;
-- /

-- SERVICE CATEGORIES TABLE
CREATE SEQUENCE service_categories_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE ServiceCategories (
    category_id NUMBER PRIMARY KEY,
    category_name VARCHAR2(20) CHECK (category_name IN ('ancillary', 'meal', 'shopping')) UNIQUE NOT NULL
);

-- CREATE OR REPLACE TRIGGER trg_service_categories_bi
-- BEFORE INSERT ON ServiceCategories
-- FOR EACH ROW
-- BEGIN
--     :NEW.category_id := service_categories_seq.NEXTVAL;
-- END;
-- /

-- FLIGHT SERVICES TABLE
CREATE SEQUENCE flight_services_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE FlightServices (
    service_id NUMBER PRIMARY KEY,
    flight_id NUMBER NOT NULL,
    category_id NUMBER NOT NULL,
    service_name VARCHAR2(255) NOT NULL,
    service_type VARCHAR2(100),
    price NUMBER(10,2) NOT NULL,
    CONSTRAINT fk_service_flight FOREIGN KEY (flight_id) REFERENCES Flights(flight_id) ON DELETE CASCADE,
    CONSTRAINT fk_service_category FOREIGN KEY (category_id) REFERENCES ServiceCategories(category_id)
);

-- CREATE OR REPLACE TRIGGER trg_flight_services_bi
-- BEFORE INSERT ON FlightServices
-- FOR EACH ROW
-- BEGIN
--     :NEW.service_id := flight_services_seq.NEXTVAL;
-- END;
-- /

-- SEAT ASSIGNMENTS TABLE
CREATE SEQUENCE seat_assignments_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE SeatAssignments (
    assignment_id NUMBER PRIMARY KEY,
    flight_id NUMBER NOT NULL,
    passenger_id NUMBER NOT NULL,
    seat_no VARCHAR2(10) NOT NULL,
    checked_in NUMBER(1) DEFAULT 0 NOT NULL,
    CONSTRAINT fk_seat_flight FOREIGN KEY (flight_id) REFERENCES Flights(flight_id) ON DELETE CASCADE,
    CONSTRAINT fk_seat_passenger FOREIGN KEY (passenger_id) REFERENCES Passengers(passenger_id) ON DELETE CASCADE,
    CONSTRAINT uq_flight_seat UNIQUE (flight_id, seat_no),
    CONSTRAINT uq_passenger_flight UNIQUE (passenger_id, flight_id)
);

-- CREATE OR REPLACE TRIGGER trg_seat_assignments_bi
-- BEFORE INSERT ON SeatAssignments
-- FOR EACH ROW
-- BEGIN
--     :NEW.assignment_id := seat_assignments_seq.NEXTVAL;
-- END;
-- /

-- PASSENGER ANCILLARY SERVICES
CREATE SEQUENCE pas_ancillary_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE PassengerAncillaryServices (
    id NUMBER PRIMARY KEY,
    passenger_id NUMBER NOT NULL,
    service_id NUMBER NOT NULL,
    CONSTRAINT fk_pas_ancillary_passenger FOREIGN KEY (passenger_id) REFERENCES Passengers(passenger_id) ON DELETE CASCADE,
    CONSTRAINT fk_pas_ancillary_service FOREIGN KEY (service_id) REFERENCES FlightServices(service_id) ON DELETE CASCADE,
    CONSTRAINT uq_pas_ancillary UNIQUE (passenger_id, service_id)
);

-- CREATE OR REPLACE TRIGGER trg_pas_ancillary_bi
-- BEFORE INSERT ON PassengerAncillaryServices
-- FOR EACH ROW
-- BEGIN
--     :NEW.id := pas_ancillary_seq.NEXTVAL;
-- END;
-- /

-- PASSENGER MEALS
CREATE SEQUENCE passenger_meals_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE PassengerMeals (
    id NUMBER PRIMARY KEY,
    passenger_id NUMBER NOT NULL,
    service_id NUMBER NOT NULL,
    CONSTRAINT fk_pas_meal_passenger FOREIGN KEY (passenger_id) REFERENCES Passengers(passenger_id) ON DELETE CASCADE,
    CONSTRAINT fk_pas_meal_service FOREIGN KEY (service_id) REFERENCES FlightServices(service_id) ON DELETE CASCADE,
    CONSTRAINT uq_pas_meal UNIQUE (passenger_id, service_id)
);

-- CREATE OR REPLACE TRIGGER trg_passenger_meals_bi
-- BEFORE INSERT ON PassengerMeals
-- FOR EACH ROW
-- BEGIN
--     :NEW.id := passenger_meals_seq.NEXTVAL;
-- END;
-- /

-- PASSENGER SHOPPING ITEMS
CREATE SEQUENCE passenger_shopping_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE PassengerShoppingItems (
    id NUMBER PRIMARY KEY,
    passenger_id NUMBER NOT NULL,
    service_id NUMBER NOT NULL,
    CONSTRAINT fk_pas_shop_passenger FOREIGN KEY (passenger_id) REFERENCES Passengers(passenger_id) ON DELETE CASCADE,
    CONSTRAINT fk_pas_shop_service FOREIGN KEY (service_id) REFERENCES FlightServices(service_id) ON DELETE CASCADE,
    CONSTRAINT uq_pas_shop UNIQUE (passenger_id, service_id)
);

-- CREATE OR REPLACE TRIGGER trg_passenger_shopping_bi
-- BEFORE INSERT ON PassengerShoppingItems
-- FOR EACH ROW
-- BEGIN
--     :NEW.id := passenger_shopping_seq.NEXTVAL;
-- END;
-- /
