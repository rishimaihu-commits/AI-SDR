import mongoose, { Schema, Document } from "mongoose";

export interface IPerson {
  name: string;
  title: string;
  email: string;
  organization_name: string;
  linkedin_url: string;
}

export interface IContact {
  company: string;
  domain: string;
}

export interface IFilters {
  industry?: string;
  companySize?: string;
  searchLimit?: string;
}

export interface ICampaign extends Document {
  name?: string;
  prompt?: string;
  filters?: IFilters;
  campaignPeople: IPerson[];
  campaignContacts: IContact[];
  createdAt: Date;
}

const PersonSchema: Schema = new Schema({
  name: String,
  title: String,
  email: String,
  organization_name: String,
  linkedin_url: String,
});

const ContactSchema: Schema = new Schema({
  company: String,
  domain: String,
});

const FiltersSchema: Schema = new Schema({
  industry: String,
  companySize: String,
  searchLimit: String,
});

const CampaignSchema: Schema = new Schema({
  name: { type: String, required: false },
  prompt: { type: String, required: false },
  filters: { type: FiltersSchema, required: false },
  campaignPeople: [PersonSchema],
  campaignContacts: [ContactSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ICampaign>("Campaign", CampaignSchema);
