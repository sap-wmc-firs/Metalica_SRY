package com.zuul.apigateway.zuulapiservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.context.annotation.Bean;


@EnableEurekaClient
@EnableZuulProxy
@SpringBootApplication
public class ZuulApiServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ZuulApiServiceApplication.class, args);
	}
	
	@Bean
	public SimpleFilter simpleFilter() {
		return new SimpleFilter();
	}
}
