const validator = require("validator");

const validate = (data) => {
    console.log(data);

    const mandatoryField = ["firstName", "emailId", "password"];

    const IsAllowed = mandatoryField.every((k) => Object.keys(data).includes(k));
    console.log(IsAllowed);
    
    // Object.keys(data) will return an array

    if (!IsAllowed)
        throw new Error("Some Field Missing");

    if (!validator.isEmail(data.emailId))
        throw new Error("Invalid Email");

    if (!validator.isStrongPassword(data.password))
        throw new Error("Week Password");
};

module.exports = validate;
