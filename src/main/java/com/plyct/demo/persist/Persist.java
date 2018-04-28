package com.plyct.demo.persist;

import java.util.List;

import io.limberest.service.Query;
import io.limberest.service.ServiceException;
import io.limberest.service.http.Status;

public interface Persist<T> {

    List<T> retrieve(Query query) throws PersistException;
    T get(String id) throws PersistException;
    T create(T item) throws PersistException;
    void update(T item) throws PersistException;
    void delete(String id) throws PersistException;
    Class<T> getType();
    
    public class PersistException extends ServiceException {

        public PersistException(String message, Throwable cause) {
            this(Status.INTERNAL_ERROR, message, cause);
        }
        
        public PersistException(Status status, String message) {
            super(status, message);
        }

        public PersistException(Status status, String message, Throwable cause) {
            super(status, message, cause);
        }
        
        public PersistException(Status status, Throwable cause) {
            super(status, cause);
        }
    }    
}
