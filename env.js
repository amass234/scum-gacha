const envConfig = {
  dev: {
    READTOO_APP_API_KEY: "AIzaSyCE6u2JY9lbFoGW226MZY-wlghCzvubp7s",
    READTOO_APP_AUTH_DOMAIN: "scum-62abd.firebaseapp.com",
    READTOO_APP_PROJECT_ID: "scum-62abd",
    READTOO_APP_STORAGE_BUCKET: "scum-62abd.appspot.com",
    READTOO_APP_MESSAGING_SENDER_ID: "136430428960",
    READTOO_APP_MESSAGING_APP_ID: "1:136430428960:web:4f6a18e9395c899f81ed45",
    EADTOO_APP_MEASUREMENT_ID: "G-T9112R05QW",
  },
  preduction: {
    READTOO_APP_API_KEY: "AIzaSyCE6u2JY9lbFoGW226MZY-wlghCzvubp7s",
    READTOO_APP_AUTH_DOMAIN: "scum-62abd.firebaseapp.com",
    READTOO_APP_PROJECT_ID: "scum-62abd",
    READTOO_APP_STORAGE_BUCKET: "scum-62abd.appspot.com",
    READTOO_APP_MESSAGING_SENDER_ID: "136430428960",
    READTOO_APP_MESSAGING_APP_ID: "1:136430428960:web:4f6a18e9395c899f81ed45",
    EADTOO_APP_MEASUREMENT_ID: "G-T9112R05QW",
  },
};

let currentEnv = (process.browser ? window.ENV : process.env.ENV) || "dev";
currentEnv = currentEnv.trim();

let currentBuildID =
  (process.browser ? window.BUILD_ID : process.env.BUILD_ID) || "N/A";
envConfig[currentEnv].currentBuildID = currentEnv + " " + currentBuildID;

export default envConfig[currentEnv];
