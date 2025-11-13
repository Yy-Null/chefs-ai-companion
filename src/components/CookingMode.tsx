// src/components/CookingMode.tsx (新建文件)

import React, { useState, useMemo } from 'react';
import type { Recipe } from '../types';

interface CookingModeProps {
    recipe: Recipe;
    onClose: () => void;
}

const CookingMode: React.FC<CookingModeProps> = ({ recipe, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);

    // 将步骤文本分割成数组，并过滤掉空行
    const steps = useMemo(() => {
        return (recipe.steps || '').split('\n').filter(step => step.trim() !== '');
    }, [recipe.steps]);

    const totalSteps = steps.length;

    const goToNextStep = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const goToPrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    if (totalSteps === 0) {
        return (
            <div style={styles.overlay} onClick={onClose}>
                <div style={styles.modal} onClick={e => e.stopPropagation()}>
                    <button style={styles.closeButton} onClick={onClose}>×</button>
                    <p>このレシピには作り方の手順がありません。</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <button style={styles.closeButton} onClick={onClose}>×</button>

                <div style={styles.header}>
                    <h3>{recipe.name}</h3>
                    <p style={styles.stepCounter}>ステップ {currentStep + 1} / {totalSteps}</p>
                </div>

                <div style={styles.content}>
                    <p style={styles.stepText}>{steps[currentStep]}</p>
                </div>

                <div style={styles.navigation}>
                    <button onClick={goToPrevStep} disabled={currentStep === 0} style={styles.navButton}>
                        戻る
                    </button>
                    {currentStep < totalSteps - 1 ? (
                        <button onClick={goToNextStep} style={{ ...styles.navButton, ...styles.nextButton }}>
                            次へ
                        </button>
                    ) : (
                        <button onClick={onClose} style={{ ...styles.navButton, ...styles.finishButton }}>
                            完了
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// 样式对象
const styles: { [key: string]: React.CSSProperties } = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1001, // 比其他弹窗层级更高
    },
    modal: {
        background: 'white',
        padding: '30px 40px',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '700px',
        height: '70vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    },
    closeButton: {
        position: 'absolute', top: '15px', right: '15px',
        background: 'transparent', border: 'none',
        fontSize: '28px', cursor: 'pointer', color: '#888',
    },
    header: {
        textAlign: 'center',
        borderBottom: '1px solid #eee',
        paddingBottom: '15px',
    },
    stepCounter: {
        color: '#007bff',
        fontWeight: 'bold',
        fontSize: '1.2em',
        margin: '0',
    },
    content: {
        flex: 1, // 占据所有可用空间
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflowY: 'auto',
        padding: '20px 0',
    },
    stepText: {
        fontSize: '2.5em', // 大字体
        lineHeight: '1.5',
        textAlign: 'center',
        fontWeight: 300,
    },
    navigation: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: '20px',
        borderTop: '1px solid #eee',
    },
    navButton: {
        padding: '12px 30px',
        fontSize: '1.1em',
        borderRadius: '8px',
        border: '1px solid #ccc',
        cursor: 'pointer',
    },
    nextButton: {
        background: '#007bff',
        color: 'white',
        border: 'none',
    },
    finishButton: {
        background: '#28a745',
        color: 'white',
        border: 'none',
    }
};

export default CookingMode;