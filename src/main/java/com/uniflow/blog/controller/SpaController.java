package com.uniflow.blog.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

    @RequestMapping(value = {
        "/", "/login", "/register",
        "/posts/{id}", "/posts/create", "/posts/{id}/edit",
        "/ai", "/profile", "/admin",
        "/messages", "/messages/{userId}"
    })
    public String spa() {
        return "forward:/index.html";
    }
}
