// src/pages/HomePage.tsx (更新事件处理)

import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Recipe } from '../types';
import RecipeCard from '../RecipeCard';

interface HomePageProps {
    recipes: Recipe[];
    likes: string[];
    dislikes: string[];
    allergies: string[];
    selectedRecipeIds: number[];
    setSelectedRecipeIds: React.Dispatch<React.SetStateAction<number[]>>;
    onDelete: (id: number) => void;
    onGenerateShoppingList: () => void;
}

const HomePage: React.FC<HomePageProps> = ({
    recipes,
    likes,
    dislikes,
    allergies,
    selectedRecipeIds,
    setSelectedRecipeIds,
    onDelete,
    onGenerateShoppingList,
}) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    const handleEdit = (recipe: Recipe) => {
        navigate(`/edit/${recipe.id}`);
    };

    const handleSelectionChange = (id: number) => {
        setSelectedRecipeIds(prev => prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]);
    };

    const allTags = useMemo(() => {
        const tagSet = new Set<string>();
        recipes.forEach(recipe => {
            (recipe.tags || []).forEach(tag => tagSet.add(tag));
        });
        return Array.from(tagSet);
    }, [recipes]);

    const filteredRecipes = useMemo(() => {
        return recipes
            .filter(recipe => !selectedTag || (recipe.tags || []).includes(selectedTag))
            .filter(recipe => {
                if (!searchTerm) return true;
                const lowercasedSearchTerm = searchTerm.toLowerCase();
                const ingredientsText = Array.isArray(recipe.ingredients) ? recipe.ingredients.map(ing => ing.name).join(' ') : (recipe.ingredients || '');
                const recipeText = `${recipe.name} ${ingredientsText} ${recipe.steps}`.toLowerCase();
                return recipeText.includes(lowercasedSearchTerm);
            });
    }, [recipes, searchTerm, selectedTag]);

    const styles: { [key: string]: React.CSSProperties } = {
        inputBase: { width: '100%', padding: '10px 12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px', boxSizing: 'border-box' },
        button: { padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
        buttonPrimary: { background: '#007bff', color: 'white' },
    };

    return (
        <div>
            <Link to="/new">
                <button style={{ ...styles.button, ...styles.buttonPrimary }}>+ 新しいレシピを作成</button>
            </Link>
            <hr style={{ margin: '20px 0' }} />
            <h2>マイレシピ一覧</h2>
            <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <button onClick={() => setSelectedTag(null)} style={{ fontWeight: selectedTag === null ? 'bold' : 'normal' }}>すべてのレシピ</button>
                {allTags.map(tag => <button key={tag} onClick={() => setSelectedTag(tag)} style={{ fontWeight: selectedTag === tag ? 'bold' : 'normal' }}>{tag}</button>)}
            </div>
            <div style={{ marginBottom: '20px' }}>
                <input type="text" placeholder="レシピを検索..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={styles.inputBase} />
            </div>

            {selectedRecipeIds.length > 0 && <div style={{ marginBottom: '20px' }}><button style={{ ...styles.button, ...styles.buttonPrimary }} onClick={onGenerateShoppingList}>選択中の {selectedRecipeIds.length} 件から買い物リストを作成</button></div>}

            <ul style={{ listStyle: 'none', padding: 0 }}>
                {filteredRecipes.map((recipe) => (
                    <Link
                        key={recipe.id}
                        to={`/recipe/${recipe.id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <RecipeCard
                            recipe={recipe}
                            onDelete={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(recipe.id); }}
                            onEdit={(e) => { e.preventDefault(); e.stopPropagation(); handleEdit(recipe); }}
                            isSelected={selectedRecipeIds.includes(recipe.id)}
                            onSelectionChange={(e, id) => { e.preventDefault(); e.stopPropagation(); handleSelectionChange(id); }}
                        />
                    </Link>
                ))}
            </ul>

            {filteredRecipes.length === 0 && recipes.length > 0 && <p style={{ textAlign: 'center', color: '#666' }}>検索结果に一致するレシピはありません。</p>}
        </div>
    );
};

export default HomePage;