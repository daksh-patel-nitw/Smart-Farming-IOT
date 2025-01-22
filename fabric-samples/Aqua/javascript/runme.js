// app.js

const enrollAdmin = require('./enrollAdmin');
const registerUser = require('./register');

async function main() {
    try {
        await enrollAdmin();
        await registerUser();
        console.log('Registration process completed successfully');
    } catch (error) {
        console.error(`Error during registration process: ${error}`);
        process.exit(1);
    }
}

main();
