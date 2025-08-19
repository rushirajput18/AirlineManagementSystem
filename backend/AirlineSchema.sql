-- ====================================
-- Sequences
-- ====================================

CREATE SEQUENCE flights_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE SEQUENCE flight_services_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE SEQUENCE passengers_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE SEQUENCE pas_ancillary_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE SEQUENCE passenger_meals_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE SEQUENCE passenger_shopping_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE SEQUENCE seat_assignments_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE SEQUENCE service_categories_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE SEQUENCE users_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;


-- ====================================
-- Tables
-- ====================================

CREATE TABLE Flights (
    flight_id NUMBER(19) NOT NULL,
    flight_route VARCHAR2(255) NOT NULL,
    flight_number VARCHAR2(255) NOT NULL UNIQUE,
    departure_time TIMESTAMP NULL,
    arrival_time TIMESTAMP NULL,
    CONSTRAINT pk_flights PRIMARY KEY (flight_id)
);

CREATE TABLE ServiceCategories (
    category_id NUMBER(19) NOT NULL,
    category_name VARCHAR2(255) NOT NULL UNIQUE,
    CONSTRAINT pk_service_categories PRIMARY KEY (category_id)
);

CREATE TABLE FlightServices (
    service_id NUMBER(19) NOT NULL,
    flight_id NUMBER(19) NOT NULL,
    category_id NUMBER(19) NOT NULL,
    service_name VARCHAR2(255) NOT NULL,
    service_type VARCHAR2(255) NULL,
    price NUMBER(19, 2) NOT NULL,
    CONSTRAINT pk_flight_services PRIMARY KEY (service_id),
    CONSTRAINT fk_flight_services_flight FOREIGN KEY (flight_id) REFERENCES Flights(flight_id) ON DELETE CASCADE,
    CONSTRAINT fk_flight_services_category FOREIGN KEY (category_id) REFERENCES ServiceCategories(category_id)
);

CREATE TABLE Passengers (
    passenger_id NUMBER(19) NOT NULL,
    flight_id NUMBER(19) NOT NULL,
    name VARCHAR2(255) NOT NULL,
    date_of_birth DATE NULL,
    passport VARCHAR2(255) NULL,
    address CLOB NULL,
    meal_preference VARCHAR2(255) NOT NULL,
    need_wheelchair NUMBER(1) DEFAULT 0 NOT NULL,
    travelling_with_infant NUMBER(1) DEFAULT 0 NOT NULL,
    CONSTRAINT pk_passengers PRIMARY KEY (passenger_id),
    CONSTRAINT fk_passengers_flight FOREIGN KEY (flight_id) REFERENCES Flights(flight_id) ON DELETE CASCADE
);

CREATE TABLE PassengerAncillaryServices (
    id NUMBER(19) NOT NULL,
    passenger_id NUMBER(19) NOT NULL,
    service_id NUMBER(19) NOT NULL,
    CONSTRAINT pk_passenger_ancillary PRIMARY KEY (id),
    CONSTRAINT fk_pas_passenger FOREIGN KEY (passenger_id) REFERENCES Passengers(passenger_id) ON DELETE CASCADE,
    CONSTRAINT fk_pas_service FOREIGN KEY (service_id) REFERENCES FlightServices(service_id) ON DELETE CASCADE,
    CONSTRAINT uq_pas_passenger_service UNIQUE (passenger_id, service_id)
);

CREATE TABLE PassengerMeals (
    id NUMBER(19) NOT NULL,
    passenger_id NUMBER(19) NOT NULL,
    service_id NUMBER(19) NOT NULL,
    CONSTRAINT pk_passenger_meals PRIMARY KEY (id),
    CONSTRAINT fk_pm_passenger FOREIGN KEY (passenger_id) REFERENCES Passengers(passenger_id) ON DELETE CASCADE,
    CONSTRAINT fk_pm_service FOREIGN KEY (service_id) REFERENCES FlightServices(service_id) ON DELETE CASCADE,
    CONSTRAINT uq_pm_passenger_service UNIQUE (passenger_id, service_id)
);

CREATE TABLE PassengerShoppingItems (
    id NUMBER(19) NOT NULL,
    passenger_id NUMBER(19) NOT NULL,
    service_id NUMBER(19) NOT NULL,
    CONSTRAINT pk_passenger_shopping PRIMARY KEY (id),
    CONSTRAINT fk_psi_passenger FOREIGN KEY (passenger_id) REFERENCES Passengers(passenger_id) ON DELETE CASCADE,
    CONSTRAINT fk_psi_service FOREIGN KEY (service_id) REFERENCES FlightServices(service_id) ON DELETE CASCADE,
    CONSTRAINT uq_psi_passenger_service UNIQUE (passenger_id, service_id)
);

CREATE TABLE SeatAssignments (
    assignment_id NUMBER(19) NOT NULL,
    flight_id NUMBER(19) NOT NULL,
    passenger_id NUMBER(19) NOT NULL,
    seat_no VARCHAR2(10) NOT NULL,
    checked_in NUMBER(1) DEFAULT 0 NOT NULL,
    CONSTRAINT pk_seat_assignments PRIMARY KEY (assignment_id),
    CONSTRAINT fk_sa_flight FOREIGN KEY (flight_id) REFERENCES Flights(flight_id) ON DELETE CASCADE,
    CONSTRAINT fk_sa_passenger FOREIGN KEY (passenger_id) REFERENCES Passengers(passenger_id) ON DELETE CASCADE,
    CONSTRAINT uq_sa_flight_seat UNIQUE (flight_id, seat_no),
    CONSTRAINT uq_sa_passenger_flight UNIQUE (passenger_id, flight_id)
);

CREATE TABLE Users (
    user_id NUMBER(19) NOT NULL,
    username VARCHAR2(255) NOT NULL UNIQUE,
    password_hash VARCHAR2(255) NOT NULL,
    role VARCHAR2(255) NOT NULL,
    CONSTRAINT pk_users PRIMARY KEY (user_id)
);

-- ====================================
-- Triggers for automatic ID assignment
-- ====================================

CREATE OR REPLACE TRIGGER trg_flights_id
BEFORE INSERT ON Flights
FOR EACH ROW
WHEN (NEW.flight_id IS NULL)
BEGIN
    SELECT flights_seq.NEXTVAL INTO :NEW.flight_id FROM dual;
END;
/

CREATE OR REPLACE TRIGGER trg_flight_services_id
BEFORE INSERT ON FlightServices
FOR EACH ROW
WHEN (NEW.service_id IS NULL)
BEGIN
    SELECT flight_services_seq.NEXTVAL INTO :NEW.service_id FROM dual;
END;
/

CREATE OR REPLACE TRIGGER trg_passengers_id
BEFORE INSERT ON Passengers
FOR EACH ROW
WHEN (NEW.passenger_id IS NULL)
BEGIN
    SELECT passengers_seq.NEXTVAL INTO :NEW.passenger_id FROM dual;
END;
/

CREATE OR REPLACE TRIGGER trg_pas_ancillary_id
BEFORE INSERT ON PassengerAncillaryServices
FOR EACH ROW
WHEN (NEW.id IS NULL)
BEGIN
    SELECT pas_ancillary_seq.NEXTVAL INTO :NEW.id FROM dual;
END;
/

CREATE OR REPLACE TRIGGER trg_passenger_meals_id
BEFORE INSERT ON PassengerMeals
FOR EACH ROW
WHEN (NEW.id IS NULL)
BEGIN
    SELECT passenger_meals_seq.NEXTVAL INTO :NEW.id FROM dual;
END;
/

CREATE OR REPLACE TRIGGER trg_passenger_shopping_id
BEFORE INSERT ON PassengerShoppingItems
FOR EACH ROW
WHEN (NEW.id IS NULL)
BEGIN
    SELECT passenger_shopping_seq.NEXTVAL INTO :NEW.id FROM dual;
END;
/

CREATE OR REPLACE TRIGGER trg_seat_assignments_id
BEFORE INSERT ON SeatAssignments
FOR EACH ROW
WHEN (NEW.assignment_id IS NULL)
BEGIN
    SELECT seat_assignments_seq.NEXTVAL INTO :NEW.assignment_id FROM dual;
END;
/

CREATE OR REPLACE TRIGGER trg_service_categories_id
BEFORE INSERT ON ServiceCategories
FOR EACH ROW
WHEN (NEW.category_id IS NULL)
BEGIN
    SELECT service_categories_seq.NEXTVAL INTO :NEW.category_id FROM dual;
END;
/

CREATE OR REPLACE TRIGGER trg_users_id
BEFORE INSERT ON Users
FOR EACH ROW
WHEN (NEW.user_id IS NULL)
BEGIN
    SELECT users_seq.NEXTVAL INTO :NEW.user_id FROM dual;
END;

