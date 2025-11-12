// src/App.tsx (完全修正版)

import React, { useState, useMemo } from 'react';
import RecipeCard from './RecipeCard';
import ShoppingListModal from './ShoppingListModal';
import Preferences from './Preferences';
import useLocalStorage from './useLocalStorage';
import type { Recipe } from './types';

const ingredientRegex = /(.*?)(\d+\.?\d*)(.*)/;

function App() {
  // 1. 状态管理
  const [recipes, setRecipes] = useLocalStorage<Recipe[]>('recipes', []);
  const [likes, setLikes] = useLocalStorage<string[]>('likes', []);
  const [dislikes, setDislikes] = useLocalStorage<string[]>('dislikes', []);
  const [allergies, setAllergies] = useLocalStorage<string[]>('allergies', []);
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedRecipeIds, setSelectedRecipeIds] = useState<number[]>([]);
  const [isShoppingListModalOpen, setIsShoppingListModalOpen] = useState(false);
  const [isPrefModalOpen, setIsPrefModalOpen] = useState(false);
  const [shoppingList, setShoppingList] = useState<string[]>([]);

  // 2. 计算与派生状态
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    recipes.forEach(recipe => {
      recipe.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [recipes]);

  const filteredRecipes = useMemo(() => {
    return recipes
      .filter(recipe => !selectedTag || recipe.tags?.includes(selectedTag))
      .filter(recipe => {
        if (!searchTerm) return true;
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const recipeText = `${recipe.name} ${recipe.ingredients} ${recipe.steps}`.toLowerCase();
        return recipeText.includes(lowercasedSearchTerm);
      });
  }, [recipes, searchTerm, selectedTag]);

  // 3. 处理函数
  const resetForm = () => {
    setRecipeName('');
    setIngredients('');
    setSteps('');
    setTagsInput('');
    setEditingId(null);
  };

  const handleSaveOrUpdateRecipe = () => {
    if (!recipeName.trim() || !ingredients.trim() || !steps.trim()) {
      alert('レシピ名、材料、作り方を入力してください！');
      return;
    }
    const tags = tagsInput.split(/[\s,，]+/).filter(tag => tag.trim() !== '');
    if (editingId !== null) {
      setRecipes(recipes.map(recipe => recipe.id === editingId ? { ...recipe, name: recipeName, ingredients, steps, tags } : recipe));
    } else {
      setRecipes([...recipes, { id: Date.now(), name: recipeName, ingredients, steps, tags }]);
    }
    resetForm();
  };

  const handleDeleteRecipe = (idToDelete: number) => {
    setRecipes(recipes.filter(recipe => recipe.id !== idToDelete));
  };

  const handleEdit = (recipeToEdit: Recipe) => {
    setEditingId(recipeToEdit.id);
    setRecipeName(recipeToEdit.name ?? '');
    setIngredients(recipeToEdit.ingredients ?? '');
    setSteps(recipeToEdit.steps ?? '');
    setTagsInput((recipeToEdit.tags ?? []).join(', '));
  };

  const handleSelectionChange = (id: number) => {
    setSelectedRecipeIds(prev => prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]);
  };

  const handleUpdatePreferences = (type: 'likes' | 'dislikes' | 'allergies', action: 'add' | 'remove', value: string) => {
    const setters = { likes: setLikes, dislikes: setDislikes, allergies: setAllergies };
    setters[type](items => action === 'add' ? (items.includes(value) ? items : [...items, value]) : items.filter(i => i !== value));
  };

  const generateShoppingList = () => {
    const list = new Map<string, { amount: number, unit: string }>();
    const unquantified = new Set<string>();
    recipes.filter(r => selectedRecipeIds.includes(r.id)).forEach(r => (r.ingredients ?? '').split('\n').forEach(line => {
      const match = line.trim().match(ingredientRegex);
      if (match) {
        const [_, name, amountStr, unit] = match.map(s => s.trim());
        const key = `${name}|${unit}`;
        const current = list.get(key) || { amount: 0, unit };
        list.set(key, { ...current, amount: current.amount + parseFloat(amountStr) });
      } else if (line.trim()) unquantified.add(line.trim());
    }));
    const finalList = [...Array.from(list.entries()).map(([key, { amount, unit }]) => `${key.split('|')[0]} ${amount}${unit}`), ...Array.from(unquantified)];
    setShoppingList(finalList);
    setIsShoppingListModalOpen(true);
  };

  // 4. 统一样式对象
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

  // 5. 渲染逻辑 (JSX)
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>スマートレシピ帳</h1>
        <button onClick={() => setIsPrefModalOpen(true)}>⚙️ 好み設定</button>
      </header>
      <div style={styles.formContainer}>
        <h2 style={{ marginTop: 0, marginBottom: '20px' }}>{editingId ? 'レシピを編集' : '新しいレシピを作成'}</h2>
        <div style={styles.formGroup}><label htmlFor="recipeName" style={styles.label}>レシピ名:</label><input id="recipeName" style={styles.inputBase} value={recipeName} onChange={(e) => setRecipeName(e.target.value)} placeholder="例：トマトと卵の炒め物" /></div>
        <div style={styles.formGroup}><label htmlFor="ingredients" style={styles.label}>材料（一行ずつ）:</label><textarea id="ingredients" style={{ ...styles.inputBase, minHeight: '100px', resize: 'vertical' }} value={ingredients} onChange={(e) => setIngredients(e.target.value)} placeholder="例：&#10;トマト 2個&#10;卵 3個" /></div>
        <div style={styles.formGroup}><label htmlFor="steps" style={styles.label}>作り方（一行ずつ）:</label><textarea id="steps" style={{ ...styles.inputBase, minHeight: '120px', resize: 'vertical' }} value={steps} onChange={(e) => setSteps(e.target.value)} placeholder="例：&#10;1. トマトを切り、卵を溶く。" /></div>
        <div style={styles.formGroup}><label htmlFor="tags" style={styles.label}>タグ（コンマやスペースで区切る）:</label><input id="tags" style={styles.inputBase} value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="例：定番, 簡単, 牛肉" /></div>
        <div style={styles.buttonContainer}>
          {editingId && <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={resetForm}>編集をキャンセル</button>}
          <button style={{ ...styles.button, ...styles.buttonPrimary }} onClick={handleSaveOrUpdateRecipe}>{editingId ? 'レシピを更新' : 'レシピを追加'}</button>
        </div>
      </div>
      <hr />
      <h2>マイレシピ一覧</h2>
      <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        <button onClick={() => setSelectedTag(null)} style={{ fontWeight: selectedTag === null ? 'bold' : 'normal' }}>すべてのレシピ</button>
        {allTags.map(tag => <button key={tag} onClick={() => setSelectedTag(tag)} style={{ fontWeight: selectedTag === tag ? 'bold' : 'normal' }}>{tag}</button>)}
      </div>
      <div style={{ marginBottom: '20px' }}><input type="text" placeholder="レシピを検索..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={styles.inputBase} /></div>
      {selectedRecipeIds.length > 0 && <div style={{ marginBottom: '20px' }}><button onClick={generateShoppingList}>選択中の {selectedRecipeIds.length} 件から買い物リストを作成</button></div>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} onDelete={handleDeleteRecipe} onEdit={handleEdit} isSelected={selectedRecipeIds.includes(recipe.id)} onSelectionChange={handleSelectionChange} likes={likes} dislikes={dislikes} allergies={allergies} />)}
      </ul>
      {filteredRecipes.length === 0 && recipes.length > 0 && <p style={{ textAlign: 'center', color: '#666' }}>検索結果に一致するレシピはありません。</p>}
      <ShoppingListModal isOpen={isShoppingListModalOpen} onClose={() => setIsShoppingListModalOpen(false)} list={shoppingList} />
      {isPrefModalOpen && <Preferences likes={likes} dislikes={dislikes} allergies={allergies} onUpdatePreferences={handleUpdatePreferences} onClose={() => setIsPrefModalOpen(false)} />}
    </div>
  );
}

export default App;