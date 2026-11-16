import {
  createCategorySchema,
  categoryIdSchema,
  updateCategorySchema,
  updateCategoryStatusSchema,
} from "./category.validation.js";
import {
  getActiveCategories,
  createCategory,
  updateCategory,
  updateCategoryStatus,
  getAllCategoriesAdmin,
} from "./category.service.js";

export const getActiveCategoriesController = async (req, res, next) => {
  try {
    const categories = await getActiveCategories();

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: {
        count: categories.length,
        categories,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createCategoryController = async (req, res, next) => {
  try {
    const validatedData = createCategorySchema.parse(req.body);

    const category = await createCategory({
      ...validatedData,
      imageFile: req.file,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategoryController = async (req, res, next) => {
  try {
    const categoryId = categoryIdSchema.parse(req.params.categoryId);
    const validatedData = updateCategorySchema.parse(req.body);

    if (Object.keys(validatedData).length === 0 && !req.file) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field or an image to update",
      });
    }
    
    const category = await updateCategory(categoryId, {
      ...validatedData,
      imageFile: req.file,
    });

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategoryStatusController = async (req, res, next) => {
  try {
    const categoryId = categoryIdSchema.parse(req.params.categoryId);
    const { isActive } = updateCategoryStatusSchema.parse(req.body);

    const category = await updateCategoryStatus(categoryId, isActive);

    return res.status(200).json({
      success: true,
      message: "Category status updated successfully",
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCategoriesAdminController = async (req, res, next) => {
  try {
    const categories = await getAllCategoriesAdmin();

    return res.status(200).json({
      success: true,
      message: "All categories fetched successfully",
      data: {
        count: categories.length,
        categories,
      },
    });
  } catch (error) {
    next(error);
  }
};
