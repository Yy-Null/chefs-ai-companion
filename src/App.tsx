// src/App.tsx (大大简化后)

import React, { useState, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from './pages/Layout';
import HomePage from './pages/HomePage';
import AddRecipePage from './pages/AddRecipePage'; // 导入新页面
import ShoppingListModal from './ShoppingListModal';
import Preferences from './Preferences';

import useLocalStorage from './useLocalStorage';
import type { Recipe } from './types';
import RecipeDetailPage from './pages/RecipeDetailPage';

function App() {
  // 状态管理被大大简化，只保留核心数据和全局UI状态
  const [recipes, setRecipes] = useLocalStorage<Recipe[]>('recipes', []);
  const [likes, setLikes] = useLocalStorage<string[]>('likes', []);
  const [dislikes, setDislikes] = useLocalStorage<string[]>('dislikes', []);
  const [allergies, setAllergies] = useLocalStorage<string[]>('allergies', []);
  
  const [isShoppingListModalOpen, setIsShoppingListModalOpen] = useState(false);
  const [isPrefModalOpen, setIsPrefModalOpen] = useState(false);
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  const [selectedRecipeIds, setSelectedRecipeIds] = useState<number[]>([]);

  // 购物清单的生成逻辑需要留在这里，因为它依赖 `selectedRecipeIds`
  const generateShoppingList = () => { /* ... 之前的 generateShoppingList 函数代码 ... */ };
  
  // 偏好设置更新逻辑也保留
  const handleUpdatePreferences = (type: 'likes' | 'dislikes' | 'allergies', action: 'add' | 'remove', value: string) => {
    const setters = { likes: setLikes, dislikes: setDislikes, allergies: setAllergies };
    setters[type](items => action === 'add' ? (items.includes(value) ? items : [...items, value]) : items.filter(i => i !== value));
  };
  
  // 删除菜谱的逻辑也保留
  const handleDeleteRecipe = (idToDelete: number) => {
    setRecipes(recipes.filter(recipe => recipe.id !== idToDelete));
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout onOpenPreferences={() => setIsPrefModalOpen(true)} />}>
          <Route 
            index 
            element={
              <HomePage
                recipes={recipes}
                likes={likes}
                dislikes={dislikes}
                allergies={allergies}
                selectedRecipeIds={selectedRecipeIds}
                setSelectedRecipeIds={setSelectedRecipeIds}
                onDelete={handleDeleteRecipe}
                onGenerateShoppingList={generateShoppingList}
              />
            } 
          />
          <Route path="new" element={<AddRecipePage recipes={recipes} setRecipes={setRecipes} />} />
          <Route path="edit/:recipeId" element={<AddRecipePage recipes={recipes} setRecipes={setRecipes} />} />
          <Route path="recipe/:recipeId" element={<RecipeDetailPage recipes={recipes} />} />
        </Route>
      </Routes>

      <ShoppingListModal isOpen={isShoppingListModalOpen} onClose={() => setIsShoppingListModalOpen(false)} list={shoppingList} />
      <Preferences 
        isOpen={isPrefModalOpen} 
        onClose={() => setIsPrefModalOpen(false)} 
        likes={likes} 
        dislikes={dislikes} 
        allergies={allergies} 
        onUpdatePreferences={handleUpdatePreferences} 
      />
    </>
  );
}

export default App;