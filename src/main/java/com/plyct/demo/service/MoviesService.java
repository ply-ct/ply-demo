package com.plyct.demo.service;

import java.math.BigDecimal;
import java.util.List;

import javax.ws.rs.Path;

import org.json.JSONObject;

import com.plyct.demo.ContextAccess;
import com.plyct.demo.model.Movie;
import com.plyct.demo.persist.Persist;

import io.limberest.api.validate.SwaggerValidator;
import io.limberest.json.JsonList;
import io.limberest.json.JsonRestService;
import io.limberest.service.ServiceException;
import io.limberest.service.http.Request;
import io.limberest.service.http.Request.HttpMethod;
import io.limberest.service.http.Response;
import io.limberest.service.http.Status;
import io.limberest.validate.Result;
import io.limberest.validate.ValidationException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import io.swagger.models.properties.DecimalProperty;

@Path("/movies")
@Api("movies")
public class MoviesService extends JsonRestService {

    @ApiOperation(value="Retrieve movies",
        notes="Returns an (optionally paginated) array of movies matching query criteria.",
        response=Movie.class, responseContainer="List")
    @ApiImplicitParams({
        @ApiImplicitParam(name="title", paramType="query", dataType="string", value="Movie title"),
        @ApiImplicitParam(name="year", paramType="query", dataType="int", value="Year movie was made"),
        @ApiImplicitParam(name="rating", paramType="query", dataType="float", value="Rating (up to 5, multiple of 0.5)"),
        @ApiImplicitParam(name="director", paramType="query", dataType="string", value="Director"),
        @ApiImplicitParam(name="actors", paramType="query", dataType="string", value="Actor(s) match"),
        @ApiImplicitParam(name="sort", paramType="query", dataType="string", value="Sort property"),
        @ApiImplicitParam(name="descending", paramType="query", dataType="boolean", value="Sort descending"),
        @ApiImplicitParam(name="max", paramType="query", dataType="int", value="Limit retrieved items"),
        @ApiImplicitParam(name="start", paramType="query", dataType="int", value="Start with this item index"),
        @ApiImplicitParam(name="search", paramType="query", dataType="string", value="Search string"),
        @ApiImplicitParam(name="count", paramType="query", dataType="boolean", value="Return item count only"),
    })
    public Response<JSONObject> get(Request<JSONObject> request) throws ServiceException {
        validate(request);
        List<Movie> movies = getPersist().retrieve(request.getQuery());
        JsonList<Movie> jsonList = new JsonList<>(movies, "movies");
        return new Response<>(jsonList.toJson());
    }

    @Override
    @ApiOperation(value="Create a movie", response=Movie.class)
    @ApiImplicitParams({
        @ApiImplicitParam(name="Movie", paramType="body", dataType="com.plyct.demo.model.Movie", required=true)})
    public Response<JSONObject> post(Request<JSONObject> request) throws ServiceException {

        validate(request);

        Movie movie = getPersist().create(new Movie(request.getBody()));
        Response<JSONObject> response = new Response<>(Status.CREATED, movie.toJson());
        response.getHeaders().put("Location", request.getBase() + "/movies/" + movie.getId());
        return response;
    }

    /**
     * Require authentication for all methods except GET.
     * See also {@link MovieService#getRolesAllowedAccess(Request)}, which further restricts
     * by authorizing DELETE operations only for a specific role.
     */
    @Override
    public boolean isAuthenticationRequired(Request<JSONObject> request) {
        return request.getMethod() != HttpMethod.GET;
    }

    protected void validate(Request<JSONObject> request) throws ValidationException {
        Result result = getSwaggerValidator(request).validate(request, true);
        if (result.isError())
            throw new ValidationException(result);
    }

    protected SwaggerValidator getSwaggerValidator(Request<JSONObject> request) {
        SwaggerValidator val = new SwaggerValidator(request);
        val.addValidator(DecimalProperty.class, (json, property, path, strict) -> {
            if (property.getName().equals("rating")) {
                BigDecimal value = json.getBigDecimal(property.getName());
                if (value.floatValue() % 0.5 != 0)
                    return new Result(Status.BAD_REQUEST,  path + ": value '" + value + "' must be a multiple of 0.5");
            }
            return new Result(Status.OK);
        });
        return val;
    }

    @SuppressWarnings("unchecked")
    static Persist<Movie> getPersist() {
        return ContextAccess.getApplicationContext().getBean(Persist.class);
    }
}
