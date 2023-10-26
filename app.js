const express = require("express");
const { projects } = require("./data.json");
const path = require("path");

const app = express();

app.set("view engine", "pug");

app.use('/static', express.static('public'));

app.get("/", (req, res) => {
    // res.locals.projects = projects;
    res.render("index", { projects });
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/projects/:id", (req, res) => {
    res.render('project', {
        project_name: projects[req.params.id].project_name,
        description: projects[req.params.id].description,
        technologies: projects[req.params.id].technologies,
        live_link: projects[req.params.id].live_link,
        github_link: projects[req.params.id].github_link,
        image_urls: projects[req.params.id].image_urls
    });
});

/* ERROR HANDLERS */
/* 404 to catch undefined or non-existent route requests */
app.use((req, res, next) => {
    res.status(404).render("not-found");
});

/* Global error handler */
app.use((err, req, res, next) => {
    if (err.status === 404) {
        console.log(err.status, err.message);
        res.status(404).render("not-found", { err });
    } else {
        err.message = err.message || `Oops! Something went wrong on the server!`
        res.status(err.status || 500).render('error', { err });
    }
})

app.listen(3000, () => {
    console.log("The application is running on localhost:3000!")
});