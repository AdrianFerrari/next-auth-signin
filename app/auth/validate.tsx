interface Values {
    name?: string;
    password?: string;
    confirmpass?: string;
}

export default function validate(values: Values) {
    const errors : Values = {};
    if (!values.name) {
        errors.name = 'Required';
    }

    if (!values.password) {
        errors.password = 'Required';
    }

    if (values.confirmpass) {
        if (values.confirmpass !== values.password)
            errors.confirmpass = 'Passwords are not the same'
    }

    return errors
}