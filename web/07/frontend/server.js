import express from "express";
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");

const app = express();

console.log("*******FRONTEND Server Configuration*******");
console.log("NODE_ENV        :", process.env.NODE_ENV);
console.log("API_BASE        :", process.env.API_BASE);
console.log("FRONTEND_ORIGIN :", process.env.FRONTEND_ORIGIN);
console.log("****************************************");

app.use(
    "/api",
    createProxyMiddleware({
        target: process.env.API_BASE,
        changeOrigin: true,
        pathRewrite: {
            "^/api": "",
        },
        on: {
            proxyReq: (proxyReq, req, res) => {
                console.log("Proxying request to API:", req.url);
            }
        },
    })
)


app.get("/frontend-config", (req, res) => {
    res.json({
        apiBase: process.env.API_BASE,
        frontendOrigin: process.env.FRONTEND_ORIGIN,
        nodeEnv: process.env.NODE_ENV,
    })
})

app.use(express.static('public'));

app.listen(process.env.PORT || 3000, () => {
    console.log("Frontend server started on port", process.env.PORT || 3000);
})