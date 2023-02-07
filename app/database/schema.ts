import { Schema, model, models, Document } from "mongoose";
import bcrypt from "bcrypt";

const SALT_WORK_FACTOR = 10;

const userAuthSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

userAuthSchema.pre("save", async function save(next) {
    if (!this.isModified("password")) return next();
    try {
        this.password = await bcrypt.hash(
            this.password,
            SALT_WORK_FACTOR
        );
        return next();
    } catch (err: any) {
        return next(err);
    }
});

userAuthSchema.methods.validatePassword = async function validatePassword(
    data: string
) {
    return bcrypt.compare(data, this.password);
};

interface IUser extends Document {
    name: string;
    password: string;
    validatePassword(a: string): boolean;
}

const User = models.user || model<IUser>('user', userAuthSchema);
export default User
