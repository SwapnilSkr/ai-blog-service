import { mongoIdType, mongoStringType } from "./mongooseTypes";

export type userType = {
  _id?: mongoIdType;
  email?: mongoStringType;
  displayName?: mongoStringType;
  password?: mongoStringType;
};
