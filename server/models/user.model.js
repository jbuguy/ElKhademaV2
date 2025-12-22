import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new Schema(
    {
        username: {
            type: "string",
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            minLength: 1,
            maxLength: 30,
        },
        password: {
            type: "string",
            required: true,
            minLength: 6,
            maxLength: 50,
        },
        email: {
            type: "string",
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        birthday: {
            type: Date,
        },
        active: {
            type: Boolean,
            required: false,
        },
    },
    { timestamps: true }
);
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("user", userSchema);
