package com.plyct.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;

@SpringBootApplication
@ServletComponentScan("io.limberest.service.http")
public class App {

	public static void main(String[] args) {
		SpringApplication.run(App.class, args);
	}
}
