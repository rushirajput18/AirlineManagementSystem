INSERT INTO Flights (flight_route, flight_number, departure_time, arrival_time)
VALUES ('Delhi to Mumbai', 'AI101', TO_TIMESTAMP('2025-08-19 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-08-19 10:00:00', 'YYYY-MM-DD HH24:MI:SS'));

INSERT INTO Flights (flight_route, flight_number, departure_time, arrival_time)
VALUES ('Bangalore to Chennai', 'AI202', TO_TIMESTAMP('2025-08-19 12:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-08-19 13:30:00', 'YYYY-MM-DD HH24:MI:SS'));


INSERT INTO ServiceCategories (category_name) VALUES ('Meals');
INSERT INTO ServiceCategories (category_name) VALUES ('Ancillary');
INSERT INTO ServiceCategories (category_name) VALUES ('Shopping');

SELECT * FROM FLIGHTS;


SELECT trigger_name, status FROM user_triggers WHERE table_name = 'FLIGHTS';

COMMIT;

-- Assuming flight_id = 1 (Delhi to Mumbai), category_id = 1 (Meals)
INSERT INTO FlightServices (flight_id, category_id, service_name, service_type, price)
VALUES (1, 1, 'Vegetarian Meal', 'Veg', 350.00);

-- flight_id = 1, category_id = 2 (Ancillary)
INSERT INTO FlightServices (flight_id, category_id, service_name, service_type, price)
VALUES (1, 2, 'Extra Legroom', NULL, 500.00);

-- flight_id = 2 (Bangalore to Chennai), category_id = 3 (Shopping)
INSERT INTO FlightServices (flight_id, category_id, service_name, service_type, price)
VALUES (2, 3, 'Perfume', NULL, 1200.00);



-- Assuming passenger_id = 1, service_id = 1 (Vegetarian Meal)
INSERT INTO PassengerMeals (passenger_id, service_id) VALUES (1, 1);

-- passenger_id = 1, service_id = 2 (Extra Legroom)
INSERT INTO PassengerAncillaryServices (passenger_id, service_id) VALUES (1, 2);


-- passenger_id = 2, service_id = 3 (Perfume)
INSERT INTO PassengerShoppingItems (passenger_id, service_id) VALUES (2, 3);






-- passenger_id = 1, flight_id = 1
INSERT INTO SeatAssignments (flight_id, passenger_id, seat_no, checked_in) VALUES (1, 1, '12A', 1);

-- passenger_id = 2, flight_id = 2
INSERT INTO SeatAssignments (flight_id, passenger_id, seat_no, checked_in) VALUES (2, 2, '5C', 0);




INSERT INTO Users (username, password_hash, role) VALUES ('admin', 'hashed_password_123', 'ADMIN');
INSERT INTO Users (username, password_hash, role) VALUES ('staff1', 'hashed_password_456', 'STAFF');
INSERT INTO Users (username, password_hash, role) VALUES ('staff1', 'hashed_password_456', 'STAFF');


select * from flight_services;
SELECT * FROM ServiceCategories;
SELECT * FROM FlightServices;
SELECT * FROM Passengers;
SELECT * FROM PassengerMeals;
SELECT * FROM PassengerAncillaryServices;
SELECT * FROM PassengerAncillaryServices;
SELECT * FROM Users;
select * from flights;

SELECT * FROM FLIGHTS;


SELECT * FROM SeatAssignments;
UPDATE Flights
SET flight_route = 'DEL-MUM'
WHERE flight_number = 'AI101';
UPDATE Flights
SET flight_route = 'BLR-MAA'
WHERE flight_number = 'AI202'


SELECT flight_id, flight_route, flight_number, departure_time, arrival_time FROM Flights;
;