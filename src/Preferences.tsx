// src/Preferences.tsx (更新后)

import React, { useState } from 'react';

// =================================================================
// 子组件：PreferenceSection (保持不变)
// =================================================================
interface PreferenceSectionProps {
    title: string;
    items: string[];
    onAddItem: (item: string) => void;
    onRemoveItem: (item: string) => void;
}

const PreferenceSection: React.FC<PreferenceSectionProps> = ({ title, items, onAddItem, onRemoveItem }) => {
    const [input, setInput] = useState('');

    const handleAdd = () => {
        if (input.trim()) {
            onAddItem(input.trim());
            setInput('');
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // 防止回车触发表单提交
            handleAdd();
        }
    };

    return (
        <div style={{ marginBottom: '20px' }}>
            <h4>{title}</h4>
            <div style={{ minHeight: '30px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {items.map(item => (
                    <span key={item} style={{ display: 'inline-flex', alignItems: 'center', background: '#e9ecef', padding: '5px 10px', borderRadius: '15px', marginBottom: '5px' }}>
                        {item}
                        <button onClick={() => onRemoveItem(item)} style={{ marginLeft: '8px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'red', fontSize: '16px', padding: '0 5px', lineHeight: '1' }}>×</button>
                    </span>
                ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="追加..."
                    style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <button onClick={handleAdd} style={{ padding: '8px 15px' }}>追加</button>
            </div>
        </div>
    );
};

// =================================================================
// 主组件：Preferences
// =================================================================
type PreferenceType = 'likes' | 'dislikes' | 'allergies';

interface PreferencesProps {
    // ▼▼▼ 新增 isOpen prop ▼▼▼
    isOpen: boolean; 
    // ▲▲▲ 新增 isOpen prop ▲▲▲
    likes: string[];
    dislikes: string[];
    allergies: string[];
    onUpdatePreferences: (type: PreferenceType, action: 'add' | 'remove', value: string) => void;
    onClose: () => void;
}

const Preferences: React.FC<PreferencesProps> = ({ isOpen, likes, dislikes, allergies, onUpdatePreferences, onClose }) => {
    
    // ▼▼▼ 核心修改：如果 isOpen 为 false，则不渲染任何东西 ▼▼▼
    if (!isOpen) {
        return null;
    }
    // ▲▲▲ 核心修改 ▲▲▲

    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const preferenceSections: { key: PreferenceType; title: string; items: string[] }[] = [
        { key: 'likes', title: '好きな食材・味 (例: 牛肉, スパイシー)', items: likes },
        { key: 'dislikes', title: '苦手なもの (例: パクチー, ゴーヤ)', items: dislikes },
        { key: 'allergies', title: 'アレルギー (例: ピーナッツ, 甲殻類)', items: allergies },
    ];

    return (
        <div
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}
            onClick={onClose}
        >
            <div
                style={{ background: 'white', padding: '20px 30px', borderRadius: '8px', width: '90%', maxWidth: '500px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
                onClick={handleContentClick}
            >
                <h2 style={{ marginTop: 0 }}>好み設定</h2>

                {preferenceSections.map(section => (
                    <PreferenceSection
                        key={section.key}
                        title={section.title}
                        items={section.items}
                        onAddItem={(item) => onUpdatePreferences(section.key, 'add', item)}
                        onRemoveItem={(item) => onUpdatePreferences(section.key, 'remove', item)}
                    />
                ))}

                <div style={{ textAlign: 'right', marginTop: '10px' }}>
                    <button onClick={onClose} style={{ padding: '10px 20px' }}>完了</button>
                </div>
            </div>
        </div>
    );
};

export default Preferences;