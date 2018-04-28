package com.plyct.demo.model;

import java.math.BigDecimal;
import java.util.List;

import javax.validation.constraints.Size;

import org.json.JSONObject;

import io.limberest.json.Jsonable;
import io.swagger.annotations.ApiModelProperty;

public class Movie extends Item implements Jsonable {
    
    /**
     * By convention, Jsonables have a constructor that takes a JSONObject.
     */
    public Movie(JSONObject json) {
        super(json);
        rating = json.optBigDecimal("rating", BigDecimal.ZERO).floatValue();
    }
    
    /**
     * Copy a movie and assign its id. 
     */
    public Movie(String id, Movie movie) {
        super(id, movie.getTitle());
        super.setCategory(movie.getCategory());
        year = movie.year;
        poster = movie.poster;
        rating = movie.rating;
        description = movie.description;
        owned = movie.owned;
        webRef = movie.webRef;
        credits = movie.credits;
    }

    public Movie(String id, String title) {
        super(id, title);
    }
    
    @ApiModelProperty(required=true, allowableValues="range[1900, infinity]")    
    private int year;
    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }
    
    private List<Credit> credits;
    public List<Credit> getCredits() { return credits; }
    public void setCredits(List<Credit> credits) { this.credits = credits; }
    
    private String poster;
    public String getPoster() { return poster; }
    public void setPoster(String image) { this.poster = image; }

    @Size(max=5)
    @ApiModelProperty("Must be a multiple of 0.5")
    private float rating;
    public float getRating() { return rating; }
    public void setRating(float rating) { this.rating = rating; }
    
    @Size(max=2048)
    private String description;
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    private WebRef webRef;
    public WebRef getWebRef() { return webRef; }
    public void setWebRef(WebRef webRef) { this.webRef = webRef; }
    
    private boolean owned;
    public boolean isOwned() { return owned; }
    public void setOwned(boolean owned) { this.owned = owned; }
    
    /**
     * Overridden since rating (float) is a nonstandard JSONObject type.
     */
    @Override
    public JSONObject toJson() {
      JSONObject json = super.toJson();
      if (rating > 0)
          json.put("rating", BigDecimal.valueOf(rating).setScale(1));
      else if (json.has("rating"))
          json.remove("rating"); // zero means unrated
      return json;
    }

    @Override
    public String jsonName() {
        return "movie";
    }    
}
