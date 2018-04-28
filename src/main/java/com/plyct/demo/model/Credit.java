package com.plyct.demo.model;

import org.json.JSONObject;

import io.limberest.json.Jsonable;
import io.swagger.annotations.ApiModelProperty;

public class Credit implements Jsonable {

    @ApiModelProperty(required=true)
    private String name;
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    @ApiModelProperty(value="Can be just a generic designation (eg: 'director', 'actor')", required=true)    
    private String role;
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public Credit(JSONObject json) {
        bind(json);
    }
    
    public Credit(String name, String role) {
        this.name = name;
        this.role = role;
    }    
}
