import { Category } from "../models/article";

export const seedCategories = async () => {
  try {
    await Category.create([
      { name: "Entertainment" },
      { name: "Sport" },
      { name: "Personal Development" },
      { name: "Business" },
      { name: "Travel" },
    ]);
    console.log("Seeding Success");
  } catch (error) {
    console.log("Error seeding database categories" + error);
  }
};
