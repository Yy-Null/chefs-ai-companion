// src/pages/AddRecipePage.tsx (修正后)

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Recipe, Ingredient } from '../types';

interface AddRecipePageProps {
    recipes: Recipe[];
    setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
}

const AddRecipePage: React.FC<AddRecipePageProps> = ({ recipes, setRecipes }) => {
    const { recipeId } = useParams<{ recipeId: string }>();
    const navigate = useNavigate();
    const isEditing = Boolean(recipeId);

    const [recipeName, setRecipeName] = useState('');
    const [steps, setSteps] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: '', quantity: '', unit: '' }]);
    const [servings, setServings] = useState<number | string>(2);

    useEffect(() => {
        if (isEditing) {
            const recipeToEdit = recipes.find(r => r.id === Number(recipeId));
            if (recipeToEdit) {
                setRecipeName(recipeToEdit.name ?? '');
                setSteps(recipeToEdit.steps ?? '');
                setTagsInput((recipeToEdit.tags ?? []).join(', '));
                setServings(recipeToEdit.servings ?? 2);
                const editableIngredients = Array.isArray(recipeToEdit.ingredients)
                    ? recipeToEdit.ingredients.map(ing => ({ ...ing, quantity: String(ing.quantity) }))
                    : [{ name: '', quantity: '', unit: '' }];
                setIngredients(editableIngredients.length > 0 ? editableIngredients : [{ name: '', quantity: '', unit: '' }]);
            } else {
                alert('指定されたレシピが見つかりません。');
                navigate('/');
            }
        }
    }, [recipeId, recipes, isEditing, navigate]);

    const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = { ...newIngredients[index], [field]: value };
        setIngredients(newIngredients);
    };

    const addIngredientRow = () => {
        setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
    };

    const removeIngredientRow = (index: number) => {
        if (ingredients.length > 1) {
            setIngredients(ingredients.filter((_, i) => i !== index));
        }
    };

    const handleSaveOrUpdateRecipe = () => {
        if (!recipeName.trim() || !steps.trim()) {
            alert('レシピ名と作り方を入力してください！');
            return;
        }
        const finalServings = Math.max(1, typeof servings === 'string' ? parseInt(servings, 10) || 1 : servings);
        const finalIngredients = ingredients
            .map(ing => ({
                name: ing.name.trim(),
                quantity: parseFloat(String(ing.quantity)) || 0,
                unit: ing.unit.trim(),
            }))
            .filter(ing => ing.name !== '' && ing.quantity > 0);
        if (finalIngredients.length === 0) {
            alert('有効な材料を少なくとも1つ入力してください！ (材料名と数量が必要です)');
            return;
        }
        const tags = tagsInput.split(/[\s,，]+/).filter(tag => tag.trim() !== '');
        const newRecipeData = { name: recipeName, servings: finalServings, ingredients: finalIngredients, steps, tags };

        if (isEditing) {
            setRecipes(recipes.map(recipe => recipe.id === Number(recipeId) ? { ...recipe, ...newRecipeData, id: Number(recipeId) } : recipe));
        } else {
            setRecipes([...recipes, { id: Date.now(), ...newRecipeData }]);
        }

        navigate('/');
    };

    // ▼▼▼ 核心修正: 定义 styles 对象 ▼▼▼
    const styles: { [key: string]: React.CSSProperties } = {
        formContainer: { background: '#f9f9f9', padding: '24px', borderRadius: '8px', margin: '20px 0', border: '1px solid #e0e0e0' },
        formGroup: { marginBottom: '16px' },
        label: { display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333' },
        inputBase: { width: '100%', padding: '10px 12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px', boxSizing: 'border-box' },
        buttonContainer: { marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' },
        button: { padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
        buttonPrimary: { background: '#007bff', color: 'white' },
        buttonSecondary: { background: '#6c757d', color: 'white' }
    };
    // ▲▲▲▲▲ 核心修正 ▲▲▲▲▲

    return (
        <div style={styles.formContainer}>
            <h2 style={{ marginTop: 0, marginBottom: '20px' }}>{isEditing ? 'レシピを編集' : '新しいレシピを作成'}</h2>
            <div style={styles.formGroup}><label htmlFor="recipeName" style={styles.label}>レシピ名:</label><input id="recipeName" style={styles.inputBase} value={recipeName} onChange={(e) => setRecipeName(e.target.value)} placeholder="例：トマトと卵の炒め物" /></div>
            <div style={styles.formGroup}><label htmlFor="servings" style={styles.label}>何人分:</label><input id="servings" type="number" style={{ ...styles.inputBase, width: '100px' }} value={servings} min="1" onChange={(e) => setServings(e.target.value)} placeholder="例: 2" /></div>
            <div style={styles.formGroup}>
                <label style={styles.label}>材料:</label>
                {ingredients.map((ing, index) => (
                    <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                        <input style={{ ...styles.inputBase, flex: '3' }} placeholder="材料名 (例: トマト)" value={ing.name} onChange={(e) => handleIngredientChange(index, 'name', e.target.value)} />
                        <input type="text" style={{ ...styles.inputBase, flex: '1' }} placeholder="数量" value={ing.quantity} onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)} />
                        <input style={{ ...styles.inputBase, flex: '1' }} placeholder="単位 (例: 個, g)" value={ing.unit} onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)} />
                        <button onClick={() => removeIngredientRow(index)} style={{ ...styles.button, background: '#dc3545', color: 'white', padding: '8px 12px', visibility: ingredients.length > 1 ? 'visible' : 'hidden' }}>-</button>
                    </div>
                ))}
                <button onClick={addIngredientRow} style={{ ...styles.button, ...styles.buttonSecondary, padding: '8px 15px', marginTop: '8px' }}>+ 材料を追加</button>
            </div>
            <div style={styles.formGroup}><label htmlFor="steps" style={styles.label}>作り方（一行ずつ）:</label><textarea id="steps" style={{ ...styles.inputBase, minHeight: '120px', resize: 'vertical' }} value={steps} onChange={(e) => setSteps(e.target.value)} placeholder="例：&#10;1. トマトを切り、卵を溶く。" /></div>
            <div style={styles.formGroup}><label htmlFor="tags" style={styles.label}>タグ（コンマやスペースで区切る）:</label><input id="tags" style={styles.inputBase} value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="例：定番, 簡単, 牛肉" /></div>
            <div style={styles.buttonContainer}>
                <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={() => navigate('/')}>キャンセル</button>
                <button style={{ ...styles.button, ...styles.buttonPrimary }} onClick={handleSaveOrUpdateRecipe}>{isEditing ? 'レシピを更新' : 'レシピを追加'}</button>
            </div>
        </div>
    );
};

export default AddRecipePage;