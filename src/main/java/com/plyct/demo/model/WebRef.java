package com.plyct.demo.model;

import org.json.JSONObject;

import io.limberest.json.Jsonable;
import io.swagger.annotations.ApiModelProperty;

public class WebRef implements Jsonable {
    
    @ApiModelProperty(required=true, allowableValues="imdb.com,themoviedb.org")
    private String site;
    public String getSite() { return site; }
    public void setSite(String site) { this.site = site; }

    @ApiModelProperty(required=true)
    private String ref;
    public String getRef() { return ref; }
    public void setRef(String ref) { this.ref = ref; }
    
    public WebRef(JSONObject json) {
        bind(json);
    }
    
    public WebRef(String site, String ref) {
        this.site = site;
        this.ref = ref;
    }
    
}
