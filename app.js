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

app.get("/projects/:id", (req, res, next) => {
    const project = projects.find(({ id }) => id === +req.params.id);
    if (project) {
        res.render('project', { project });
    } else {
        const err = new Error();
        err.status = 404;
        err.message = `It looks like the project requested doesn't exist.`;
        next(err);
    }
});

/* ERROR HANDLERS */
/* 404 to catch undefined or non-existent route requests */
app.use((req, res, next) => {
    res.status(404).render("not-found");
});

/* Global error handler */
app.use((err, req, res, next) => {
    if (err.status === 404) {
        res.render("not-found", { err });
    } else {
        const err = new Error();
        err.message = err.message || `Oops! Something went wrong on the server!`
        res.status(err.status || 500).render('error', { err });
    }
})

app.listen(3000, () => {
    console.log("The application is running on localhost:3000!")
});