import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    address: string;
    nationality: string;
    contactNumber: string;
    email: string;
    password: string;
    role: 'customer' | 'driver' | 'company';
    companyId?: mongoose.Schema.Types.ObjectId;
}

const UserSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    address: { type: String, required: true },
    nationality: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'driver', 'company'], required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
