package com.oracle.flightmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.load();

		System.setProperty("DB_URL", dotenv.get("DB_URL"));
		System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
		System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
		System.setProperty("FRONTEND_ORIGIN", dotenv.get("FRONTEND_ORIGIN"));
		System.setProperty("AUTH_SERVICE_PORT", dotenv.get("AUTH_SERVICE_PORT"));
		System.setProperty("FLIGHT_SERVICE_PORT", dotenv.get("FLIGHT_SERVICE_PORT"));
		
		SpringApplication.run(BackendApplication.class, args);
	}

}
