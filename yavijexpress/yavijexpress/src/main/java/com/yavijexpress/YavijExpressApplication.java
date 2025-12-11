package com.yavijexpress;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class YavijExpressApplication {
	public static void main(String[] args) {
		SpringApplication.run(YavijExpressApplication.class, args);
		System.out.println("🚗 YaVij-Express Backend Started Successfully!");
	}
}