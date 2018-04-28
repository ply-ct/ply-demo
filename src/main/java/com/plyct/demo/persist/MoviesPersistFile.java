package com.plyct.demo.persist;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.json.JSONObject;

import com.plyct.demo.model.Movie;

import io.limberest.json.JsonList;
import io.limberest.json.JsonMatcher;
import io.limberest.json.JsonObject;
import io.limberest.json.JsonableComparator;
import io.limberest.service.Query;
import io.limberest.service.http.Status;
import io.limberest.util.FileLoader;

/**
 * Persistence implementation with a JSON file store.
 * Caches movies in memory.
 */
public class MoviesPersistFile implements Persist<Movie> {

    private String path;
    
    public MoviesPersistFile(String path) {
        this.path = path;
    }
    
    @Override
    public List<Movie> retrieve(Query query) throws PersistException {
        List<Movie> movies = getMovies();
        Stream<Movie> stream = movies.stream();
        
        // filter
        if (query.hasFilters() || query.getSearch() != null) {
            stream = stream.filter(movie -> query.match(new JsonMatcher(movie.toJson())));
        }
        
        // sort
        if ((query.getSort() != null && !"title".equals(query.getSort())) || query.isDescending()) {
            stream = stream.sorted(new JsonableComparator(query, (j1, j2) -> {
                return getSortTitle(j1).compareToIgnoreCase(getSortTitle(j2));
            }));
        }
        
        // paginate
        if (query.getStart() > 0)
            stream = stream.skip(query.getStart());
        if (query.getMax() != Query.MAX_ALL)
            stream = stream.limit(query.getMax());
        
        return stream.collect(Collectors.toList());
    }
    
    @Override
    public Movie get(String id) throws PersistException {
        for (Movie movie : getMovies()) {
            if (movie.getId().equals(id))
                return movie;
        }
        return null;
    }
    
    @Override
    public Movie create(Movie movie) throws PersistException {
        synchronized(MoviesPersistFile.class) {
            load();
            String unique = movie.getTitle() + " (" + movie.getYear() + ")";
            String id = Integer.toHexString(unique.hashCode());
            for (Movie m : _movies) {
                if (m.getId().equals(id)) {
                    throw new PersistException(Status.CONFLICT,
                            "Movie already exists with id=" + id + ": " + m.getTitle() + " (" + m.getYear() + ")");
                }
            }
            Movie newMovie = new Movie(id, movie);
            _movies.add(newMovie);
            save();
            return newMovie;
        }
    }

    @Override
    public void update(Movie movie) throws PersistException {
        synchronized(MoviesPersistFile.class) {
            load();
            Movie toReplace = null;
            for (Movie m : _movies) {
                if (m.getId().equals(movie.getId())) {
                    toReplace = m;
                    break;
                }
            }
            if (toReplace == null)
                throw new PersistException(Status.NOT_FOUND, "Movie not found with id: " + movie.getId());
            _movies.remove(toReplace);
            _movies.add(movie);
            save();
        }
    }


    @Override
    public void delete(String id) throws PersistException {
        synchronized(MoviesPersistFile.class) {
            load();
            int idx = -1;
            for (int i = 0; i < _movies.size(); i++) {
                if (id.equals(_movies.get(i).getId())) {
                    idx = i;
                    break;
                }
            }
            if (idx == -1)
                throw new PersistException(Status.NOT_FOUND, "Movie not found with id: " + id);
            _movies.remove(idx);
            save();
        }
    }
    
    public void load() throws PersistException {
        try {
            String json;
            File file = new File(path);
            if (file.isFile()) {
                json = new String(Files.readAllBytes(Paths.get(file.getPath())));
            }
            else {
                json = new String(new FileLoader(path).readFromClassLoader());
            }
            
            // use Limberest's JsonObject for sorted keys
            JSONObject jsonObj = new JsonObject(json);
            JsonList<Movie> jsonList = new JsonList<Movie>(jsonObj, Movie.class);
            _movies = jsonList.getList();
            _movies.sort((m1, m2) -> {
                return getSortTitle(m1.toJson()).compareToIgnoreCase(getSortTitle(m2.toJson()));
            });
        }
        catch (IOException ex) {
            throw new PersistException(ex.getMessage(), ex);
        }
    }
    
    private void save() throws PersistException {
        JsonList<Movie> movieList = new JsonList<>(_movies, "movies");
        try {
            File file = new File(path).getAbsoluteFile();
            File parent = file.getParentFile();
            if (parent != null && !parent.exists() && !file.getParentFile().mkdirs())
                    throw new IOException("Unable to create directories: " + file.getParentFile().getAbsolutePath());
            Files.write(Paths.get(file.getPath()), movieList.toJson().toString(2).getBytes());
        }
        catch (IOException ex) {
            throw new PersistException(ex.getMessage(), ex);
        }
    }
    
    private static List<Movie> _movies;
    private List<Movie> getMovies() throws PersistException {
        synchronized(MoviesPersistFile.class) {
            if (_movies == null)
                load();
        }
        return _movies;
    }
    
    private static final String[] ignoredLeadingArticles = new String[]{"A ", "An ", "The "};
    private static String getSortTitle(JSONObject json) {
        String title = json.has("title") ? json.getString("title") : "";
        for (String leadingArticle : ignoredLeadingArticles) {
            if (title.startsWith(leadingArticle))
                return title.substring(leadingArticle.length());
        }
        return title;
    }

    @Override
    public Class<Movie> getType() {
        return Movie.class;
    }
}
