#![feature(plugin)]
#![plugin(rocket_codegen)]

extern crate rocket;
extern crate rocket_contrib;

use std::collections::HashMap;
use rocket_contrib::Template;

#[get("/")]
fn root() -> Template {
    let context = HashMap::<String, String>::new();
    Template::render("index", context)
}

fn main() {
    rocket::ignite()
        .mount("/", routes![root])
        .attach(Template::fairing())
        .launch();
}

