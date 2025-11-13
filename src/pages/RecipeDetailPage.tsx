// src/pages/RecipeDetailPage.tsx (新建文件)

import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Recipe } from '../types';

interface RecipeDetailPageProps {
    recipes: Recipe[];
}

const RecipeDetailPage: React.FC<RecipeDetailPageProps> = ({ recipes }) => {
    const { recipeId } = useParams<{ recipeId: string }>();
    const navigate = useNavigate();

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

    // 确保 ingredients 是数组
    const safeIngredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];

    return (
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
                    {/* ▼▼▼ “开始烹饪”按钮的占位符 ▼▼▼ */}
                    <button
                        onClick={() => alert('烹饪模式即将推出！')}
                        style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        このレシピを作る
                    </button>
                    {/* ▲▲▲ “开始烹饪”按钮的占位符 ▲▲▲ */}
                </div>
            </div>

            <div style={{ margin: '20px 0', background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                <span><strong>{recipe.servings}人分</strong></span>
                {recipe.tags && recipe.tags.length > 0 && (
                    <span style={{ marginLeft: '20px' }}>
                        {recipe.tags.map(tag => (
                            <span key={tag} style={{ background: '#e9ecef', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', color: '#495057', marginRight: '8px' }}>
                                # {tag}
                            </span>
                        ))}
                    </span>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
                <div>
                    <h3>材料</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {safeIngredients.map((ing, index) => (
                            <li key={index} style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}>
                                <span>{ing.name}</span>
                                <span style={{ float: 'right' }}>{ing.quantity as number}{ing.unit}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3>作り方</h3>
                    <ol style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
                        {(recipe.steps || '').split('\n').filter(step => step.trim()).map((step, index) => (
                            <li key={index} style={{ marginBottom: '10px' }}>{step}</li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetailPage;