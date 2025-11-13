// src/types.ts

/**
 * 代表单一食材的结构
 */
export interface Ingredient {
    name: string;
    // 使用 number | string 是为了更好的用户输入体验，
    // 允许输入框在输入过程中暂时为空或非数字。
    // 在保存时，我们会将其转换为纯 number 类型。
    quantity: number | string;
    unit: string;
}

/**
 * 代表一个完整菜谱的结构
 */
export interface Recipe {
    id: number;
    name: string;
    // 新增：菜谱的原始设计份量，这是份量换算功能的基础
    servings: number;
    // **核心修改**: 从 string 变为 Ingredient[]
    ingredients: Ingredient[];
    // 保持 string 类型，方便用户一次性粘贴。未来可优化为 string[]
    steps: string;
    tags: string[];
}