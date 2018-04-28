package com.plyct.demo.service;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Path;

import org.json.JSONObject;

import com.plyct.demo.model.Movie;

import io.limberest.json.StatusResponse;
import io.limberest.service.ServiceException;
import io.limberest.service.http.Request;
import io.limberest.service.http.Request.HttpMethod;
import io.limberest.service.http.Response;
import io.limberest.service.http.Status;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

/**
 * Extends {@link MoviesService} for paths qualified by movie ID.
 */
@Path(value="/movies/{id}" )
@Api("movie")
public class MovieService extends MoviesService {

    /**
     * Overrides {@link MoviesService#get()} to return a single movie with the specified id.
     */
    @Override
    @ApiOperation(value="Retrieve a movie by {id}", response=Movie.class)
    @ApiImplicitParams({
        @ApiImplicitParam(name="id", paramType="path", dataType="string", required=true)})
    public Response<JSONObject> get(Request<JSONObject> request) throws ServiceException {

        validate(request);

        String id = request.getPath().getSegment(1);
        Movie movie = getPersist().get(id);
        if (movie == null)
            throw new ServiceException(Status.NOT_FOUND, "Movie not found with id: " + id);
        else
            return new Response<>(movie.toJson());
    }

    @Override
    @ApiOperation(value="Update a movie.", response=StatusResponse.class)
    @ApiImplicitParams({
        @ApiImplicitParam(name="id", paramType="path", dataType="string", required=true),
        @ApiImplicitParam(name="Movie", paramType="body", dataType="com.plyct.demo.model.Movie", required=true)})
    public Response<JSONObject> put(Request<JSONObject> request) throws ServiceException {

        validate(request);

        String id = request.getPath().getSegment(1);
        if (id == null)
            throw new ServiceException(Status.BAD_REQUEST, "Missing path segment: id");
        Movie movie = new Movie(request.getBody());
        if (movie.getId() != null && !id.equals(movie.getId()))
            throw new ServiceException(Status.BAD_REQUEST, "Cannot modify movie id: " + id);
        if (movie.getId() == null)
            movie = new Movie(id, movie);

        getPersist().update(movie);
        StatusResponse statusResponse = new StatusResponse(Status.OK, "Movie updated: " + movie.getId());
        return new Response<>(statusResponse.toJson());
    }

    @Override
    @ApiOperation(value="Delete a movie.", response=StatusResponse.class)
    @ApiImplicitParams({
        @ApiImplicitParam(name="id", paramType="path", dataType="string", required=true)})
    public Response<JSONObject> delete(Request<JSONObject> request) throws ServiceException {

        validate(request);

        String id = request.getPath().getSegment(1);
        if (id == null)
            throw new ServiceException(Status.BAD_REQUEST, "Missing path segment: id");
        getPersist().delete(id);
        StatusResponse statusResponse = new StatusResponse(Status.OK, "Movie deleted: " + id);
        return new Response<>(statusResponse.toJson());
    }

    @Override
    public Response<JSONObject> post(Request<JSONObject> request)
            throws ServiceException {
        throw new ServiceException(Status.NOT_IMPLEMENTED, HttpMethod.POST + " not implemented");
    }

    /**
     * This implementation illustrates how to restrict operations to users
     * with specific roles.  Only DELETE operations are restricted here.
     */
    @Override
    public List<String> getRolesAllowedAccess(Request<JSONObject> request) {
        if (request.getMethod() == HttpMethod.DELETE) {
            List<String> roles = new ArrayList<>();
            roles.add("Deleters");
            return roles;
        }
        return null; // access is not restricted for other operations
    }
}