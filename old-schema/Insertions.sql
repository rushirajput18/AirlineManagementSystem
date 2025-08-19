-- Insert users
INSERT INTO Users (username, password_hash, role) VALUES ('admin1', 'hashpass1', 'admin');
INSERT INTO Users (username, password_hash, role) VALUES ('staff1', 'hashpass2', 'staff');

-- Insert flights
INSERT INTO Flights (flight_id, flight_route, flight_number, departure_time, arrival_time)
VALUES (flights_seq.NEXTVAL, 'New York - London', 'NY1001', TO_TIMESTAMP('2025-09-01 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-09-01 20:00:00', 'YYYY-MM-DD HH24:MI:SS'));

INSERT INTO Flights (flight_id, flight_route, flight_number, departure_time, arrival_time)
VALUES (flights_seq.NEXTVAL, 'Delhi - Paris', 'DL2001', TO_TIMESTAMP('2025-09-02 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-09-02 18:00:00', 'YYYY-MM-DD HH24:MI:SS'));

INSERT INTO Flights (flight_id, flight_route, flight_number, departure_time, arrival_time)
VALUES (flights_seq.NEXTVAL, 'Delhi - London', 'DL2002', TO_TIMESTAMP('2025-09-02 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-09-02 18:00:00', 'YYYY-MM-DD HH24:MI:SS'));


INSERT INTO Flights (flight_id, flight_route, flight_number, departure_time, arrival_time)
VALUES (flights_seq.NEXTVAL, 'Delhi - Jammu', 'DL2003', TO_TIMESTAMP('2025-09-02 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-09-02 18:00:00', 'YYYY-MM-DD HH24:MI:SS'));

INSERT INTO Flights (flight_id, flight_route, flight_number, departure_time, arrival_time)
VALUES (flights_seq.NEXTVAL, 'Pakistan - Jammu', 'DL2004', TO_TIMESTAMP('2025-09-02 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-09-02 18:00:00', 'YYYY-MM-DD HH24:MI:SS'));

truncate table Flights;
-- Insert service categories
INSERT INTO ServiceCategories (category_id, category_name) VALUES (service_categories_seq.NEXTVAL, 'ancillary');
INSERT INTO ServiceCategories (category_id, category_name) VALUES (service_categories_seq.NEXTVAL, 'meal');
INSERT INTO ServiceCategories (category_id, category_name) VALUES (service_categories_seq.NEXTVAL, 'shopping');

-- Insert flight services
-- For flight 1 (assume flight_id = 1), service category ids: 1=ancillary, 2=meal, 3=shopping
INSERT INTO FlightServices (service_id, flight_id, category_id, service_name, service_type, price)
VALUES (flight_services_seq.NEXTVAL, 17, 2, 'Extra Baggage', NULL, 30.00);

INSERT INTO FlightServices (service_id, flight_id, category_id, service_name, service_type, price)
VALUES (flight_services_seq.NEXTVAL, 18, 2, 'Veg Meal', 'veg', 10.00);

INSERT INTO FlightServices (service_id, flight_id, category_id, service_name, service_type, price)
VALUES (flight_services_seq.NEXTVAL, 17, 2, 'Travel Pillow', NULL, 15.00);

--truncate table Flights;
-- Insert passengers (assume flight_id = 1)
INSERT INTO Passengers (passenger_id, flight_id, name, date_of_birth, passport, address, meal_preference, need_wheelchair, travelling_with_infant)
VALUES (passengers_seq.NEXTVAL, 17, 'Alice Johnson', TO_DATE('1985-03-15', 'YYYY-MM-DD'), 'P1234567', '123 Elm Street, NY', 'veg', 0, 1);

INSERT INTO Passengers (passenger_id, flight_id, name, date_of_birth, passport, address, meal_preference, need_wheelchair, travelling_with_infant)
VALUES (passengers_seq.NEXTVAL, 18, 'Bob Smith', TO_DATE('1990-11-20', 'YYYY-MM-DD'), 'P7654321', '456 Oak Street, NY', 'non-veg', 1, 0);

-- Assign seats (assume passenger_id = 1 and 2)
INSERT INTO SeatAssignments (assignment_id, flight_id, passenger_id, seat_no, checked_in)
VALUES (seat_assignments_seq.NEXTVAL, 17, 1, '12A', 1);

INSERT INTO SeatAssignments (assignment_id, flight_id, passenger_id, seat_no, checked_in)
VALUES (seat_assignments_seq.NEXTVAL, 18, 2, '12B', 0);

-- Passenger selects ancillary service (service_id = 1)
INSERT INTO PassengerAncillaryServices (id, passenger_id, service_id)
VALUES (pas_ancillary_seq.NEXTVAL, 1, 5);

-- Passenger selects meal (service_id = 2)
INSERT INTO PassengerMeals (id, passenger_id, service_id)
VALUES (passenger_meals_seq.NEXTVAL, 3, 6);

-- Passenger selects shopping item (service_id = 3)
INSERT INTO PassengerShoppingItems (id, passenger_id, service_id)
VALUES (passenger_shopping_seq.NEXTVAL, 1, 5);

DELETE from flightservices where service_id=6;
DELETE FROM Passengers WHERE passenger_id = 1;
