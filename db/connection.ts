import mongoose from "mongoose";

export const connection = async (uri) => mongoose.connect(uri);

export const disconnect = async () => mongoose.disconnect();
