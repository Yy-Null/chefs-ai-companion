// src/pages/RecipeDetailPage.tsx (更新后)

import React, { useState } from 'react'; // 导入 useState
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Recipe } from '../types';
import CookingMode from '../components/CookingMode'; // 导入 CookingMode 组件

interface RecipeDetailPageProps {
    recipes: Recipe[];
}

const RecipeDetailPage: React.FC<RecipeDetailPageProps> = ({ recipes }) => {
    const { recipeId } = useParams<{ recipeId: string }>();
    const navigate = useNavigate();

    // ▼▼▼ 新增 state，控制烹饪模式的显示 ▼▼▼
    const [isCookingMode, setIsCookingMode] = useState(false);
    // ▲▲▲ 新增 state ▲▲▲

    const recipe = recipes.find(r => r.id === Number(recipeId));

    if (!recipe) {
        return (
            <div>
                <h2>レシピが見つかりません</h2>
                <p>指定されたレシピは存在しないか、削除された可能性があります。</p>
                <Link to="/">ホームに戻る</Link>
            </div>
        );
    }

    const safeIngredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];

    return (
        <> {/* 使用 Fragment 包裹 */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '2em' }}>{recipe.name}</h2>
                    <div>
                        <button
                            onClick={() => navigate(`/edit/${recipe.id}`)}
                            style={{ marginRight: '10px', padding: '10px 15px' }}
                        >
                            編集
                        </button>
                        {/* ▼▼▼ 关联按钮到 state ▼▼▼ */}
                        <button
                            onClick={() => setIsCookingMode(true)}
                            style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            このレシピを作る
                        </button>
                        {/* ▲▲▲ 关联按钮到 state ▲▲▲ */}
                    </div>
                </div>
                {/* ... 页面其他部分保持不变 ... */}
            </div>

            {/* ▼▼▼ 条件渲染 CookingMode 组件 ▼▼▼ */}
            {isCookingMode && (
                <CookingMode
                    recipe={recipe}
                    onClose={() => setIsCookingMode(false)}
                />
            )}
            {/* ▲▲▲ 条件渲染 CookingMode 组件 ▲▲▲ */}
        </>
    );
};

export default RecipeDetailPage;