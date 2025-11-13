// src/RecipeCard.tsx (增加对 props 的防御性检查)

import React, { useState, useMemo } from 'react';
import type { Recipe } from './types';
import { calorieData } from './data/calorieData';

function calculateTotalCalories(ingredients: Recipe['ingredients'] | string): number {
    const ingredientsArray = Array.isArray(ingredients) ? ingredients : [];
    const total = ingredientsArray.reduce((sum, ing) => {
        const foodData = calorieData.get(ing.name);
        if (foodData && typeof ing.quantity === 'number') {
            return sum + foodData.calories * ing.quantity;
        }
        return sum;
    }, 0);
    return Math.round(total);
}

interface RecipeCardProps {
    recipe: Recipe;
    onDelete: (e: React.MouseEvent) => void;
    onEdit: (e: React.MouseEvent) => void;
    isSelected: boolean;
    onSelectionChange: (e: React.MouseEvent | React.ChangeEvent<HTMLInputElement>, id: number) => void;
    likes: string[];
    dislikes: string[];
    allergies: string[];
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onDelete, onEdit, isSelected, onSelectionChange, likes, dislikes, allergies }) => {

    const safeIngredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
    const safeServings = recipe.servings || 1;

    const totalCaloriesPerServing = useMemo(() => {
        const total = calculateTotalCalories(recipe.ingredients);
        return safeServings > 0 ? Math.round(total / safeServings) : 0;
    }, [recipe.ingredients, safeServings]);

    // ▼▼▼ 核心修正：在使用 props 前，确保它们是数组 ▼▼▼
    const preferenceAnalysis = useMemo(() => {
        // 提供默认空数组，防止 props 为 undefined
        const safeLikes = likes || [];
        const safeDislikes = dislikes || [];
        const safeAllergies = allergies || [];

        const ingredientsText = safeIngredients.map(ing => ing.name).join(' ').toLowerCase();
        const fullText = `${recipe.name.toLowerCase()} ${ingredientsText}`;

        const warnings = [...safeDislikes, ...safeAllergies].filter(item => item && fullText.includes(item.toLowerCase()));

        return {
            warnings,
            isLiked: warnings.length === 0 && safeLikes.some(item => item && fullText.includes(item.toLowerCase()))
        };
    }, [recipe.name, safeIngredients, likes, dislikes, allergies]);
    // ▲▲▲▲▲ 核心修正 ▲▲▲▲▲

    const borderColor = useMemo(() => preferenceAnalysis.warnings.length > 0 ? '#dc3545' : preferenceAnalysis.isLiked ? '#28a745' : isSelected ? '#007bff' : '#eee', [preferenceAnalysis, isSelected]);

    const buttonStyles: { [key: string]: React.CSSProperties } = {
        base: { padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
        edit: { background: '#28a745', color: 'white', marginRight: '10px' },
        delete: { background: '#dc3545', color: 'white' }
    };

    return (
        <li style={{ border: `2px solid ${borderColor}`, padding: '15px', marginBottom: '10px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', transition: 'border-color 0.3s', cursor: 'pointer' }}>
            {preferenceAnalysis.warnings.length > 0 && <div style={{ color: '#dc3545', fontWeight: 'bold', marginBottom: '10px', fontSize: '14px' }}>⚠️ 注意：苦手・アレルギーの食材が含まれています：{preferenceAnalysis.warnings.join(', ')}</div>}
            {preferenceAnalysis.isLiked && <div style={{ color: '#28a745', fontWeight: 'bold', marginBottom: '10px', fontSize: '14px' }}>👍 おすすめ：好みの食材が含まれています！</div>}

            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '10px' }}>
                <h3 style={{ margin: 0, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{recipe.name}</h3>
                <label
                    onClick={(e) => e.stopPropagation()}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0, whiteSpace: 'nowrap' }}
                >
                    <input type="checkbox" checked={isSelected} onChange={(e) => onSelectionChange(e, recipe.id)} style={{ marginRight: '5px', cursor: 'pointer' }} />
                    買い物リスト
                </label>
            </header>

            {(recipe.tags && recipe.tags.length > 0) && <div style={{ marginBottom: '15px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>{recipe.tags.map(tag => <span key={tag} style={{ background: '#e9ecef', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', color: '#495057' }}># {tag}</span>)}</div>}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', padding: '10px', background: '#f8f9fa', borderRadius: '4px', fontSize: '14px' }}>
                <div><strong>カロリー (1人分):</strong> {totalCaloriesPerServing > 0 ? `${totalCaloriesPerServing} kcal` : '計算不可'}</div>
                <div><strong>{safeServings}人分</strong></div>
            </div>

            <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px', height: '40px', overflow: 'hidden' }}>
                材料: {safeIngredients.map(ing => ing.name).join(', ')}
            </p>

            <footer style={{ marginTop: '20px', textAlign: 'right' }}>
                <button onClick={onEdit} style={{ ...buttonStyles.base, ...buttonStyles.edit }}>編集</button>
                <button onClick={onDelete} style={{ ...buttonStyles.base, ...buttonStyles.delete }}>削除</button>
            </footer>
        </li>
    );
};

export default RecipeCard;