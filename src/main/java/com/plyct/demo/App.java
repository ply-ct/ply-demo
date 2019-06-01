package com.plyct.demo;

import org.apache.catalina.Context;
import org.apache.tomcat.util.descriptor.web.FilterDef;
import org.apache.tomcat.util.descriptor.web.FilterMap;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.embedded.tomcat.TomcatContextCustomizer;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@ServletComponentScan("io.limberest.service.http")
public class App {

	public static void main(String[] args) {
		SpringApplication.run(App.class, args);
	}
	
	/**
	 * Allow CORs access.
	 */
    @Bean
    public TomcatServletWebServerFactory containerFactory() {
        TomcatServletWebServerFactory tomcat = new TomcatServletWebServerFactory();
        tomcat.addContextCustomizers(new TomcatContextCustomizer() {
            public void customize(Context context) {
                FilterDef corsFilter = new FilterDef();
                corsFilter.setFilterName("CorsFilter");
                corsFilter.setFilterClass("org.apache.catalina.filters.CorsFilter");
                corsFilter.addInitParameter("cors.allowed.methods", "GET,POST,PUT,DELETE,HEAD,OPTIONS");
                corsFilter.addInitParameter("cors.allowed.headers", "Content-Type,X-Requested-With,accept,Origin,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization");
                corsFilter.addInitParameter("cors.allowed.origins", "*");
                context.addFilterDef(corsFilter);
                FilterMap filterMap = new FilterMap();
                filterMap.setFilterName(corsFilter.getFilterName());
                filterMap.addURLPattern("/*");
                context.addFilterMap(filterMap);                
            }
        });
        return tomcat;
    }
}
