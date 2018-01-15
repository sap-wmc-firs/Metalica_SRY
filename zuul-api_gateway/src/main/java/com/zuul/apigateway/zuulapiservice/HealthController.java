package com.zuul.apigateway.zuulapiservice;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {
	
	@RequestMapping("/serviceHealth")
	public ResponseEntity<String> getHealth(HttpServletRequest req, HttpServletResponse res){
		return new ResponseEntity<String>(HttpStatus.OK);
	}

}
