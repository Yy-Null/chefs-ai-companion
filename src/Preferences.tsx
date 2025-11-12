// src/Preferences.tsx

import React, { useState } from 'react';

// =================================================================
// 1. 子组件：PreferenceSection
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
            handleAdd();
        }
    };

    return (
        <div style={{ marginBottom: '20px' }}>
            <h4>{title}</h4>
            <div style={{ minHeight: '30px' }}>
                {items.map(item => (
                    <span key={item} style={{ display: 'inline-block', background: '#e9ecef', padding: '5px 10px', borderRadius: '15px', marginRight: '10px', marginBottom: '10px' }}>
                        {item}
                        <button onClick={() => onRemoveItem(item)} style={{ marginLeft: '10px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'red', fontSize: '16px', padding: '0 5px' }}>×</button>
                    </span>
                ))}
            </div>
            <div>
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="追加..."
                    style={{ marginRight: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <button onClick={handleAdd} style={{ padding: '8px 15px' }}>追加</button>
            </div>
        </div>
    );
};

// =================================================================
// 2. 主组件：Preferences
// =================================================================
type PreferenceType = 'likes' | 'dislikes' | 'allergies';

interface PreferencesProps {
    likes: string[];
    dislikes: string[];
    allergies: string[];
    onUpdatePreferences: (type: PreferenceType, action: 'add' | 'remove', value: string) => void;
    onClose: () => void;
}

const Preferences: React.FC<PreferencesProps> = ({ likes, dislikes, allergies, onUpdatePreferences, onClose }) => {

    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    // 中文备注：定义配置数组，实现数据驱动渲染。
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