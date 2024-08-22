module.exports = {
  apps: [
    {
      name: "app",
      script: "./index.js",
      env: {
        PORT: 80,
        NODE_ENV: "production",
        JWT_SECRET: "RAHASIA",
        MONGGO_DB_URI:
          "mongodb+srv://rehanajinarwindo:Startmeup22@cluster0.ssg5qzo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
        REDIS_PW: "pVJ6VwfLCCYd9jXtouG4y9Bj0cN4Wzwv",
      },
    },
  ],
};
