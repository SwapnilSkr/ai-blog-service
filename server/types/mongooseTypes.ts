import mongoose from "mongoose";

//constants
export const mongoString = mongoose.Schema.Types.String;
export const mongoId = mongoose.Schema.Types.ObjectId;

//types
export type mongoIdType = mongoose.Types.ObjectId;
export type mongoStringType = mongoose.Schema.Types.String;
