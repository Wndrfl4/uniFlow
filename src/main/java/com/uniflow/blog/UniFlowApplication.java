
package com.uniflow.blog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class UniFlowApplication {

    public static void main(String[] args) {
        SpringApplication.run(UniFlowApplication.class, args);
    }
}
