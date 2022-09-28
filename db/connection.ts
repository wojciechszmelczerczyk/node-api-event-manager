import mongoose from "mongoose";

export const connection = async (uri) => mongoose.connect(uri);
