// src/ShoppingListModal.tsx

import React from 'react';

interface ShoppingListModalProps {
    isOpen: boolean;
    onClose: () => void;
    list: string[];
}

const ShoppingListModal: React.FC<ShoppingListModalProps> = ({ isOpen, onClose, list }) => {
    if (!isOpen) {
        return null;
    }

    // 中文备注：使用.stopPropagation()可以防止点击内容区域时关闭弹窗
    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        // 背景蒙层
        <div
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1000 // 确保在最上层
            }}
            onClick={onClose} // 点击蒙层关闭
        >
            {/* 内容区域 */}
            <div
                style={{
                    background: 'white', padding: '20px 30px', borderRadius: '8px',
                    width: '90%', maxWidth: '400px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}
                onClick={handleContentClick}
            >
                <h2 style={{ marginTop: 0 }}>買い物リスト</h2>
                <ul style={{ paddingLeft: '20px', maxHeight: '60vh', overflowY: 'auto' }}>
                    {list.length > 0 ? (
                        list.map((item, index) => <li key={index} style={{ marginBottom: '8px' }}>{item}</li>)
                    ) : (
                        <p>購入する材料はありません。</p>
                    )}
                </ul>
                <div style={{ textAlign: 'right', marginTop: '20px' }}>
                    <button onClick={onClose} style={{ padding: '10px 20px' }}>閉じる</button>
                </div>
            </div>
        </div>
    );
};

export default ShoppingListModal;