export const flushLastDocument = async (Model) =>
  await Model.findOneAndDelete({}, { sort: { _id: -1 } });
