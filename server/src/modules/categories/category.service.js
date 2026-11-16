import Category from "./category.model.js";
import uploadImageToCloudinary from "../../utils/upload-image.js";
import cloudinary from "../../config/cloudinary.js";

export const getActiveCategories = async () => {
  return Category.find({ isActive: true })
    .select("name slug description image")
    .sort({ name: 1 });
};

export const createCategory = async (categoryData) => {
  const slug = categoryData.name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const existingCategory = await Category.findOne({
    $or: [{ name: categoryData.name }, { slug: categoryData.slug }],
  });

  if (existingCategory) {
    const error = new Error("A category with this name or slug already exists");
    error.statusCode = 409;
    throw error;
  }

  let image = "";
  let imagePublicId = "";

  if (categoryData.imageFile) {
    const uploadedImage = await uploadImageToCloudinary(
      categoryData.imageFile.buffer,
      "doorassist/categories",
    );

    image = uploadedImage.imageUrl;
    imagePublicId = uploadedImage.publicId;
  }

  try {
    const category = await Category.create({
      name: categoryData.name,
      slug,
      description: categoryData.description,
      image,
      imagePublicId,
    });

    return category;
  } catch (error) {
    if (imagePublicId) {
      try {
        await cloudinary.uploader.destroy(imagePublicId);
      } catch (cleanupError) {
        console.error("Failed to clean up new category image:", cleanupError);
      }
    }

    if (error.code === 11000) {
      const duplicateError = new Error(
        "A category with this name or slug already exists",
      );
      duplicateError.statusCode = 409;
      throw duplicateError;
    }

    throw error;
  }
};

export const updateCategory = async (categoryId, updateData) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  if (updateData.name !== undefined) {
    category.name = updateData.name;

    category.slug = updateData.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  if (updateData.description !== undefined) {
    category.description = updateData.description;
  }

  let oldPublicId = null;
  let newPublicId = null;

  if (updateData.imageFile) {
    const uploadedImage = await uploadImageToCloudinary(
      updateData.imageFile.buffer,
      "doorassist/categories",
    );

    oldPublicId = category.imagePublicId;
    newPublicId = uploadedImage.publicId;

    category.image = uploadedImage.imageUrl;
    category.imagePublicId = newPublicId;
  }

  try {
    await category.save();
  } catch (error) {
    if (newPublicId) {
      try {
        await cloudinary.uploader.destroy(newPublicId);
      } catch (cleanupError) {
        console.error("Failed to clean up new category image:", cleanupError);
      }
    }

    if (error.code === 11000) {
      const duplicateError = new Error(
        "A category with this name or slug already exists",
      );
      duplicateError.statusCode = 409;
      throw duplicateError;
    }

    throw error;
  }

  if (oldPublicId) {
    try {
      await cloudinary.uploader.destroy(oldPublicId);
    } catch (error) {
      console.error("Failed to delete old category image:", error);
    }
  }

  return category;
};

export const updateCategoryStatus = async (categoryId, isActive) => {
  const category = await Category.findByIdAndUpdate(
    categoryId,
    { isActive },
    { returnDocument: "after", runValidators: true },
  );

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  return category;
};

export const getAllCategoriesAdmin = async () => {
  return Category.find()
    .sort({ createdAt: -1 })
    .select("name slug description image isActive createdAt");
};
