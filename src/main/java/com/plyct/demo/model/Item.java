package com.plyct.demo.model;

import org.json.JSONObject;

import io.limberest.json.Jsonable;
import io.swagger.annotations.ApiModelProperty;

public class Item implements Jsonable {
    
    private String id;
    public String getId() { return id; }

    @ApiModelProperty(required=true)
    private String title;
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    private String category;
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public Item(JSONObject json) {
        bind(json);
        // explicitly bind id since it has no public setter
        if (json.has("id"))
            id = json.getString("id");
    }
    
    public Item(String id, String title) {
        this.id = id;
        this.title = title;
    }    
}
