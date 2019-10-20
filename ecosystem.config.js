{
    apps: [{
        name: "jmrc-nodejs",
        script: "app.js",
        exec: "bin/www",
        watch: true,
        env: {
            "NODE_ENV": "development",
        },
        env_production: {
            "NODE_ENV": "production"
        }
    }]
}