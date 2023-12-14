const express = require("express");
const { projects } = require("./data.json");
const path = require("path");

// set up an Express application
const app = express();

/**
 * MIDDLEWARE
 */
// set the Pug template engine as the default view engine
app.set("view engine", "pug");

// static files are served from the 'public' directory
app.use('/static', express.static(path.join(__dirname, 'public')));

/**
 * ROUTES
 */
app.get("/", (req, res) => {
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

app.get("*", (req, res, next) => {
    const err = new Error();
    // just for testing the global error handler
    err.status = 500;
    err.message = `Something went wrong on the server!`;
    // err.status = 404;
    // err.message = `It looks like the page requested doesn't exist.`;
    next(err);
})

/**
 * ERROR HANDLERS
 */
// 404 to catch undefined or non-existent route requests
app.use((err, req, res) => {
    res.render("not-found", { err });
});

// Global error handler
app.use((err, req, res, next) => {
    if (err.status === 404) {
        res.render("not-found", { err });
    } else {
        const err = new Error();
        err.message = err.message || `Oops! Something went wrong on the server!`;
        console.log(err.message);
        res.status(err.status || 500).render('error', { err });
    }
})

/**
 * RUN APP ON LOCALHOST
 */
app.listen(3000, () => {
    console.log("The application is running on localhost:3000!")
});