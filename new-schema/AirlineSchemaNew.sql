INSERT INTO Flights (flight_route, flight_number, departure_time, arrival_time)
VALUES ('New York - London', 'NY100', TO_TIMESTAMP('2025-08-21 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-08-21 20:00:00', 'YYYY-MM-DD HH24:MI:SS'));

INSERT INTO Flights (flight_route, flight_number, departure_time, arrival_time)
VALUES ('Paris - Tokyo', 'PA200', TO_TIMESTAMP('2025-08-22 14:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-08-23 06:00:00', 'YYYY-MM-DD HH24:MI:SS'));

INSERT INTO Flights (flight_route, flight_number, departure_time, arrival_time)
VALUES ('Dubai - Sydney', 'DU300', TO_TIMESTAMP('2025-08-23 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-08-24 04:00:00', 'YYYY-MM-DD HH24:MI:SS'));

INSERT INTO Flights (flight_route, flight_number, departure_time, arrival_time)
VALUES ('Toronto - Frankfurt', 'TO400', TO_TIMESTAMP('2025-08-24 09:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-08-24 18:00:00', 'YYYY-MM-DD HH24:MI:SS'));

INSERT INTO Flights (flight_route, flight_number, departure_time, arrival_time)
VALUES ('Beijing - Los Angeles', 'BJ500', TO_TIMESTAMP('2025-08-25 12:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-08-25 22:00:00', 'YYYY-MM-DD HH24:MI:SS'));


-- INSERT INTO ServiceCategories (category_name) VALUES ('Meals');
-- INSERT INTO ServiceCategories (category_name) VALUES ('Ancillary');
-- INSERT INTO ServiceCategories (category_name) VALUES ('Shopping');

INSERT INTO FlightServices (flight_id, category_id, service_name, service_type, price)
VALUES (1, 1, 'Vegetarian Meal', 'Food', 15.00);

INSERT INTO FlightServices (flight_id, category_id, service_name, service_type, price)
VALUES (2, 2, 'Extra Baggage 20kg', 'Baggage', 50.00);

INSERT INTO FlightServices (flight_id, category_id, service_name, service_type, price)
VALUES (8, 3, 'Duty-Free Perfume', 'Product', 75.00);


INSERT INTO Passengers (flight_id, name, date_of_birth, passport, address, meal_preference, need_wheelchair, travelling_with_infant)
VALUES (1, 'Alice Johnson', TO_DATE('1985-03-10', 'YYYY-MM-DD'), 'P12345678', '123 Main St, NY', 'Vegetarian', 0, 0);

INSERT INTO Passengers (flight_id, name, date_of_birth, passport, address, meal_preference, need_wheelchair, travelling_with_infant)
VALUES (2, 'Bob Smith', TO_DATE('1990-06-25', 'YYYY-MM-DD'), 'P87654321', '456 Park Ave, Paris', 'Non-Veg', 1, 0);

INSERT INTO Passengers (flight_id, name, date_of_birth, passport, address, meal_preference, need_wheelchair, travelling_with_infant)
VALUES (8, 'Carlos Reyes', TO_DATE('1975-11-03', 'YYYY-MM-DD'), 'P23456789', '789 Marina Blvd, Dubai', 'Vegan', 0, 1);

INSERT INTO Passengers (flight_id, name, date_of_birth, passport, address, meal_preference, need_wheelchair, travelling_with_infant)
VALUES (9, 'Dana Lee', TO_DATE('2000-01-15', 'YYYY-MM-DD'), 'P98765432', '321 Sunset Rd, Toronto', 'Vegetarian', 0, 0);

INSERT INTO Passengers (flight_id, name, date_of_birth, passport, address, meal_preference, need_wheelchair, travelling_with_infant)
VALUES (10, 'Emma Wang', TO_DATE('1995-08-08', 'YYYY-MM-DD'), 'P34567890', '654 City St, Beijing', 'Non-Veg', 1, 1);

-- SELECT * FROM Flights;

INSERT INTO PassengerAncillaryServices (passenger_id, service_id) VALUES (1, 2);
INSERT INTO PassengerAncillaryServices (passenger_id, service_id) VALUES (12, 1);
INSERT INTO PassengerAncillaryServices (passenger_id, service_id) VALUES (13, 4);
INSERT INTO PassengerAncillaryServices (passenger_id, service_id) VALUES (14, 5);
INSERT INTO PassengerAncillaryServices (passenger_id, service_id) VALUES (7, 3);

SELECT * FROM PASSENGERANCILLARYSERVICES;

INSERT INTO PassengerMeals (passenger_id, service_id) VALUES (1, 1);
INSERT INTO PassengerMeals (passenger_id, service_id) VALUES (12, 1);
INSERT INTO PassengerMeals (passenger_id, service_id) VALUES (13, 1);
INSERT INTO PassengerMeals (passenger_id, service_id) VALUES (14, 1);
INSERT INTO PassengerMeals (passenger_id, service_id) VALUES (7, 1);

SELECT * FROM FLIGHTSERVICES;

INSERT INTO PassengerShoppingItems (passenger_id, service_id) VALUES (1, 3);
INSERT INTO PassengerShoppingItems (passenger_id, service_id) VALUES (2, 3);
INSERT INTO PassengerShoppingItems (passenger_id, service_id) VALUES (3, 3);
INSERT INTO PassengerShoppingItems (passenger_id, service_id) VALUES (4, 3);
INSERT INTO PassengerShoppingItems (passenger_id, service_id) VALUES (5, 3);

select * from flights;

INSERT INTO SeatAssignments (flight_id, passenger_id, seat_no, checked_in) VALUES (1, 1, '12A', 1);
INSERT INTO SeatAssignments (flight_id, passenger_id, seat_no, checked_in) VALUES (2, 12, '14B', 0);
INSERT INTO SeatAssignments (flight_id, passenger_id, seat_no, checked_in) VALUES (8, 13, '15C', 1);
INSERT INTO SeatAssignments (flight_id, passenger_id, seat_no, checked_in) VALUES (9, 14, '16D', 0);
INSERT INTO SeatAssignments (flight_id, passenger_id, seat_no, checked_in) VALUES (10, 7, '17E', 1);

commit;

-- INSERT INTO Users (username, password_hash, role) VALUES ('admin1', 'hashedpassword1', 'Admin');
-- INSERT INTO Users (username, password_hash, role) VALUES ('staff1', 'hashedpassword2', 'Staff');
-- INSERT INTO Users (username, password_hash, role) VALUES ('agent1', 'hashedpassword3', 'Agent');
-- INSERT INTO Users (username, password_hash, role) VALUES ('admin2', 'hashedpassword4', 'Admin');
-- INSERT INTO Users (username, password_hash, role) VALUES ('staff2', 'hashedpassword5', 'Staff');