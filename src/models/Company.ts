import mongoose, { Schema, Document } from 'mongoose';

interface ICompany extends Document {
    name: string;
    address: string;
    contactNumber: string;
}

const CompanySchema: Schema = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    contactNumber: { type: String, required: true }
});

const Company = mongoose.model<ICompany>('Company', CompanySchema);
export default Company;
