// src/RecipeCard.tsx
import React, { useState, useMemo } from 'react';
import type { Recipe } from './types';
import { calorieData } from './data/calorieData';

interface RecipeCardProps {
    recipe: Recipe;
    onDelete: (id: number) => void;
    onEdit: (recipe: Recipe) => void;
    isSelected: boolean;
    onSelectionChange: (id: number) => void;
    likes: string[];
    dislikes: string[];
    allergies: string[];
}

interface ParsedIngredient { original: string; name: string; amount: number | null; unit: string; }
const ingredientRegex = /(.*?)(\d+\.?\d*)(.*)/;

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onDelete, onEdit, isSelected, onSelectionChange, likes, dislikes, allergies }) => {
    const [servings, setServings] = useState(1);
    const parsedIngredients = useMemo<ParsedIngredient[]>(() => (recipe.ingredients ?? '').split('\n').filter(l => l.trim() !== '').map(l => {
        const match = l.match(ingredientRegex);
        return match ? { original: l, name: match[1].trim(), amount: parseFloat(match[2]), unit: match[3].trim() } : { original: l, name: l.trim(), amount: null, unit: '' };
    }), [recipe.ingredients]);
    const totalCalories = useMemo(() => Math.round(parsedIngredients.reduce((sum, ing) => (calorieData.get(ing.name) && ing.amount) ? sum + calorieData.get(ing.name)!.calories * ing.amount : sum, 0)), [parsedIngredients]);
    const preferenceAnalysis = useMemo(() => {
        const text = `${recipe.name} ${recipe.ingredients} ${recipe.steps}`.toLowerCase();
        const warnings = [...dislikes, ...allergies].filter(item => text.includes(item.toLowerCase()));
        return { warnings, isLiked: warnings.length === 0 && likes.some(item => text.includes(item.toLowerCase())) };
    }, [recipe, likes, dislikes, allergies]);
    const borderColor = useMemo(() => preferenceAnalysis.warnings.length > 0 ? '#dc3545' : preferenceAnalysis.isLiked ? '#28a745' : isSelected ? '#007bff' : '#ccc', [preferenceAnalysis, isSelected]);
    const buttonStyles: { [key: string]: React.CSSProperties } = {
        base: { padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
        edit: { background: '#28a745', color: 'white', marginRight: '10px' },
        delete: { background: '#dc3545', color: 'white' }
    };

    return (
        <li style={{ border: `2px solid ${borderColor}`, padding: '15px', marginBottom: '10px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', transition: 'border-color 0.3s' }}>
            {preferenceAnalysis.warnings.length > 0 && <div style={{ color: '#dc3545', fontWeight: 'bold', marginBottom: '10px', fontSize: '14px' }}>⚠️ 注意：苦手・アレルギーの食材が含まれています：{preferenceAnalysis.warnings.join(', ')}</div>}
            {preferenceAnalysis.isLiked && <div style={{ color: '#28a745', fontWeight: 'bold', marginBottom: '10px', fontSize: '14px' }}>👍 おすすめ：好みの食材が含まれています！</div>}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '10px' }}>
                <h3 style={{ margin: 0 }}>{recipe.name}</h3>
                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0, whiteSpace: 'nowrap' }}><input type="checkbox" checked={isSelected} onChange={() => onSelectionChange(recipe.id)} style={{ marginRight: '5px' }} />買い物リストに追加</label>
            </header>
            {(recipe.tags && recipe.tags.length > 0) && <div style={{ marginBottom: '15px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>{recipe.tags.map(tag => <span key={tag} style={{ background: '#e9ecef', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', color: '#495057' }}># {tag}</span>)}</div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', padding: '10px', background: '#f8f9fa', borderRadius: '4px', fontSize: '14px' }}>
                <div><strong>推定カロリー:</strong> {totalCalories > 0 ? `${totalCalories} kcal` : '計算不可'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><label htmlFor={`servings-${recipe.id}`}>分量:</label><input type="number" id={`servings-${recipe.id}`} value={servings} min="1" style={{ width: '50px', padding: '5px' }} onChange={(e) => setServings(parseInt(e.target.value, 10) || 1)} /><span>人分</span></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div><h4>材料:</h4>{parsedIngredients.map((ing, index) => <p key={index} style={{ margin: '2px 0' }}>{`${ing.name} ${(ing.amount !== null ? (ing.amount * servings).toFixed(1).replace(/\.0$/, '') : '')}${ing.unit ?? ''}`.trim()}</p>)}</div>
                <div><h4>作り方:</h4><ol style={{ paddingLeft: '20px', margin: 0 }}>{(recipe.steps ?? '').split('\n').filter(step => step.trim() !== '').map((step, index) => <li key={index} style={{ marginBottom: '5px' }}>{step}</li>)}</ol></div>
            </div>
            <footer style={{ marginTop: '20px', textAlign: 'right' }}><button onClick={() => onEdit(recipe)} style={{ ...buttonStyles.base, ...buttonStyles.edit }}>編集</button><button onClick={() => onDelete(recipe.id)} style={{ ...buttonStyles.base, ...buttonStyles.delete }}>削除</button></footer>
        </li>
    );
};

export default RecipeCard;