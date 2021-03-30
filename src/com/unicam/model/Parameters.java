package com.unicam.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Parameters {
	private Map<String, String> paramsAndValue = new HashMap<String, String>();
	private String privateKey;
	
	
	public Map<String, String> getParamsAndValue() {
		return paramsAndValue;
	}

	public void setParamsAndValue(Map<String, String> paramsAndValue) {
		this.paramsAndValue = paramsAndValue;
	}
	public String getPrivateKey() {
		return privateKey;
	}
	public void setPrivateKey(String privateKey) {
		this.privateKey = privateKey;
	}

	public Parameters(Map<String, String> paramsAndValue, String privateKey) {
		super();
		this.paramsAndValue = paramsAndValue;
		this.privateKey = privateKey;
	}

	public Parameters() {
		super();
	}

}
